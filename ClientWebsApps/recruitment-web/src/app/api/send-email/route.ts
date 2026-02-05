import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import ApplicationReceivedEmail from '@/emails/application-received';
import InterviewInvitationEmail from '@/emails/interview-invitation';
import OfferLetterEmail from '@/emails/offer-letter';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template types
type EmailType = 'application-received' | 'interview-invitation' | 'offer-letter';

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
                { error: 'Missing required fields: to, type' },
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

            default:
                return NextResponse.json(
                    { error: 'Invalid email type' },
                    { status: 400 }
                );
        }

        const { data: result, error } = await resend.emails.send({
            from: 'Phoenix VN <onboarding@resend.dev>',
            to: [to],
            subject: emailConfig.subject,
            react: emailConfig.react,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: result?.id });
    } catch (error) {
        console.error('Send email error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
