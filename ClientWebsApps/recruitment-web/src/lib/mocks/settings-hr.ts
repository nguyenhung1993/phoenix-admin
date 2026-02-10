export interface ContractType {
    id: string;
    code: string;
    name: string;
    description?: string;
    durationMonths?: number; // 0 for indefinite
    isSystem?: boolean; // Cannot delete system types
    isActive: boolean;
}

export const mockContractTypes: ContractType[] = [
    { id: '1', code: 'CT_PROBATION', name: 'Hợp đồng Thử việc', description: 'Dành cho nhân viên mới', durationMonths: 2, isSystem: true, isActive: true },
    { id: '2', code: 'CT_OFFICIAL_1Y', name: 'Hợp đồng Chính thức (1 năm)', description: 'Có thời hạn 12 tháng', durationMonths: 12, isSystem: true, isActive: true },
    { id: '3', code: 'CT_OFFICIAL_3Y', name: 'Hợp đồng Chính thức (3 năm)', description: 'Có thời hạn 36 tháng', durationMonths: 36, isSystem: true, isActive: true },
    { id: '4', code: 'CT_INDEFINITE', name: 'Hợp đồng Không xác định thời hạn', description: 'Sau khi hết hạn HĐ 3 năm', durationMonths: 0, isSystem: true, isActive: true },
    { id: '5', code: 'CT_CTV', name: 'Hợp đồng Cộng tác viên', description: 'Làm việc theo dự án', durationMonths: 6, isSystem: false, isActive: true },
];

export interface ShiftType {
    id: string;
    code: string;
    name: string;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    breakStartTime?: string;
    breakEndTime?: string;
    workDays: string[]; // ['MON', 'TUE', ...]
    isActive: boolean;
    isDefault?: boolean;
}

export const mockShiftTypes: ShiftType[] = [
    {
        id: 'SH_ADMIN', code: 'HC', name: 'Ca Hành chính',
        startTime: '08:00', endTime: '17:30',
        breakStartTime: '12:00', breakEndTime: '13:30',
        workDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'],
        isActive: true, isDefault: true
    },
    {
        id: 'SH_MORNING', code: 'SANG', name: 'Ca Sáng (Retail)',
        startTime: '08:00', endTime: '16:00',
        breakStartTime: '12:00', breakEndTime: '13:00',
        workDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
        isActive: true, isDefault: false
    },
    {
        id: 'SH_AFTERNOON', code: 'CHIEU', name: 'Ca Chiều (Retail)',
        startTime: '14:00', endTime: '22:00',
        breakStartTime: '18:00', breakEndTime: '19:00',
        workDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
        isActive: true, isDefault: false
    }
];

export interface PublicHoliday {
    id: string;
    name: string;
    date: string; // YYYY-MM-DD
    daysOff: number;
    description?: string;
}

export const mockPublicHolidays: PublicHoliday[] = [
    { id: '1', name: 'Tết Dương Lịch', date: '2026-01-01', daysOff: 1, description: 'Nghỉ 1 ngày' },
    { id: '2', name: 'Tết Nguyên Đán', date: '2026-02-17', daysOff: 5, description: 'Nghỉ 5 ngày (dự kiến)' },
    { id: '3', name: 'Giỗ tổ Hùng Vương', date: '2026-04-25', daysOff: 1, description: '10/3 Âm lịch' },
    { id: '4', name: 'Ngày Giải phóng & Quốc tế LĐ', date: '2026-04-30', daysOff: 2, description: '30/4 và 1/5' },
    { id: '5', name: 'Quốc Khánh', date: '2026-09-02', daysOff: 2, description: '2/9 và 1 ngày liền kề' },
];

// ========== PAYROLL ==========
export interface SalaryComponent {
    id: string;
    code: string;
    name: string;
    type: 'EARNING' | 'DEDUCTION';
    isTaxable: boolean;
    isSystem?: boolean;
    description?: string;
    isActive: boolean;
}

export const mockSalaryComponents: SalaryComponent[] = [
    { id: '1', code: 'SAL_BASE', name: 'Lương cơ bản', type: 'EARNING', isTaxable: true, isSystem: true, isActive: true, description: 'Lương thỏa thuận trong HĐLĐ hoặc Phụ lục' },
    { id: '2', code: 'ALL_LUNCH', name: 'Phụ cấp Ăn trưa', type: 'EARNING', isTaxable: false, isSystem: true, isActive: true, description: 'Không tính thuế TNCN (tối đa 730k)' },
    { id: '3', code: 'ALL_PHONE', name: 'Phụ cấp Điện thoại', type: 'EARNING', isTaxable: true, isSystem: false, isActive: true, description: 'Theo quy định công ty' },
    { id: '4', code: 'BON_KPI', name: 'Thưởng KPI', type: 'EARNING', isTaxable: true, isSystem: false, isActive: true, description: 'Thưởng theo hiệu quả công việc' },
    { id: '5', code: 'DED_BHXH_EMP', name: 'Trừ BHXH (NLĐ)', type: 'DEDUCTION', isTaxable: false, isSystem: true, isActive: true, description: '8% Lương đóng BHXH' },
    { id: '6', code: 'DED_BHYT_EMP', name: 'Trừ BHYT (NLĐ)', type: 'DEDUCTION', isTaxable: false, isSystem: true, isActive: true, description: '1.5% Lương đóng BHXH' },
    { id: '7', code: 'DED_BHTN_EMP', name: 'Trừ BHTN (NLĐ)', type: 'DEDUCTION', isTaxable: false, isSystem: true, isActive: true, description: '1% Lương đóng BHTN' },
];

// ========== E-LEARNING ==========
export interface CourseCategory {
    id: string;
    name: string;
    description?: string;
    courseCount: number;
    isActive: boolean;
}

export const mockCourseCategories: CourseCategory[] = [
    { id: '1', name: 'Đào tạo Hội nhập', description: 'Kiến thức chung cho nhân viên mới', courseCount: 3, isActive: true },
    { id: '2', name: 'Kỹ năng mềm', description: 'Giao tiếp, Quản lý thời gian, Lãnh đạo', courseCount: 12, isActive: true },
    { id: '3', name: 'Kỹ năng chuyên môn', description: 'Nghiệp vụ theo từng phòng ban', courseCount: 25, isActive: true },
    { id: '4', name: 'Quy trình & Chính sách', description: 'Các quy định nội bộ công ty', courseCount: 5, isActive: true },
    { id: '5', name: 'Compliance / Tuân thủ', description: 'An toàn lao động, Bảo mật thông tin', courseCount: 2, isActive: true },
];
