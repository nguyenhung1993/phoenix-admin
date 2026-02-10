export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    target: string;
    timestamp: string;
    status: 'success' | 'failed';
    ip: string;
}

export interface SecurityConfig {
    passwordMinLength: number;
    requireSpecialChar: boolean;
    requireNumber: boolean;
    sessionTimeoutMinutes: number; // in minutes
    mfaEnabled: boolean;
    loginRetries: number;
}

export interface EmailTemplate {
    id: string;
    key: string;
    name: string;
    subject: string;
    description: string;
    lastUpdated: string;
}

// MOCK DATA

export const mockAuditLogs: AuditLog[] = [
    {
        id: 'log_001',
        userId: 'u_admin',
        userName: 'Admin User',
        action: 'LOGIN',
        target: 'System',
        timestamp: '2023-10-25T08:00:00Z',
        status: 'success',
        ip: '192.168.1.1'
    },
    {
        id: 'log_002',
        userId: 'u_admin',
        userName: 'Admin User',
        action: 'CREATE_USER',
        target: 'Employee: Nguyen Van A',
        timestamp: '2023-10-25T08:15:00Z',
        status: 'success',
        ip: '192.168.1.1'
    },
    {
        id: 'log_003',
        userId: 'u_manager',
        userName: 'HR Manager',
        action: 'UPDATE_SALARY',
        target: 'Contract: CT-2023-001',
        timestamp: '2023-10-25T09:30:00Z',
        status: 'success',
        ip: '192.168.1.5'
    },
    {
        id: 'log_004',
        userId: 'u_unknown',
        userName: 'Unknown',
        action: 'LOGIN_FAILED',
        target: 'System',
        timestamp: '2023-10-25T10:00:00Z',
        status: 'failed',
        ip: '14.232.10.5'
    },
    {
        id: 'log_005',
        userId: 'u_admin',
        userName: 'Admin User',
        action: 'DELETE_COURSE',
        target: 'Course: Introduction to AI',
        timestamp: '2023-10-26T14:20:00Z',
        status: 'success',
        ip: '192.168.1.1'
    }
];

export const mockSecurityConfig: SecurityConfig = {
    passwordMinLength: 8,
    requireSpecialChar: true,
    requireNumber: true,
    sessionTimeoutMinutes: 30,
    mfaEnabled: false,
    loginRetries: 5,
};

export const mockEmailTemplates: EmailTemplate[] = [
    {
        id: 'et_001',
        key: 'WELCOME_EMAIL',
        name: 'Email chào mừng nhân viên mới',
        subject: 'Chào mừng [User Name] gia nhập Phoenix Corp',
        description: 'Gửi tự động khi tạo tài khoản nhân viên mới thành công.',
        lastUpdated: '2023-09-01'
    },
    {
        id: 'et_002',
        key: 'RESET_PASSWORD',
        name: 'Email khôi phục mật khẩu',
        subject: '[Phoenix] Yêu cầu đặt lại mật khẩu của bạn',
        description: 'Gửi khi người dùng yêu cầu quên mật khẩu.',
        lastUpdated: '2023-08-15'
    },
    {
        id: 'et_003',
        key: 'PAYSLIP_NOTIFY',
        name: 'Thông báo phiếu lương',
        subject: '[Confidential] Phiếu lương tháng [Month] của bạn',
        description: 'Gửi hàng tháng sau khi chốt bảng lương.',
        lastUpdated: '2023-10-01'
    },
    {
        id: 'et_004',
        key: 'OFFBOARD_CONFIRM',
        name: 'Xác nhận nghỉ việc',
        subject: 'Xác nhận đơn xin nghỉ việc - [User Name]',
        description: 'Gửi khi đơn xin nghỉ việc được duyệt.',
        lastUpdated: '2023-09-20'
    }
];

export const getAuditLogs = () => mockAuditLogs;
export const getSecurityConfig = () => mockSecurityConfig;
export const getEmailTemplates = () => mockEmailTemplates;
