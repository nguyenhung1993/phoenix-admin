// Mock data for C&B Module: Timesheet, Leave, Overtime

// ========== TIMESHEET ==========
export interface TimesheetEntry {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    workHours: number;
    overtimeHours: number;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_LEAVE' | 'HOLIDAY' | 'WEEKEND';
    note?: string;
}

export interface TimesheetSummary {
    employeeId: string;
    employeeName: string;
    month: number;
    year: number;
    totalWorkDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    totalWorkHours: number;
    totalOvertimeHours: number;
}

export const timesheetStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PRESENT: { label: 'Có mặt', variant: 'default' },
    ABSENT: { label: 'Vắng', variant: 'destructive' },
    LATE: { label: 'Đi muộn', variant: 'secondary' },
    EARLY_LEAVE: { label: 'Về sớm', variant: 'secondary' },
    HOLIDAY: { label: 'Nghỉ lễ', variant: 'outline' },
    WEEKEND: { label: 'Cuối tuần', variant: 'outline' },
};

// Generate mock timesheet for current month
const generateMockTimesheet = (): TimesheetEntry[] => {
    const entries: TimesheetEntry[] = [];
    const employees = [
        { id: '1', name: 'Nguyễn Văn Minh' },
        { id: '2', name: 'Trần Thị Hương' },
        { id: '3', name: 'Phạm Văn Tùng' },
        { id: '4', name: 'Nguyễn Hoàng Nam' },
        { id: '5', name: 'Lê Minh Đức' },
    ];

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    employees.forEach(emp => {
        for (let day = 1; day <= today.getDate(); day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();

            let status: TimesheetEntry['status'] = 'PRESENT';
            let checkIn = '08:00';
            let checkOut = '17:30';
            let workHours = 8;
            let overtimeHours = 0;

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                status = 'WEEKEND';
                checkIn = undefined as any;
                checkOut = undefined as any;
                workHours = 0;
            } else if (Math.random() < 0.1) {
                status = 'LATE';
                checkIn = '08:' + (15 + Math.floor(Math.random() * 30)).toString().padStart(2, '0');
            } else if (Math.random() < 0.05) {
                status = 'ABSENT';
                checkIn = undefined as any;
                checkOut = undefined as any;
                workHours = 0;
            }

            entries.push({
                id: `ts-${emp.id}-${year}${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                employeeId: emp.id,
                employeeName: emp.name,
                date: date.toISOString().split('T')[0],
                checkIn,
                checkOut,
                workHours,
                overtimeHours,
                status,
            });
        }
    });

    return entries;
};

export const mockTimesheetEntries = generateMockTimesheet();

// ========== LEAVE ==========
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

// ========== OVERTIME ==========
export type OvertimeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface OvertimeRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    startTime: string;
    endTime: string;
    hours: number;
    reason: string;
    status: OvertimeStatus;
    approverId?: string;
    approverName?: string;
    approvedAt?: string;
    createdAt: string;
}

export const overtimeStatusLabels: Record<OvertimeStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    PENDING: { label: 'Chờ duyệt', variant: 'secondary' },
    APPROVED: { label: 'Đã duyệt', variant: 'default' },
    REJECTED: { label: 'Từ chối', variant: 'destructive' },
};

export const mockOvertimeRequests: OvertimeRequest[] = [
    {
        id: 'ot-1',
        employeeId: '7',
        employeeName: 'Hoàng Văn Tuấn',
        date: '2026-02-04',
        startTime: '18:00',
        endTime: '21:00',
        hours: 3,
        reason: 'Fix bug khẩn cấp production',
        status: 'APPROVED',
        approverId: '3',
        approverName: 'Phạm Văn Tùng',
        approvedAt: '2026-02-04',
        createdAt: '2026-02-04',
    },
    {
        id: 'ot-2',
        employeeId: '6',
        employeeName: 'Võ Thị Lan',
        date: '2026-02-05',
        startTime: '17:30',
        endTime: '20:00',
        hours: 2.5,
        reason: 'Hoàn thành báo cáo tháng',
        status: 'PENDING',
        createdAt: '2026-02-05',
    },
];

// ========== LEAVE BALANCE ==========
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

// ========== SOCIAL INSURANCE ==========
export type InsuranceType = 'BHXH' | 'BHYT' | 'BHTN'; // Social, Health, Unemployment
export type InsuranceStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED';

export interface InsuranceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    insuranceNumber: string;
    type: InsuranceType;
    startDate: string;
    endDate?: string;
    status: InsuranceStatus;
    employeeRate: number; // %
    companyRate: number; // %
    baseSalary: number;
    monthlyContribution: number;
}

export const insuranceTypeLabels: Record<InsuranceType, { label: string; color: string }> = {
    BHXH: { label: 'BHXH', color: 'bg-blue-100 text-blue-800' },
    BHYT: { label: 'BHYT', color: 'bg-green-100 text-green-800' },
    BHTN: { label: 'BHTN', color: 'bg-purple-100 text-purple-800' },
};

export const insuranceStatusLabels: Record<InsuranceStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    ACTIVE: { label: 'Đang tham gia', variant: 'default' },
    PENDING: { label: 'Chờ xử lý', variant: 'secondary' },
    EXPIRED: { label: 'Hết hạn', variant: 'destructive' },
};

export const mockInsuranceRecords: InsuranceRecord[] = [
    {
        id: 'ins-1',
        employeeId: '1',
        employeeName: 'Nguyễn Văn Minh',
        insuranceNumber: 'VN0123456789',
        type: 'BHXH',
        startDate: '2023-01-01',
        status: 'ACTIVE',
        employeeRate: 8,
        companyRate: 17.5,
        baseSalary: 15000000,
        monthlyContribution: 3825000,
    },
    {
        id: 'ins-2',
        employeeId: '1',
        employeeName: 'Nguyễn Văn Minh',
        insuranceNumber: 'VN0123456789',
        type: 'BHYT',
        startDate: '2023-01-01',
        status: 'ACTIVE',
        employeeRate: 1.5,
        companyRate: 3,
        baseSalary: 15000000,
        monthlyContribution: 675000,
    },
    {
        id: 'ins-3',
        employeeId: '2',
        employeeName: 'Trần Thị Hương',
        insuranceNumber: 'VN0987654321',
        type: 'BHXH',
        startDate: '2024-03-01',
        status: 'ACTIVE',
        employeeRate: 8,
        companyRate: 17.5,
        baseSalary: 12000000,
        monthlyContribution: 3060000,
    },
    {
        id: 'ins-4',
        employeeId: '6',
        employeeName: 'Võ Thị Lan',
        insuranceNumber: 'VN1122334455',
        type: 'BHXH',
        startDate: '2026-02-01',
        status: 'PENDING',
        employeeRate: 8,
        companyRate: 17.5,
        baseSalary: 10000000,
        monthlyContribution: 2550000,
    },
];
