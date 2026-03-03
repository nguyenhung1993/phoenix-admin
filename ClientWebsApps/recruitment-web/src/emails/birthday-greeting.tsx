import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface BirthdayGreetingProps {
    employeeName: string;
    companyName?: string;
    customMessage?: string;
}

export default function BirthdayGreetingEmail({
    employeeName = 'Đồng nghiệp',
    companyName = 'Phoenix VN',
    customMessage,
}: BirthdayGreetingProps) {
    return (
        <Html>
            <Head />
            <Preview>🎂 Chúc mừng sinh nhật {employeeName}!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Text style={emojiCenter}>🎂🎉🎈</Text>
                    <Heading style={heading}>Chúc Mừng Sinh Nhật!</Heading>

                    <Text style={text}>
                        Xin chào <strong>{employeeName}</strong>,
                    </Text>

                    <Section style={greetingBox}>
                        <Text style={greetingText}>
                            {customMessage ||
                                `Toàn thể đội ngũ ${companyName} xin gửi đến bạn lời chúc mừng sinh nhật nồng nhiệt nhất! 🥳`}
                        </Text>
                        <Text style={greetingText}>
                            Chúc bạn một ngày sinh nhật thật vui vẻ, tràn đầy niềm vui và hạnh phúc. Mong rằng năm mới tuổi sẽ mang đến cho bạn nhiều thành công và may mắn!
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Thân mến,<br />
                        Đội ngũ {companyName} 💛
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

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

const emojiCenter = {
    fontSize: '40px',
    textAlign: 'center' as const,
    margin: '0 0 8px 0',
};

const heading = {
    fontSize: '26px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
    textAlign: 'center' as const,
    margin: '0 0 24px 0',
};

const text = {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#484848',
};

const greetingBox = {
    backgroundColor: '#fef9ef',
    borderRadius: '12px',
    padding: '24px',
    margin: '24px 0',
    border: '1px solid #fde68a',
};

const greetingText = {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#484848',
    margin: '8px 0',
    textAlign: 'center' as const,
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '32px 0',
};

const footer = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#6b7280',
    textAlign: 'center' as const,
};
