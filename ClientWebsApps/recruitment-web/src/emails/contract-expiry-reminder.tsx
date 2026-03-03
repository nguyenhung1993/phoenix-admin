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

interface ContractExpiryReminderProps {
    managerName?: string;
    employeeName: string;
    contractType: string;
    expiryDate: string;
    daysRemaining: number;
    companyName?: string;
}

export default function ContractExpiryReminderEmail({
    managerName = 'Anh/Chị',
    employeeName = 'Nhân viên',
    contractType = 'Hợp đồng lao động',
    expiryDate = '01/01/2026',
    daysRemaining = 15,
    companyName = 'Phoenix VN',
}: ContractExpiryReminderProps) {
    return (
        <Html>
            <Head />
            <Preview>⚠️ Hợp đồng sắp hết hạn - {employeeName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>⚠️ Nhắc nhở: Hợp đồng sắp hết hạn</Heading>

                    <Text style={text}>
                        Xin chào <strong>{managerName}</strong>,
                    </Text>

                    <Text style={text}>
                        Hệ thống xin thông báo hợp đồng sau đây sắp hết hạn và cần được xử lý:
                    </Text>

                    <Section style={infoBox}>
                        <Text style={infoText}>
                            👤 <strong>Nhân viên:</strong> {employeeName}
                        </Text>
                        <Text style={infoText}>
                            📄 <strong>Loại HĐ:</strong> {contractType}
                        </Text>
                        <Text style={infoText}>
                            📅 <strong>Ngày hết hạn:</strong> {expiryDate}
                        </Text>
                        <Text style={warningText}>
                            ⏰ <strong>Còn lại:</strong> {daysRemaining} ngày
                        </Text>
                    </Section>

                    <Text style={text}>
                        Vui lòng kiểm tra và gia hạn hợp đồng hoặc thực hiện các thủ tục cần thiết trước ngày hết hạn.
                    </Text>

                    <Section style={buttonContainer}>
                        <Link href={`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/contracts`} style={button}>
                            Xem danh sách hợp đồng
                        </Link>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Trân trọng,<br />
                        Hệ thống HR {companyName}
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
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    borderLeft: '4px solid #f59e0b',
};

const infoText = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#484848',
    margin: '4px 0',
};

const warningText = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#dc2626',
    fontWeight: '600',
    margin: '4px 0',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '24px 0',
};

const button = {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
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
