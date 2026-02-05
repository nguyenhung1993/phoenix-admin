import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface OfferLetterEmailProps {
    candidateName: string;
    jobTitle: string;
    department: string;
    startDate: string;
    salary: string;
    benefits?: string[];
    companyName?: string;
    offerDeadline?: string;
    contactEmail?: string;
}

export default function OfferLetterEmail({
    candidateName = 'Ứng viên',
    jobTitle = 'Vị trí',
    department = 'Phòng ban',
    startDate = '2024-03-01',
    salary = '15,000,000 VNĐ',
    benefits = ['Bảo hiểm đầy đủ', 'Thưởng tháng lương 13', 'Laptop công ty'],
    companyName = 'Phoenix VN',
    offerDeadline = '2024-02-20',
    contactEmail = 'hr@phoenix-vn.com',
}: OfferLetterEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>🎉 Thư mời làm việc - {jobTitle} tại {companyName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={banner}>
                        <Text style={bannerText}>🎊 CHÚC MỪNG! 🎊</Text>
                    </Section>

                    <Heading style={heading}>Thư mời làm việc chính thức</Heading>

                    <Text style={text}>
                        Xin chào <strong>{candidateName}</strong>,
                    </Text>

                    <Text style={text}>
                        Sau quá trình tuyển dụng, chúng tôi rất vui mừng được mời bạn gia nhập đội ngũ <strong>{companyName}</strong> với vị trí <strong>{jobTitle}</strong>.
                    </Text>

                    <Section style={offerBox}>
                        <Text style={offerTitle}>📋 Chi tiết Offer:</Text>
                        <Text style={offerText}>
                            <strong>Vị trí:</strong> {jobTitle}
                        </Text>
                        <Text style={offerText}>
                            <strong>Phòng ban:</strong> {department}
                        </Text>
                        <Text style={offerText}>
                            <strong>Ngày bắt đầu:</strong> {startDate}
                        </Text>
                        <Text style={offerText}>
                            <strong>Mức lương:</strong> {salary}/tháng (Gross)
                        </Text>
                    </Section>

                    {benefits && benefits.length > 0 && (
                        <Section style={benefitsBox}>
                            <Text style={benefitsTitle}>🎁 Quyền lợi:</Text>
                            {benefits.map((benefit, index) => (
                                <Text key={index} style={benefitText}>✓ {benefit}</Text>
                            ))}
                        </Section>
                    )}

                    <Section style={buttonContainer}>
                        <Button style={acceptButton} href="#">
                            Chấp nhận Offer
                        </Button>
                    </Section>

                    <Text style={deadline}>
                        ⏰ Vui lòng phản hồi trước ngày: <strong>{offerDeadline}</strong>
                    </Text>

                    <Text style={text}>
                        Nếu bạn có bất kỳ câu hỏi nào về offer này, vui lòng liên hệ chúng tôi qua email: <strong>{contactEmail}</strong>
                    </Text>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Chúng tôi mong chờ được làm việc cùng bạn!<br />
                        <strong>Đội ngũ Nhân sự {companyName}</strong>
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

const banner = {
    backgroundColor: '#dc2626',
    borderRadius: '8px 8px 0 0',
    padding: '20px',
    margin: '-40px -20px 24px -20px',
};

const bannerText = {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    textAlign: 'center' as const,
    margin: 0,
};

const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
    textAlign: 'center' as const,
    marginBottom: '24px',
};

const text = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#484848',
};

const offerBox = {
    backgroundColor: '#ecfdf5',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    borderLeft: '4px solid #10b981',
};

const offerTitle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#065f46',
    marginBottom: '12px',
};

const offerText = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#047857',
    margin: '4px 0',
};

const benefitsBox = {
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
};

const benefitsTitle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#92400e',
    marginBottom: '12px',
};

const benefitText = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#78350f',
    margin: '4px 0',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const acceptButton = {
    backgroundColor: '#10b981',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '700',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '16px 32px',
};

const deadline = {
    fontSize: '14px',
    textAlign: 'center' as const,
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    padding: '12px',
    borderRadius: '6px',
    margin: '24px 0',
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
