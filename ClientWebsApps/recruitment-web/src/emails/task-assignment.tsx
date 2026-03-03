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

interface TaskAssignmentProps {
    recipientName: string;
    taskTitle: string;
    taskDescription?: string;
    assignedBy: string;
    dueDate?: string;
    actionUrl?: string;
    companyName?: string;
}

export default function TaskAssignmentEmail({
    recipientName = 'Đồng nghiệp',
    taskTitle = 'Task mới',
    taskDescription,
    assignedBy = 'Quản lý',
    dueDate,
    actionUrl,
    companyName = 'Phoenix VN',
}: TaskAssignmentProps) {
    return (
        <Html>
            <Head />
            <Preview>📋 Bạn có task mới: {taskTitle}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>📋 Task mới được giao</Heading>

                    <Text style={text}>
                        Xin chào <strong>{recipientName}</strong>,
                    </Text>

                    <Text style={text}>
                        Bạn vừa được giao một task mới bởi <strong>{assignedBy}</strong>:
                    </Text>

                    <Section style={infoBox}>
                        <Text style={infoText}>
                            📌 <strong>Task:</strong> {taskTitle}
                        </Text>
                        {taskDescription && (
                            <Text style={infoText}>
                                📝 <strong>Mô tả:</strong> {taskDescription}
                            </Text>
                        )}
                        <Text style={infoText}>
                            👤 <strong>Giao bởi:</strong> {assignedBy}
                        </Text>
                        {dueDate && (
                            <Text style={infoText}>
                                📅 <strong>Hạn:</strong> {dueDate}
                            </Text>
                        )}
                    </Section>

                    {actionUrl && (
                        <Section style={buttonContainer}>
                            <Link href={`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${actionUrl}`} style={button}>
                                Xem chi tiết
                            </Link>
                        </Section>
                    )}

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
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    borderLeft: '4px solid #3b82f6',
};

const infoText = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#484848',
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
