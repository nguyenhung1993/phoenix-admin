import { NextRequest, NextResponse } from 'next/server';
import { sendRecruitmentEmail } from '@/lib/email';
import ApplicationReceivedEmail from '@/emails/application-received';
import InterviewInvitationEmail from '@/emails/interview-invitation';
import OfferLetterEmail from '@/emails/offer-letter';
import RejectionNotificationEmail from '@/emails/rejection-notification';

// Email template types
type EmailType = 'application-received' | 'interview-invitation' | 'offer-letter' | 'rejection';

interface SendEmailRequest {
    type: EmailType;
    to: string;
    data: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
    try {
        const body: SendEmailRequest = await request.json();
        const { type, to, data } = body;

        if (!to || !type) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc: to, type' },
                { status: 400 }
            );
        }

        let emailConfig: {
            subject: string;
            react: React.ReactElement;
        };

        switch (type) {
            case 'application-received':
                emailConfig = {
                    subject: `Xác nhận ứng tuyển - ${data.jobTitle || 'Phoenix VN'}`,
                    react: ApplicationReceivedEmail({
                        candidateName: data.candidateName as string,
                        jobTitle: data.jobTitle as string,
                        companyName: data.companyName as string,
                    }),
                };
                break;

            case 'interview-invitation':
                emailConfig = {
                    subject: `Thư mời phỏng vấn - ${data.jobTitle || 'Phoenix VN'}`,
                    react: InterviewInvitationEmail({
                        candidateName: data.candidateName as string,
                        jobTitle: data.jobTitle as string,
                        interviewDate: data.interviewDate as string,
                        interviewTime: data.interviewTime as string,
                        interviewLocation: data.interviewLocation as string,
                        interviewerName: data.interviewerName as string,
                        companyName: data.companyName as string,
                        calendarLink: data.calendarLink as string,
                    }),
                };
                break;

            case 'offer-letter':
                emailConfig = {
                    subject: `🎉 Thư mời làm việc - ${data.jobTitle || 'Phoenix VN'}`,
                    react: OfferLetterEmail({
                        candidateName: data.candidateName as string,
                        jobTitle: data.jobTitle as string,
                        department: data.department as string,
                        startDate: data.startDate as string,
                        salary: data.salary as string,
                        benefits: data.benefits as string[],
                        companyName: data.companyName as string,
                        offerDeadline: data.offerDeadline as string,
                        contactEmail: data.contactEmail as string,
                    }),
                };
                break;

            case 'rejection':
                emailConfig = {
                    subject: `Kết quả ứng tuyển - ${data.jobTitle || 'Phoenix VN'}`,
                    react: RejectionNotificationEmail({
                        candidateName: data.candidateName as string,
                        jobTitle: data.jobTitle as string,
                        companyName: data.companyName as string,
                    }),
                };
                break;

            default:
                return NextResponse.json(
                    { error: 'Loại email không hợp lệ' },
                    { status: 400 }
                );
        }

        // Gửi email qua Gmail SMTP (Nodemailer)
        const result = await sendRecruitmentEmail(to, emailConfig.subject, emailConfig.react);

        if (!result) {
            return NextResponse.json(
                { error: 'SMTP chưa được cấu hình. Vui lòng kiểm tra SMTP_HOST và SMTP_USER trong .env' },
                { status: 503 }
            );
        }

        return NextResponse.json({ success: true, messageId: result.messageId });
    } catch (error) {
        console.error('Send email error:', error);
        return NextResponse.json(
            { error: 'Lỗi hệ thống' },
            { status: 500 }
        );
    }
}
