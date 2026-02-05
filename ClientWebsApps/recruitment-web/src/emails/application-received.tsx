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

interface ApplicationReceivedEmailProps {
    candidateName: string;
    jobTitle: string;
    companyName?: string;
}

export default function ApplicationReceivedEmail({
    candidateName = 'Ứng viên',
    jobTitle = 'Vị trí ứng tuyển',
    companyName = 'Phoenix VN',
}: ApplicationReceivedEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Xác nhận ứng tuyển thành công - {companyName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>🎉 Cảm ơn bạn đã ứng tuyển!</Heading>

                    <Text style={text}>
                        Xin chào <strong>{candidateName}</strong>,
                    </Text>

                    <Text style={text}>
                        Chúng tôi đã nhận được hồ sơ ứng tuyển của bạn cho vị trí <strong>{jobTitle}</strong> tại {companyName}.
                    </Text>

                    <Section style={infoBox}>
                        <Text style={infoText}>
                            📋 <strong>Vị trí:</strong> {jobTitle}
                        </Text>
                        <Text style={infoText}>
                            🏢 <strong>Công ty:</strong> {companyName}
                        </Text>
                        <Text style={infoText}>
                            ✅ <strong>Trạng thái:</strong> Đã nhận hồ sơ
                        </Text>
                    </Section>

                    <Text style={text}>
                        Đội ngũ tuyển dụng sẽ xem xét hồ sơ của bạn và liên hệ trong thời gian sớm nhất nếu phù hợp.
                    </Text>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Trân trọng,<br />
                        Đội ngũ Tuyển dụng {companyName}
                    </Text>

                    <Text style={footerLink}>
                        <Link href="https://careers.phoenix-vn.com" style={link}>
                            Xem thêm vị trí tuyển dụng khác
                        </Link>
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
    backgroundColor: '#f4f4f5',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
};

const infoText = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#484848',
    margin: '4px 0',
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

const footerLink = {
    textAlign: 'center' as const,
    marginTop: '24px',
};

const link = {
    color: '#dc2626',
    textDecoration: 'underline',
};
