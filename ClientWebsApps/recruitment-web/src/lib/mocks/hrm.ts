export { mockContractTypes, mockShiftTypes } from './settings-hr';
export type { ContractType, ShiftType } from './settings-hr';

// ========== DEPARTMENTS ==========
export interface Department {
    id: string;
    code: string;
    name: string;
    parentId?: string;
    managerId?: string;
    managerName?: string;
    employeeCount: number;
    isActive: boolean;
    createdAt: string;
}

export const mockDepartments: Department[] = [
    { id: '1', code: 'BOD', name: 'Ban Giám đốc', employeeCount: 3, isActive: true, createdAt: '2020-01-01' },
    { id: '2', code: 'HR', name: 'Nhân sự', parentId: '1', managerId: 'EMP002', managerName: 'Trần Thị Hương', employeeCount: 5, isActive: true, createdAt: '2020-01-01' },
    { id: '3', code: 'IT', name: 'Công nghệ thông tin', parentId: '1', managerId: 'EMP003', managerName: 'Phạm Văn Tùng', employeeCount: 8, isActive: true, createdAt: '2020-01-01' },
    { id: '4', code: 'MKT', name: 'Marketing', parentId: '1', managerId: 'EMP004', managerName: 'Nguyễn Hoàng Nam', employeeCount: 6, isActive: true, createdAt: '2020-01-01' },
    { id: '5', code: 'RETAIL', name: 'Bán lẻ', parentId: '1', managerId: 'EMP005', managerName: 'Lê Minh Đức', employeeCount: 25, isActive: true, createdAt: '2020-01-01' },
    { id: '6', code: 'FIN', name: 'Tài chính - Kế toán', parentId: '1', employeeCount: 4, isActive: true, createdAt: '2020-01-01' },
];

// ========== POSITIONS ==========
export interface Position {
    id: string;
    code: string;
    name: string;
    level: 'INTERN' | 'JUNIOR' | 'SENIOR' | 'LEAD' | 'MANAGER' | 'DIRECTOR';
    minSalary: number;
    maxSalary: number;
    departmentId?: string;
    isActive: boolean;
}

export const mockPositions: Position[] = [
    { id: '1', code: 'DIR', name: 'Giám đốc', level: 'DIRECTOR', minSalary: 50000000, maxSalary: 100000000, isActive: true },
    { id: '2', code: 'MGR', name: 'Trưởng phòng', level: 'MANAGER', minSalary: 25000000, maxSalary: 45000000, isActive: true },
    { id: '3', code: 'LEAD', name: 'Team Lead', level: 'LEAD', minSalary: 18000000, maxSalary: 30000000, isActive: true },
    { id: '4', code: 'SR', name: 'Chuyên viên cao cấp', level: 'SENIOR', minSalary: 15000000, maxSalary: 25000000, isActive: true },
    { id: '5', code: 'JR', name: 'Chuyên viên', level: 'JUNIOR', minSalary: 10000000, maxSalary: 18000000, isActive: true },
    { id: '6', code: 'INT', name: 'Thực tập sinh', level: 'INTERN', minSalary: 3000000, maxSalary: 6000000, isActive: true },
    { id: '7', code: 'SM', name: 'Store Manager', level: 'MANAGER', minSalary: 15000000, maxSalary: 25000000, departmentId: '5', isActive: true },
    { id: '8', code: 'SA', name: 'Sales Associate', level: 'JUNIOR', minSalary: 8000000, maxSalary: 15000000, departmentId: '5', isActive: true },
];

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
    gender: 'MALE' | 'FEMALE';
    email: string;
    phone: string;
    address?: string;

    // Work info
    departmentId: string;
    departmentName: string;
    positionId: string;
    positionName: string;
    status: 'ACTIVE' | 'PROBATION' | 'RESIGNED' | 'ON_LEAVE';
    hireDate: string;
    managerId?: string;
    managerName?: string;

    // Settings references
    contractTypeId?: string;
    contractTypeName?: string;
    shiftTypeId?: string;
    shiftTypeName?: string;

    // Personal & Banking
    identityCard?: string; // CCCD
    taxCode?: string;      // MST
    bankAccount?: string;
    bankName?: string;

    createdAt: string;
}

