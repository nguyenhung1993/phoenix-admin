import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json({ error: 'Token và mật khẩu là bắt buộc' }, { status: 400 });
        }

        // 1. Validate Token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.json({ error: 'Mã khôi phục không hợp lệ hoặc đã được sử dụng' }, { status: 400 });
        }

        if (new Date() > verificationToken.expires) {
            // Delete expired token to keep DB clean
            await prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: verificationToken.identifier,
                        token: verificationToken.token,
                    }
                }
            });
            return NextResponse.json({ error: 'Mã khôi phục đã hết hạn. Vui lòng yêu cầu lại.' }, { status: 400 });
        }

        // 2. Hash new password
        const hashedPassword = await hash(password, 12);

        // 3. Update User & Delete Token in a transaction
        await prisma.$transaction(async (tx) => {
            // Update the user
            await tx.user.updateMany({
                where: { email: verificationToken.identifier.toLowerCase() },
                data: { password: hashedPassword }
            });

            // Delete the consumed token
            await tx.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: verificationToken.identifier,
                        token: verificationToken.token,
                    }
                }
            });
        });

        return NextResponse.json({ success: true, message: 'Mật khẩu đã được cập nhật thành công.' });

    } catch (error) {
        console.error('Lỗi khi reset password:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
