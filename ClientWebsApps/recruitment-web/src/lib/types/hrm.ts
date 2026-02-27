// ========== DEPARTMENTS ==========
export interface Department {
    id: string;
    code: string;
    name: string;
    parentId?: string;
    managerId?: string;
    managerName?: string;
    employeeCount?: number;
    isActive: boolean;
    createdAt?: string;
}

// ========== POSITIONS ==========
export interface Position {
    id: string;
    code: string;
    name: string;
    level: string;
    minSalary: number;
    maxSalary: number;
    departmentId?: string;
    isActive: boolean;
}

export const levelLabels: Record<string, { label: string; color: string }> = {
    INTERN: { label: 'Thực tập', color: 'bg-gray-100 text-gray-800' },
    JUNIOR: { label: 'Junior', color: 'bg-blue-100 text-blue-800' },
    SENIOR: { label: 'Senior', color: 'bg-green-100 text-green-800' },
    LEAD: { label: 'Team Lead', color: 'bg-purple-100 text-purple-800' },
    MANAGER: { label: 'Manager', color: 'bg-orange-100 text-orange-800' },
    DIRECTOR: { label: 'Director', color: 'bg-red-100 text-red-800' },
};

// ========== EMPLOYEES ==========
export interface Employee {
    id: string;
    employeeCode: string;
    fullName: string;
    avatar?: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    address?: string;

    // Work info
    departmentId: string;
    departmentName: string;
    positionId: string;
    positionName: string;
    status: string;
    hireDate: string;
    managerId?: string;
    managerName?: string;

    // Settings references
    contractTypeId?: string;
    contractTypeName?: string;
    shiftTypeId?: string;
    shiftTypeName?: string;

    // Personal & Banking
    identityCard?: string;
    taxCode?: string;
    bankAccount?: string;
    bankName?: string;

    createdAt: string;
}

export const employeeStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    ACTIVE: { label: 'Đang làm việc', variant: 'default' },
    PROBATION: { label: 'Thử việc', variant: 'secondary' },
    RESIGNED: { label: 'Đã nghỉ', variant: 'destructive' },
    ON_LEAVE: { label: 'Nghỉ phép', variant: 'outline' },
};

// Deprecated: Old ContractType simple interface - kept for compatibility
export interface SimpleContractType {
    id: string;
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
}

// ========== CONTRACTS ==========
export interface Contract {
    id: string;
    employeeId: string;
    employeeName: string;
    contractType: string;
    startDate: string;
    endDate?: string;
    salary: number;
    status: string;
    createdAt: string;
}

export const contractTypeLabels: Record<string, string> = {
    PROBATION: 'Thử việc',
    FIXED_TERM: 'Có thời hạn',
    INDEFINITE: 'Không thời hạn',
};

export const contractStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    ACTIVE: { label: 'Hiệu lực', variant: 'default' },
    EXPIRED: { label: 'Hết hạn', variant: 'secondary' },
    TERMINATED: { label: 'Chấm dứt', variant: 'destructive' },
};

// ========== SETTINGS-HR TYPES ==========
export interface ContractType {
    id: string;
    code: string;
    name: string;
    description?: string;
    durationMonths?: number;
    isSystem?: boolean;
    isActive: boolean;
}

export interface ShiftType {
    id: string;
    code: string;
    name: string;
    startTime: string;
    endTime: string;
    breakStartTime?: string;
    breakEndTime?: string;
    workDays: string[];
    isActive: boolean;
    isDefault?: boolean;
}

export interface PublicHoliday {
    id: string;
    name: string;
    date: string;
    daysOff: number;
    description?: string;
}

export interface SalaryComponent {
    id: string;
    code: string;
    name: string;
    type: string;
    isTaxable?: boolean;
    isSystem?: boolean;
    description?: string;
    isActive: boolean;
}

export interface CourseCategory {
    id: string;
    name: string;
    description?: string;
    courseCount: number;
    isActive: boolean;
}

// ========== HELPERS ==========
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
};
