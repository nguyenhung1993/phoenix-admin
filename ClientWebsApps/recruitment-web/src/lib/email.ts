import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { ReactElement } from 'react';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
export const EMAIL_FROM = process.env.EMAIL_FROM || '"Phoenix HR" <noreply@phoenix.com>';

export const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

/**
 * Send a plain HTML email via SMTP (legacy/internal notifications)
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
    if (!SMTP_HOST || !SMTP_USER) {
        console.warn('⚠️ SMTP not configured. Email skipped:', { to, subject });
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: EMAIL_FROM,
            to,
            subject,
            html,
        });
        console.log('📧 Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
};

/**
 * Send an email using a React Email template via SMTP.
 * Renders the React component to HTML, then sends via Nodemailer.
 * 
 * @example
 * await sendRecruitmentEmail(
 *   'candidate@example.com',
 *   'Xác nhận ứng tuyển',
 *   ApplicationReceivedEmail({ candidateName: 'Nguyễn Văn A', jobTitle: 'Frontend Dev' })
 * );
 */
export const sendRecruitmentEmail = async (
    to: string,
    subject: string,
    reactElement: ReactElement
) => {
    if (!SMTP_HOST || !SMTP_USER) {
        console.warn('⚠️ SMTP not configured. Recruitment email skipped:', { to, subject });
        return;
    }

    try {
        const html = await render(reactElement);
        const info = await transporter.sendMail({
            from: EMAIL_FROM,
            to,
            subject,
            html,
        });
        console.log('📧 Recruitment email sent:', info.messageId, '→', to);
        return info;
    } catch (error) {
        console.error('❌ Error sending recruitment email:', error);
        throw error;
    }
};