export const mockEmployees: Employee[] = [
    {
        id: '1', employeeCode: 'EMP001', fullName: 'Nguyễn Văn Minh', dob: '1985-03-15', gender: 'MALE',
        email: 'minh.nguyen@lining.vn', phone: '0901234567', departmentId: '1', departmentName: 'Ban Giám đốc',
        positionId: '1', positionName: 'Giám đốc', status: 'ACTIVE', hireDate: '2020-01-01', createdAt: '2020-01-01',
        contractTypeId: '4', contractTypeName: 'HĐ Không xác định thời hạn',
        shiftTypeId: 'SH_ADMIN', shiftTypeName: 'Ca Hành chính',
        identityCard: '001085000123', taxCode: '8000123456'
    },
    {
        id: '2', employeeCode: 'EMP002', fullName: 'Trần Thị Hương', dob: '1990-07-22', gender: 'FEMALE',
        email: 'huong.tran@lining.vn', phone: '0912345678', departmentId: '2', departmentName: 'Nhân sự',
        positionId: '2', positionName: 'Trưởng phòng', status: 'ACTIVE', hireDate: '2020-02-15', managerId: '1', managerName: 'Nguyễn Văn Minh', createdAt: '2020-02-15',
        contractTypeId: '4', contractTypeName: 'HĐ Không xác định thời hạn',
        shiftTypeId: 'SH_ADMIN', shiftTypeName: 'Ca Hành chính'
    },
    {
        id: '3', employeeCode: 'EMP003', fullName: 'Phạm Văn Tùng', dob: '1988-11-30', gender: 'MALE',
        email: 'tung.pham@lining.vn', phone: '0923456789', departmentId: '3', departmentName: 'Công nghệ thông tin',
        positionId: '2', positionName: 'Trưởng phòng', status: 'ACTIVE', hireDate: '2020-03-01', managerId: '1', managerName: 'Nguyễn Văn Minh', createdAt: '2020-03-01',
        contractTypeId: '4', contractTypeName: 'HĐ Không xác định thời hạn',
        shiftTypeId: 'SH_ADMIN', shiftTypeName: 'Ca Hành chính'
    },
    {
        id: '4', employeeCode: 'EMP004', fullName: 'Nguyễn Hoàng Nam', dob: '1992-05-18', gender: 'MALE',
        email: 'nam.nguyen@lining.vn', phone: '0934567890', departmentId: '4', departmentName: 'Marketing',
        positionId: '2', positionName: 'Trưởng phòng', status: 'ACTIVE', hireDate: '2020-04-01', managerId: '1', managerName: 'Nguyễn Văn Minh', createdAt: '2020-04-01',
        contractTypeId: '4', contractTypeName: 'HĐ Không xác định thời hạn',
        shiftTypeId: 'SH_ADMIN', shiftTypeName: 'Ca Hành chính'
    },
    {
        id: '5', employeeCode: 'EMP005', fullName: 'Lê Minh Đức', dob: '1987-09-25', gender: 'MALE',
        email: 'duc.le@lining.vn', phone: '0945678901', departmentId: '5', departmentName: 'Bán lẻ',
        positionId: '2', positionName: 'Trưởng phòng', status: 'ACTIVE', hireDate: '2020-05-15', managerId: '1', managerName: 'Nguyễn Văn Minh', createdAt: '2020-05-15',
        contractTypeId: '4', contractTypeName: 'HĐ Không xác định thời hạn',
        shiftTypeId: 'SH_ADMIN', shiftTypeName: 'Ca Hành chính'
    },
    {
        id: '6', employeeCode: 'EMP006', fullName: 'Võ Thị Lan', dob: '1995-01-10', gender: 'FEMALE',
        email: 'lan.vo@lining.vn', phone: '0956789012', departmentId: '2', departmentName: 'Nhân sự',
        positionId: '5', positionName: 'Chuyên viên', status: 'ACTIVE', hireDate: '2021-06-01', managerId: '2', managerName: 'Trần Thị Hương', createdAt: '2021-06-01',
        contractTypeId: '2', contractTypeName: 'HĐ Chính thức (1 năm)',
        shiftTypeId: 'SH_ADMIN', shiftTypeName: 'Ca Hành chính'
    },
    {
        id: '7', employeeCode: 'EMP007', fullName: 'Hoàng Văn Tuấn', dob: '1993-08-05', gender: 'MALE',
        email: 'tuan.hoang@lining.vn', phone: '0967890123', departmentId: '3', departmentName: 'Công nghệ thông tin',
        positionId: '4', positionName: 'Chuyên viên cao cấp', status: 'ACTIVE', hireDate: '2021-07-15', managerId: '3', managerName: 'Phạm Văn Tùng', createdAt: '2021-07-15',
        contractTypeId: '2', contractTypeName: 'HĐ Chính thức (1 năm)',
        shiftTypeId: 'SH_ADMIN', shiftTypeName: 'Ca Hành chính'
    },
    {
        id: '8', employeeCode: 'EMP008', fullName: 'Trần Thị Bình', dob: '1996-04-20', gender: 'FEMALE',
        email: 'binh.tran@lining.vn', phone: '0978901234', departmentId: '4', departmentName: 'Marketing',
        positionId: '5', positionName: 'Chuyên viên', status: 'PROBATION', hireDate: '2026-03-01', managerId: '4', managerName: 'Nguyễn Hoàng Nam', createdAt: '2026-02-04',
        contractTypeId: '1', contractTypeName: 'HĐ Thử việc',
        shiftTypeId: 'SH_MORNING', shiftTypeName: 'Ca Sáng (Retail)'
    },
];

