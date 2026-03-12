import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

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

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #bc2c26; text-align: center;">Phoenix HRMS</h2>
                <h3>Yêu cầu đặt lại mật khẩu</h3>
                <p>Xin chào ${user.name || 'bạn'},</p>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với địa chỉ email này.</p>
                <p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu. Link này sẽ hết hạn sau 1 giờ.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #bc2c26; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Đặt lại mật khẩu
                    </a>
                </div>
                <p>Nếu bạn không yêu cầu điều này, bạn có thể bỏ qua email này một cách an toàn.</p>
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
                <p style="color: #666; font-size: 12px; text-align: center;">
                    Đây là email tự động. Vui lòng không trả lời.
                </p>
            </div>
        `;

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
