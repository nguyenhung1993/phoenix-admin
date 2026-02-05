// Role-Based Access Control (RBAC) Configuration

// ========== ROLES ==========
export type Role =
    | 'SUPER_ADMIN'      // Toàn quyền
    | 'HR_MANAGER'       // Quản lý nhân sự
    | 'HR_STAFF'         // Nhân viên nhân sự
    | 'RECRUITER'        // Tuyển dụng
    | 'DEPARTMENT_HEAD'  // Trưởng phòng ban
    | 'EMPLOYEE'         // Nhân viên thường
    | 'VIEWER';          // Chỉ xem

// ========== PERMISSIONS ==========
export type Permission =
    // Dashboard
    | 'dashboard:view'
    // Recruitment
    | 'jobs:view' | 'jobs:create' | 'jobs:edit' | 'jobs:delete'
    | 'candidates:view' | 'candidates:create' | 'candidates:edit' | 'candidates:delete'
    | 'interviews:view' | 'interviews:create' | 'interviews:edit' | 'interviews:feedback'
    | 'offers:view' | 'offers:create' | 'offers:send' | 'offers:approve'
    | 'onboarding:view' | 'onboarding:manage'
    // HRM Core
    | 'employees:view' | 'employees:create' | 'employees:edit' | 'employees:delete'
    | 'departments:view' | 'departments:create' | 'departments:edit' | 'departments:delete'
    | 'positions:view' | 'positions:create' | 'positions:edit' | 'positions:delete'
    | 'contracts:view' | 'contracts:create' | 'contracts:edit'
    // C&B (Compensation & Benefits)
    | 'timesheet:view' | 'timesheet:manage'
    | 'leave:view' | 'leave:create' | 'leave:approve'
    | 'overtime:view' | 'overtime:create' | 'overtime:approve'
    | 'insurance:view' | 'insurance:manage'
    // Training
    | 'courses:view' | 'courses:create' | 'courses:edit'
    | 'classes:view' | 'classes:create' | 'classes:manage'
    | 'materials:view' | 'materials:upload'
    | 'history:view'
    | 'exams:view' | 'exams:create' | 'exams:manage'
    | 'elearning:view'
    // Performance (KPI & Đánh giá)
    | 'performance:view' | 'performance:manage' | 'performance:evaluate'
    | 'goals:view' | 'goals:create' | 'goals:edit'
    | 'evaluations:view' | 'evaluations:create' | 'evaluations:manage'
    | 'results:view' | 'results:calibrate'
    // Reports
    | 'reports:view' | 'reports:export'
    // Settings
    | 'settings:view' | 'settings:manage'
    | 'users:view' | 'users:manage' | 'roles:manage';

