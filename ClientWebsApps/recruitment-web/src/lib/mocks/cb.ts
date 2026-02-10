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
            let checkIn: string | undefined = '08:00';
            let checkOut: string | undefined = '17:30';
            let workHours = 8;
            let overtimeHours = 0;

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                status = 'WEEKEND';
                checkIn = undefined;
                checkOut = undefined;
                workHours = 0;
            } else if (Math.random() < 0.1) {
                status = 'LATE';
                checkIn = '08:' + (15 + Math.floor(Math.random() * 30)).toString().padStart(2, '0');
            } else if (Math.random() < 0.05) {
                status = 'ABSENT';
                checkIn = undefined;
                checkOut = undefined;
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

// ========== PAYROLL ==========
export interface PayrollSlip {
    id: string;
    employeeId: string;
    employeeName: string;
    month: number;
    year: number;

    // Earnings
    standardWorkDays: number;
    actualWorkDays: number;
    baseSalary: number;
    salaryByWorkDays: number; // (base / standard) * actual

    overtimeHours: number;
    overtimePay: number;

    allowances: number;
    bonus: number;
    totalIncome: number;

    // Deductions
    bhxh: number; // 8%
    bhyt: number; // 1.5%
    bhtn: number; // 1%
    tax: number;
    totalDeductions: number;

    // Net
    netSalary: number;
    status: 'DRAFT' | 'CONFIRMED' | 'PAID';
}

export const generateMockPayroll = (month: number, year: number): PayrollSlip[] => {
    // Mock employees basic data
    const employees = [
        { id: '1', name: 'Nguyễn Văn Minh', baseSalary: 30000000 },
        { id: '2', name: 'Trần Thị Hương', baseSalary: 25000000 },
        { id: '3', name: 'Phạm Văn Tùng', baseSalary: 22000000 },
        { id: '6', name: 'Võ Thị Lan', baseSalary: 12000000 },
        { id: '7', name: 'Hoàng Văn Tuấn', baseSalary: 15000000 },
    ];

    return employees.map(emp => {
        const standardWorkDays = 22;
        // Mock random actual work days (20-22)
        const actualWorkDays = Math.floor(Math.random() * 3) + 20;

        const salaryByWorkDays = (emp.baseSalary / standardWorkDays) * actualWorkDays;

        const overtimeHours = Math.floor(Math.random() * 10);
        const overtimePay = (emp.baseSalary / standardWorkDays / 8) * 1.5 * overtimeHours;

        const allowances = 1500000; // Lunch, Parking, etc.
        const bonus = Math.random() > 0.7 ? 2000000 : 0; // Random performance bonus

        const totalIncome = salaryByWorkDays + overtimePay + allowances + bonus;

        // Insurance (10.5% total)
        const insuranceSalary = emp.baseSalary; // Simplified: pay insurance on full base
        const bhxh = insuranceSalary * 0.08;
        const bhyt = insuranceSalary * 0.015;
        const bhtn = insuranceSalary * 0.01;

        // Tax (Simplified progressive)
        const taxableIncome = totalIncome - (bhxh + bhyt + bhtn) - 11000000; // 11M deduction
        let tax = 0;
        if (taxableIncome > 0) {
            tax = taxableIncome * 0.05; // Simplified flat 5% for mockup
        }

        const totalDeductions = bhxh + bhyt + bhtn + tax;
        const netSalary = totalIncome - totalDeductions;

        return {
            id: `pr-${emp.id}-${month}-${year}`,
            employeeId: emp.id,
            employeeName: emp.name,
            month,
            year,
            standardWorkDays,
            actualWorkDays,
            baseSalary: emp.baseSalary,
            salaryByWorkDays,
            overtimeHours,
            overtimePay,
            allowances,
            bonus,
            totalIncome,
            bhxh,
            bhyt,
            bhtn,
            tax,
            totalDeductions,
            netSalary,
            status: 'DRAFT',
        };
    });
};

// export const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
// };
