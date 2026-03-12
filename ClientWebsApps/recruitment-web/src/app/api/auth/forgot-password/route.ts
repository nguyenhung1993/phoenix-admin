import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';
import { getResetPasswordEmailTemplate } from '@/lib/templates';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email là bắt buộc' }, { status: 400 });
        }

        // 1. Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        // We don't want to reveal whether a user exists or not for security reasons.
        // We always return success.
        if (!user) {
            return NextResponse.json({ success: true, message: 'Nếu email tồn tại, link khôi phục đã được gửi.' });
        }

        // 2. Generate token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

        // 3. Save token
        // Delete any existing tokens for this email first
        await prisma.verificationToken.deleteMany({
            where: { identifier: user.email }
        });

        await prisma.verificationToken.create({
            data: {
                identifier: user.email,
                token,
                expires,
            }
        });

        // 4. Send Email
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        const htmlContent = getResetPasswordEmailTemplate(user.name || 'bạn', resetUrl);

        await sendEmail(
            user.email,
            'Phoenix HRMS - Đặt lại mật khẩu',
            htmlContent
        );

        return NextResponse.json({ success: true, message: 'Link khôi phục đã được gửi.' });

    } catch (error) {
        console.error('Lỗi khi gửi email reset password:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