// ========== ROLE -> PERMISSIONS MAPPING ==========
export const rolePermissions: Record<Role, Permission[]> = {
    SUPER_ADMIN: [
        'dashboard:view',
        'jobs:view', 'jobs:create', 'jobs:edit', 'jobs:delete',
        'candidates:view', 'candidates:create', 'candidates:edit', 'candidates:delete',
        'interviews:view', 'interviews:create', 'interviews:edit', 'interviews:feedback',
        'offers:view', 'offers:create', 'offers:send', 'offers:approve',
        'onboarding:view', 'onboarding:manage',
        'employees:view', 'employees:create', 'employees:edit', 'employees:delete',
        'departments:view', 'departments:create', 'departments:edit', 'departments:delete',
        'positions:view', 'positions:create', 'positions:edit', 'positions:delete',
        'contracts:view', 'contracts:create', 'contracts:edit',
        'timesheet:view', 'timesheet:manage',
        'leave:view', 'leave:create', 'leave:approve',
        'overtime:view', 'overtime:create', 'overtime:approve',
        'insurance:view', 'insurance:manage',
        'courses:view', 'courses:create', 'courses:edit',
        'classes:view', 'classes:create', 'classes:manage',
        'materials:view', 'materials:upload',
        'history:view',
        'exams:view', 'exams:create', 'exams:manage',
        'elearning:view',
        'performance:view', 'performance:manage', 'performance:evaluate',
        'goals:view', 'goals:create', 'goals:edit',
        'evaluations:view', 'evaluations:create', 'evaluations:manage',
        'results:view', 'results:calibrate',
        'reports:view', 'reports:export',
        'settings:view', 'settings:manage', 'users:view', 'users:manage', 'roles:manage',
    ],
    HR_MANAGER: [
        'dashboard:view',
        'jobs:view', 'jobs:create', 'jobs:edit',
        'candidates:view', 'candidates:create', 'candidates:edit',
        'interviews:view', 'interviews:create', 'interviews:edit', 'interviews:feedback',
        'offers:view', 'offers:create', 'offers:send', 'offers:approve',
        'onboarding:view', 'onboarding:manage',
        'employees:view', 'employees:create', 'employees:edit',
        'departments:view', 'departments:edit',
        'positions:view', 'positions:edit',
        'contracts:view', 'contracts:create', 'contracts:edit',
        'settings:view',
    ],
    HR_STAFF: [
        'dashboard:view',
        'jobs:view', 'jobs:create', 'jobs:edit',
        'candidates:view', 'candidates:create', 'candidates:edit',
        'interviews:view', 'interviews:create', 'interviews:feedback',
        'offers:view', 'offers:create',
        'onboarding:view', 'onboarding:manage',
        'employees:view', 'employees:create',
        'departments:view',
        'positions:view',
        'contracts:view',
    ],
    RECRUITER: [
        'dashboard:view',
        'jobs:view', 'jobs:create', 'jobs:edit',
        'candidates:view', 'candidates:create', 'candidates:edit',
        'interviews:view', 'interviews:create', 'interviews:feedback',
        'offers:view',
        'onboarding:view',
    ],
    DEPARTMENT_HEAD: [
        'dashboard:view',
        'jobs:view',
        'candidates:view',
        'interviews:view', 'interviews:feedback',
        'employees:view',
        'departments:view',
        'positions:view',
    ],
    EMPLOYEE: [
        'dashboard:view',
    ],
    VIEWER: [
        'dashboard:view',
        'jobs:view',
        'candidates:view',
        'employees:view',
        'departments:view',
    ],
};

// ========== ROLE LABELS ==========
export const roleLabels: Record<Role, { label: string; description: string; color: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', description: 'Toàn quyền hệ thống', color: 'bg-red-100 text-red-800' },
    HR_MANAGER: { label: 'HR Manager', description: 'Quản lý toàn bộ nhân sự', color: 'bg-purple-100 text-purple-800' },
    HR_STAFF: { label: 'HR Staff', description: 'Nhân viên nhân sự', color: 'bg-blue-100 text-blue-800' },
    RECRUITER: { label: 'Recruiter', description: 'Chuyên viên tuyển dụng', color: 'bg-green-100 text-green-800' },
    DEPARTMENT_HEAD: { label: 'Trưởng phòng', description: 'Quản lý phòng ban', color: 'bg-orange-100 text-orange-800' },
    EMPLOYEE: { label: 'Nhân viên', description: 'Nhân viên bình thường', color: 'bg-gray-100 text-gray-800' },
    VIEWER: { label: 'Viewer', description: 'Chỉ có quyền xem', color: 'bg-slate-100 text-slate-800' },
};

// ========== HELPER FUNCTIONS ==========
export const hasPermission = (role: Role, permission: Permission): boolean => {
    return rolePermissions[role]?.includes(permission) ?? false;
};

export const hasAnyPermission = (role: Role, permissions: Permission[]): boolean => {
    return permissions.some(p => hasPermission(role, p));
};

export const hasAllPermissions = (role: Role, permissions: Permission[]): boolean => {
    return permissions.every(p => hasPermission(role, p));
};