export const employeeStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    ACTIVE: { label: 'Đang làm việc', variant: 'default' },
    PROBATION: { label: 'Thử việc', variant: 'secondary' },
    RESIGNED: { label: 'Đã nghỉ', variant: 'destructive' },
    ON_LEAVE: { label: 'Nghỉ phép', variant: 'outline' },
};

// Deprecated: Old ContractType simple interface - kept for compatibility if needed, but prefer settings-hr types
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
    contractType: string; // Changed from union to string to support dynamic types
    startDate: string;
    endDate?: string;
    salary: number;
    status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
    createdAt: string;
}

export const mockContracts: Contract[] = [
    { id: '1', employeeId: '1', employeeName: 'Nguyễn Văn Minh', contractType: 'INDEFINITE', startDate: '2020-01-01', salary: 80000000, status: 'ACTIVE', createdAt: '2020-01-01' },
    { id: '2', employeeId: '2', employeeName: 'Trần Thị Hương', contractType: 'INDEFINITE', startDate: '2020-02-15', salary: 35000000, status: 'ACTIVE', createdAt: '2020-02-15' },
    { id: '3', employeeId: '3', employeeName: 'Phạm Văn Tùng', contractType: 'INDEFINITE', startDate: '2020-03-01', salary: 40000000, status: 'ACTIVE', createdAt: '2020-03-01' },
    { id: '4', employeeId: '6', employeeName: 'Võ Thị Lan', contractType: 'FIXED_TERM', startDate: '2021-06-01', endDate: '2024-06-01', salary: 15000000, status: 'ACTIVE', createdAt: '2021-06-01' },
    { id: '5', employeeId: '8', employeeName: 'Trần Thị Bình', contractType: 'PROBATION', startDate: '2026-03-01', endDate: '2026-05-01', salary: 18000000, status: 'ACTIVE', createdAt: '2026-02-04' },
];

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

// ========== HELPERS ==========
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
};
