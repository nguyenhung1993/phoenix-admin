import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface InterviewInvitationEmailProps {
    candidateName: string;
    jobTitle: string;
    interviewDate: string;
    interviewTime: string;
    interviewLocation: string;
    interviewerName?: string;
    companyName?: string;
    calendarLink?: string;
}

export default function InterviewInvitationEmail({
    candidateName = 'Ứng viên',
    jobTitle = 'Vị trí ứng tuyển',
    interviewDate = '2024-02-15',
    interviewTime = '09:00',
    interviewLocation = 'Văn phòng Phoenix VN',
    interviewerName = 'Phòng Nhân sự',
    companyName = 'Phoenix VN',
    calendarLink,
}: InterviewInvitationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Thư mời phỏng vấn - {jobTitle} tại {companyName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>📅 Thư mời phỏng vấn</Heading>

                    <Text style={text}>
                        Xin chào <strong>{candidateName}</strong>,
                    </Text>

                    <Text style={text}>
                        Chúng tôi rất vui mừng thông báo rằng hồ sơ của bạn đã được đánh giá cao và chúng tôi muốn mời bạn tham gia buổi phỏng vấn cho vị trí <strong>{jobTitle}</strong>.
                    </Text>

                    <Section style={infoBox}>
                        <Text style={infoTitle}>Chi tiết buổi phỏng vấn:</Text>
                        <Text style={infoText}>
                            📅 <strong>Ngày:</strong> {interviewDate}
                        </Text>
                        <Text style={infoText}>
                            🕘 <strong>Giờ:</strong> {interviewTime}
                        </Text>
                        <Text style={infoText}>
                            📍 <strong>Địa điểm:</strong> {interviewLocation}
                        </Text>
                        <Text style={infoText}>
                            👤 <strong>Người phỏng vấn:</strong> {interviewerName}
                        </Text>
                    </Section>

                    {calendarLink && (
                        <Section style={buttonContainer}>
                            <Button style={button} href={calendarLink}>
                                Thêm vào lịch
                            </Button>
                        </Section>
                    )}

                    <Text style={text}>
                        Vui lòng phản hồi email này để xác nhận tham gia. Nếu bạn cần thay đổi lịch hẹn, hãy liên hệ với chúng tôi sớm nhất có thể.
                    </Text>

                    <Section style={tipBox}>
                        <Text style={tipTitle}>💡 Gợi ý chuẩn bị:</Text>
                        <Text style={tipText}>• Nghiên cứu về công ty và vị trí ứng tuyển</Text>
                        <Text style={tipText}>• Chuẩn bị các câu hỏi muốn trao đổi</Text>
                        <Text style={tipText}>• Mang theo CV và các giấy tờ cần thiết</Text>
                        <Text style={tipText}>• Đến sớm 10-15 phút</Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Chúc bạn buổi phỏng vấn thành công!<br />
                        Đội ngũ Tuyển dụng {companyName}
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '40px 20px',
    marginBottom: '64px',
    borderRadius: '8px',
    maxWidth: '600px',
};

const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
    padding: '17px 0 0',
    textAlign: 'center' as const,
};

const text = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#484848',
};

const infoBox = {
    backgroundColor: '#dbeafe',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    borderLeft: '4px solid #2563eb',
};

const infoTitle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: '12px',
};

const infoText = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#1e3a8a',
    margin: '4px 0',
};

const tipBox = {
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
};

const tipTitle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#92400e',
    marginBottom: '8px',
};

const tipText = {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#78350f',
    margin: '4px 0',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '24px 0',
};

const button = {
    backgroundColor: '#dc2626',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '32px 0',
};

const footer = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#6b7280',
};