// ========== NAVIGATION CONFIG WITH PERMISSIONS ==========
export interface NavItem {
    href: string;
    label: string;
    icon: string; // lucide icon name
    permission: Permission;
    children?: NavItem[];
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
    {
        title: 'Tổng quan',
        items: [
            { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard', permission: 'dashboard:view' },
        ],
    },
    {
        title: 'Tuyển dụng',
        items: [
            { href: '/admin/jobs', label: 'Tin tuyển dụng', icon: 'Briefcase', permission: 'jobs:view' },
            { href: '/admin/candidates', label: 'Ứng viên', icon: 'Users', permission: 'candidates:view' },
            { href: '/admin/interviews', label: 'Phỏng vấn', icon: 'Calendar', permission: 'interviews:view' },
            { href: '/admin/offers', label: 'Offer Letter', icon: 'FileCheck', permission: 'offers:view' },
            { href: '/admin/onboarding', label: 'Onboarding', icon: 'UserPlus', permission: 'onboarding:view' },
        ],
    },
    {
        title: 'Nhân sự',
        items: [
            { href: '/admin/employees', label: 'Nhân viên', icon: 'User', permission: 'employees:view' },
            { href: '/admin/departments', label: 'Phòng ban', icon: 'Building', permission: 'departments:view' },
            { href: '/admin/positions', label: 'Chức vụ', icon: 'Award', permission: 'positions:view' },
            { href: '/admin/contracts', label: 'Hợp đồng', icon: 'FileText', permission: 'contracts:view' },
        ],
    },
    {
        title: 'C&B',
        items: [
            { href: '/admin/timesheet', label: 'Chấm công', icon: 'Clock', permission: 'timesheet:view' },
            { href: '/admin/leave', label: 'Nghỉ phép', icon: 'CalendarOff', permission: 'leave:view' },
            { href: '/admin/overtime', label: 'Tăng ca', icon: 'Timer', permission: 'overtime:view' },
            { href: '/admin/insurance', label: 'Bảo hiểm', icon: 'Shield', permission: 'insurance:view' },
        ],
    },
    {
        title: 'Đào tạo',
        items: [
            { href: '/admin/courses', label: 'Khóa học', icon: 'GraduationCap', permission: 'courses:view' },
            { href: '/admin/classes', label: 'Lớp học', icon: 'Users', permission: 'classes:view' },
            { href: '/admin/materials', label: 'Tài liệu', icon: 'FolderOpen', permission: 'materials:view' },
            { href: '/admin/history', label: 'Lịch sử học', icon: 'History', permission: 'history:view' },
            { href: '/admin/exams', label: 'Bài kiểm tra', icon: 'FileQuestion', permission: 'exams:view' },
            { href: '/admin/elearning', label: 'E-Learning', icon: 'PlayCircle', permission: 'elearning:view' },
        ],
    },
    {
        title: 'Đánh giá',
        items: [
            { href: '/admin/goals', label: 'Mục tiêu KPI', icon: 'Target', permission: 'goals:view' },
            { href: '/admin/templates', label: 'Mẫu đánh giá', icon: 'ClipboardList', permission: 'evaluations:view' },
            { href: '/admin/evaluations', label: 'Đánh giá 360', icon: 'Users', permission: 'evaluations:view' },
            { href: '/admin/results', label: 'Kết quả', icon: 'BarChart3', permission: 'results:view' },
        ],
    },
    {
        title: 'Báo cáo',
        items: [
            { href: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', permission: 'reports:view' },
            { href: '/admin/pit', label: 'Thuế TNCN', icon: 'FileText', permission: 'reports:view' },
            { href: '/admin/insurance-report', label: 'BHXH', icon: 'Shield', permission: 'reports:view' },
            { href: '/admin/export', label: 'Xuất báo cáo', icon: 'FileText', permission: 'reports:export' },
        ],
    },
    {
        title: 'Cài đặt',
        items: [
            { href: '/admin/settings', label: 'Cài đặt', icon: 'Settings', permission: 'settings:view' },
        ],
    },
];

// Get filtered navigation based on role
export const getNavigationForRole = (role: Role): NavGroup[] => {
    return navigationConfig
        .map(group => ({
            ...group,
            items: group.items.filter(item => hasPermission(role, item.permission)),
        }))
        .filter(group => group.items.length > 0);
};
