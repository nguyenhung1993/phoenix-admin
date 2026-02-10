
// Mock data for Leave Management

export type LeaveType = 'ANNUAL' | 'SICK' | 'UNPAID' | 'MATERNITY' | 'WEDDING' | 'FUNERAL' | 'OTHER';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    approverId?: string;
    approverName?: string;
    approvedAt?: string;
    rejectionReason?: string;
    createdAt: string;
}

export const leaveTypeLabels: Record<LeaveType, { label: string; color: string }> = {
    ANNUAL: { label: 'Nghỉ phép năm', color: 'bg-blue-100 text-blue-800' },
    SICK: { label: 'Nghỉ ốm', color: 'bg-red-100 text-red-800' },
    UNPAID: { label: 'Nghỉ không lương', color: 'bg-gray-100 text-gray-800' },
    MATERNITY: { label: 'Nghỉ thai sản', color: 'bg-pink-100 text-pink-800' },
    WEDDING: { label: 'Nghỉ cưới', color: 'bg-purple-100 text-purple-800' },
    FUNERAL: { label: 'Nghỉ tang', color: 'bg-slate-100 text-slate-800' },
    OTHER: { label: 'Khác', color: 'bg-orange-100 text-orange-800' },
};

export const leaveStatusLabels: Record<LeaveStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PENDING: { label: 'Chờ duyệt', variant: 'secondary' },
    APPROVED: { label: 'Đã duyệt', variant: 'default' },
    REJECTED: { label: 'Từ chối', variant: 'destructive' },
    CANCELLED: { label: 'Đã hủy', variant: 'outline' },
};

export const mockLeaveRequests: LeaveRequest[] = [
    {
        id: 'lv-1',
        employeeId: '6',
        employeeName: 'Võ Thị Lan',
        leaveType: 'ANNUAL',
        startDate: '2026-02-10',
        endDate: '2026-02-12',
        totalDays: 3,
        reason: 'Về quê thăm gia đình',
        status: 'PENDING',
        createdAt: '2026-02-04',
    },
    {
        id: 'lv-2',
        employeeId: '7',
        employeeName: 'Hoàng Văn Tuấn',
        leaveType: 'SICK',
        startDate: '2026-02-03',
        endDate: '2026-02-03',
        totalDays: 1,
        reason: 'Bị cảm, có giấy bác sĩ',
        status: 'APPROVED',
        approverId: '3',
        approverName: 'Phạm Văn Tùng',
        approvedAt: '2026-02-03',
        createdAt: '2026-02-03',
    },
    {
        id: 'lv-3',
        employeeId: '8',
        employeeName: 'Trần Thị Bình',
        leaveType: 'ANNUAL',
        startDate: '2026-02-20',
        endDate: '2026-02-21',
        totalDays: 2,
        reason: 'Đi du lịch',
        status: 'REJECTED',
        approverId: '4',
        approverName: 'Nguyễn Hoàng Nam',
        rejectionReason: 'Trùng deadline dự án',
        createdAt: '2026-02-01',
    },
];

export interface LeaveBalance {
    employeeId: string;
    employeeName: string;
    year: number;
    annualTotal: number;
    annualUsed: number;
    annualRemaining: number;
    sickTotal: number;
    sickUsed: number;
}

export const mockLeaveBalances: LeaveBalance[] = [
    { employeeId: '1', employeeName: 'Nguyễn Văn Minh', year: 2026, annualTotal: 14, annualUsed: 2, annualRemaining: 12, sickTotal: 30, sickUsed: 0 },
    { employeeId: '2', employeeName: 'Trần Thị Hương', year: 2026, annualTotal: 14, annualUsed: 3, annualRemaining: 11, sickTotal: 30, sickUsed: 1 },
    { employeeId: '3', employeeName: 'Phạm Văn Tùng', year: 2026, annualTotal: 14, annualUsed: 0, annualRemaining: 14, sickTotal: 30, sickUsed: 0 },
    { employeeId: '6', employeeName: 'Võ Thị Lan', year: 2026, annualTotal: 12, annualUsed: 1, annualRemaining: 11, sickTotal: 30, sickUsed: 2 },
    { employeeId: '7', employeeName: 'Hoàng Văn Tuấn', year: 2026, annualTotal: 12, annualUsed: 4, annualRemaining: 8, sickTotal: 30, sickUsed: 1 },
    { employeeId: '8', employeeName: 'Trần Thị Bình', year: 2026, annualTotal: 12, annualUsed: 0, annualRemaining: 12, sickTotal: 30, sickUsed: 0 },
];
