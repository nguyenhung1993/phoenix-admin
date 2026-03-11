import {
    Body,
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

interface RejectionNotificationEmailProps {
    candidateName: string;
    jobTitle: string;
    companyName?: string;
    careersUrl?: string;
}

export default function RejectionNotificationEmail({
    candidateName = 'Ứng viên',
    jobTitle = 'Vị trí ứng tuyển',
    companyName = 'Phoenix VN',
    careersUrl,
}: RejectionNotificationEmailProps) {
    const defaultCareersUrl = `${process.env.NEXTAUTH_URL || 'https://phoenix-admin.vercel.app'}/careers`;

    return (
        <Html>
            <Head />
            <Preview>Kết quả ứng tuyển - {jobTitle} tại {companyName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>Thông báo kết quả ứng tuyển</Heading>

                    <Text style={text}>
                        Xin chào <strong>{candidateName}</strong>,
                    </Text>

                    <Text style={text}>
                        Cảm ơn bạn đã dành thời gian ứng tuyển vào vị trí <strong>{jobTitle}</strong> tại {companyName}.
                    </Text>

                    <Section style={infoBox}>
                        <Text style={infoText}>
                            Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn chưa phù hợp với yêu cầu của vị trí này tại thời điểm hiện tại.
                        </Text>
                    </Section>

                    <Text style={text}>
                        Chúng tôi đánh giá cao sự quan tâm của bạn đối với {companyName} và khuyến khích bạn tiếp tục theo dõi các vị trí tuyển dụng khác phù hợp hơn.
                    </Text>

                    <Section style={ctaBox}>
                        <Text style={ctaText}>Xem các vị trí đang tuyển tại:</Text>
                        <Link href={careersUrl || defaultCareersUrl} style={link}>
                            🔗 {companyName} Careers
                        </Link>
                    </Section>

                    <Text style={text}>
                        Chúc bạn nhiều thành công trong sự nghiệp!
                    </Text>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Trân trọng,<br />
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
    fontSize: '22px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
    padding: '17px 0 0',
    textAlign: 'center' as const,
};

const text = {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#484848',
};

const infoBox = {
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    borderLeft: '4px solid #ef4444',
};

const infoText = {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#484848',
    margin: '0',
};

const ctaBox = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    textAlign: 'center' as const,
};

const ctaText = {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 8px 0',
};

const link = {
    color: '#dc2626',
    textDecoration: 'underline',
    fontSize: '15px',
    fontWeight: '600',
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
