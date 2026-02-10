export interface KPI {
    id: string;
    code: string;
    name: string;
    description?: string;
    unit: 'PERCENTAGE' | 'NUMBER' | 'CURRENCY' | 'RATING';
    target: number;
    weight: number; // 0-100%
    category: 'FINANCIAL' | 'CUSTOMER' | 'INTERNAL' | 'LEARNING';
    departmentId?: string; // Optional: specific to department
    createdAt?: string;
}

export interface ReviewCycle {
    id: string;
    name: string; // e.g., "Q1 2026 Performance Review"
    startDate: string;
    endDate: string;
    status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED';
    type: 'ANNUAL' | 'BI_ANNUAL' | 'QUARTERLY' | 'PROBATION';
    participants: number; // Count of employees
}

export interface KPIResult {
    kpiId: string;
    kpiName: string; // Snapshot
    target: number;
    actual: number;
    score: number; // calculated based on achievement % * weight
    weight: number;
    comment?: string;
}

export interface Evaluation {
    id: string;
    reviewCycleId: string;
    reviewCycleName: string;
    employeeId: string;
    employeeName: string;
    reviewerId?: string;
    reviewerName?: string; // Manager
    status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED';

    // Scores
    selfScore?: number;
    managerScore?: number;
    finalScore?: number;

    // Content
    kpiResults: KPIResult[];
    strengths?: string;
    weaknesses?: string;
    developmentPlan?: string;

    submittedAt?: string;
    reviewedAt?: string;
}

export const mockKPIs: KPI[] = [
    {
        id: 'kpi-1', code: 'REV-01', name: 'Doanh thu bán hàng',
        description: 'Đạt chỉ tiêu doanh thu cá nhân hàng tháng',
        unit: 'CURRENCY', target: 500000000, weight: 40,
        category: 'FINANCIAL', departmentId: '5' // Retail
    },
    {
        id: 'kpi-2', code: 'CS-01', name: 'Đánh giá hài lòng khách hàng (CSAT)',
        description: 'Điểm trung bình đánh giá từ khách hàng',
        unit: 'RATING', target: 4.5, weight: 30,
        category: 'CUSTOMER', departmentId: '5'
    },
    {
        id: 'kpi-3', code: 'INT-01', name: 'Tỷ lệ hoàn thành dự án đúng hạn',
        description: 'Số lượng task/project hoàn thành on-time',
        unit: 'PERCENTAGE', target: 90, weight: 30,
        category: 'INTERNAL'
    },
    {
        id: 'kpi-4', code: 'LEA-01', name: 'Hoàn thành khóa đào tạo bắt buộc',
        description: 'Số giờ đào tạo E-Learning',
        unit: 'NUMBER', target: 10, weight: 10,
        category: 'LEARNING'
    }
];

export const mockReviewCycles: ReviewCycle[] = [
    {
        id: 'cyc-1', name: 'Đánh giá Q4 2025',
        startDate: '2025-12-15', endDate: '2026-01-15',
        status: 'COMPLETED', type: 'QUARTERLY', participants: 45
    },
    {
        id: 'cyc-2', name: 'Đánh giá Q1 2026',
        startDate: '2026-03-15', endDate: '2026-04-15',
        status: 'PLANNING', type: 'QUARTERLY', participants: 48
    },
    {
        id: 'cyc-3', name: 'Đánh giá Thử việc - T3/2026',
        startDate: '2026-03-01', endDate: '2026-03-31',
        status: 'IN_PROGRESS', type: 'PROBATION', participants: 2
    }
];

export const mockEvaluations: Evaluation[] = [
    {
        id: 'eval-1',
        reviewCycleId: 'cyc-1',
        reviewCycleName: 'Đánh giá Q4 2025',
        employeeId: '6', // Vo Thi Lan
        employeeName: 'Võ Thị Lan',
        reviewerId: '2', // Tran Thi Huong
        reviewerName: 'Trần Thị Hương',
        status: 'APPROVED',
        selfScore: 85,
        managerScore: 88,
        finalScore: 88,
        kpiResults: [
            {
                kpiId: 'kpi-3', kpiName: 'Tỷ lệ hoàn thành dự án đúng hạn',
                target: 90, actual: 95, weight: 60, score: 60
            },
            {
                kpiId: 'kpi-4', kpiName: 'Hoàn thành khóa đào tạo bắt buộc',
                target: 10, actual: 12, weight: 40, score: 40
            }
        ],
        strengths: 'Hoàn thành tốt các nhiệm vụ được giao, chủ động trong công việc.',
        weaknesses: 'Cần cải thiện kỹ năng giao tiếp tiếng Anh.',
        developmentPlan: 'Tham gia khóa học tiếng Anh giao tiếp nâng cao.',
        submittedAt: '2025-12-28',
        reviewedAt: '2026-01-05'
    }
];

export const kpiCategoryLabels = {
    FINANCIAL: 'Tài chính',
    CUSTOMER: 'Khách hàng',
    INTERNAL: 'Quy trình nội bộ',
    LEARNING: 'Đào tạo & Phát triển'
};

export const reviewStatusLabels: Record<ReviewCycle['status'], { label: string; variant: "default" | "secondary" | "outline" | "destructive" | "ghost" | null | undefined }> = {
    PLANNING: { label: 'Lên kế hoạch', variant: 'secondary' },
    IN_PROGRESS: { label: 'Đang diễn ra', variant: 'default' },
    COMPLETED: { label: 'Đã hoàn thành', variant: 'outline' },
    LOCKED: { label: 'Đã khóa', variant: 'destructive' }, // or ghost
};

// ========== ADVANCED PERFORMANCE SUPPORT (Results Page) ==========

export const mockKPIPeriods = mockReviewCycles; // Alias for compatibility with results page

export const rankingConfigs = [
    { label: 'A', minScore: 90, maxScore: 100, color: 'green', name: 'Xuất sắc' },
    { label: 'B', minScore: 75, maxScore: 89, color: 'blue', name: 'Tốt' },
    { label: 'C', minScore: 60, maxScore: 74, color: 'yellow', name: 'Đạt yêu cầu' },
    { label: 'D', minScore: 0, maxScore: 59, color: 'red', name: 'Cần cải thiện' },
];

export const getRankingFromScore = (score: number) => {
    if (score >= 90) return rankingConfigs[0];
    if (score >= 75) return rankingConfigs[1];
    if (score >= 60) return rankingConfigs[2];
    return rankingConfigs[3];
};

export const calibrationStatusLabels: Record<string, string> = {
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
};

// Mock data strictly for the Results Dashboard
export const mockPerformanceResults = [
    {
        id: 'res-1',
        periodId: 'cyc-1',
        employeeId: '6',
        employeeName: 'Võ Thị Lan',
        departmentId: '2',
        departmentName: 'Nhân sự',
        kpiScore: 88,
        competencyScore: 85,
        review360Score: 90,
        finalScore: 88,
        ranking: 'B',
        calibrationStatus: 'APPROVED'
    },
    {
        id: 'res-2',
        periodId: 'cyc-1',
        employeeId: '3',
        employeeName: 'Phạm Văn Tùng',
        departmentId: '3',
        departmentName: 'Công nghệ thông tin',
        kpiScore: 95,
        competencyScore: 92,
        review360Score: 94,
        finalScore: 94,
        ranking: 'A',
        calibrationStatus: 'APPROVED'
    },
    {
        id: 'res-3',
        periodId: 'cyc-1',
        employeeId: '5',
        employeeName: 'Lê Minh Đức',
        departmentId: '5',
        departmentName: 'Bán lẻ',
        kpiScore: 92,
        competencyScore: 88,
        review360Score: 85,
        finalScore: 90,
        ranking: 'A',
        calibrationStatus: 'PENDING'
    },
    {
        id: 'res-4',
        periodId: 'cyc-1',
        employeeId: '1',
        employeeName: 'Nguyễn Văn Minh',
        departmentId: '1',
        departmentName: 'Ban Giám đốc',
        kpiScore: 98,
        competencyScore: 99,
        review360Score: 95,
        finalScore: 98,
        ranking: 'A',
        calibrationStatus: 'APPROVED'
    },
    {
        id: 'res-5',
        periodId: 'cyc-1',
        employeeId: '8',
        employeeName: 'Trần Thị Bình',
        departmentId: '4',
        departmentName: 'Marketing',
        kpiScore: 70,
        competencyScore: 72,
        review360Score: 75,
        finalScore: 72,
        ranking: 'C',
        calibrationStatus: 'PENDING'
    }
];

// ========== ADDITIONAL EXPORTS FOR PERFORMANCE MODULE ==========

export interface CriteriaResponse {
    criteriaId: string;
    score: number;
    comment?: string;
}

export interface EvaluationCriteria {
    id: string;
    name: string;
    description?: string;
    weight: number;
    maxScore?: number;
    ratingScale: {
        type: 'STARS' | 'NUMERIC' | 'OPTIONS';
        min?: number;
        max?: number;
        options?: { value: number; label: string }[];
    };
}

export interface EvaluationSection {
    id: string;
    name: string;
    weight: number;
    criteria: EvaluationCriteria[];
}

export interface EvaluationTemplate {
    id: string;
    name: string;
    description: string;
    type: 'KPI' | 'COMPETENCY' | 'MIXED';
    status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
    createdAt: string;
    sections: EvaluationSection[];
}

export const mockEvaluationTemplates: EvaluationTemplate[] = [
    {
        id: 'tmpl-1',
        name: 'Đánh giá năng lực quản lý',
        description: 'Dành cho cấp quản lý, trưởng phòng',
        type: 'COMPETENCY',
        status: 'ACTIVE',
        createdAt: '2025-01-10',
        sections: [
            {
                id: 'sec-1', name: 'Lãnh đạo', weight: 50,
                criteria: [
                    { id: 'crit-1', name: 'Tầm nhìn chiến lược', weight: 50, maxScore: 5, ratingScale: { type: 'STARS', max: 5 } },
                    { id: 'crit-2', name: 'Quản lý đội ngũ', weight: 50, maxScore: 5, ratingScale: { type: 'STARS', max: 5 } }
                ]
            },
            {
                id: 'sec-2', name: 'Kỹ năng mềm', weight: 50,
                criteria: [
                    { id: 'crit-3', name: 'Giao tiếp', weight: 50, maxScore: 5, ratingScale: { type: 'STARS', max: 5 } },
                    { id: 'crit-4', name: 'Giải quyết vấn đề', weight: 50, maxScore: 5, ratingScale: { type: 'STARS', max: 5 } }
                ]
            }
        ]
    }
];

export const templateTypeLabels = {
    KPI: { label: 'KPI', color: 'blue' },
    COMPETENCY: { label: 'Năng lực', color: 'purple' },
    MIXED: { label: 'Hỗn hợp', color: 'orange' }
};

export const templateStatusLabels = {
    ACTIVE: { label: 'Đang dùng', color: 'green' },
    DRAFT: { label: 'Nháp', color: 'gray' },
    ARCHIVED: { label: 'Lưu trữ', color: 'red' }
};

export interface Review360 {
    id: string;
    reviewerId: string;
    reviewerName: string;
    reviewerType: 'SELF' | 'MANAGER' | 'PEER' | 'JUNIOR';
    status: 'PENDING' | 'SUBMITTED';
    submittedAt?: string;
    comments?: string;
    responses: CriteriaResponse[];
}

export interface Evaluation360 {
    id: string;
    periodId: string;
    periodName: string;
    targetEmployeeId: string;
    targetEmployeeName: string;
    templateId: string;
    templateName: string;
    status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING';
    finalScore?: number;
    reviews: Review360[];
}

export const mockEvaluation360s: Evaluation360[] = [
    {
        id: 'eval360-1',
        periodId: 'cyc-1',
        periodName: 'Đánh giá Q4 2025',
        targetEmployeeId: '6',
        targetEmployeeName: 'Võ Thị Lan',
        templateId: 'tmpl-1',
        templateName: 'Đánh giá năng lực quản lý',
        status: 'IN_PROGRESS',
        finalScore: 88,
        reviews: [
            {
                id: 'rev-1', reviewerId: '6', reviewerName: 'Võ Thị Lan', reviewerType: 'SELF', status: 'SUBMITTED',
                responses: [
                    { criteriaId: 'crit-1', score: 4 }, { criteriaId: 'crit-2', score: 5 },
                    { criteriaId: 'crit-3', score: 4 }, { criteriaId: 'crit-4', score: 4 }
                ]
            },
            {
                id: 'rev-2', reviewerId: '2', reviewerName: 'Trần Thị Hương', reviewerType: 'MANAGER', status: 'SUBMITTED',
                responses: [
                    { criteriaId: 'crit-1', score: 5 }, { criteriaId: 'crit-2', score: 4 },
                    { criteriaId: 'crit-3', score: 5 }, { criteriaId: 'crit-4', score: 4 }
                ]
            },
            {
                id: 'rev-3', reviewerId: '3', reviewerName: 'Phạm Văn Tùng', reviewerType: 'PEER', status: 'PENDING',
                responses: []
            }
        ]
    }
];

export const evaluation360StatusLabels = {
    PLANNING: { label: 'Lên kế hoạch', color: 'gray' },
    PENDING: { label: 'Chờ xử lý', color: 'orange' },
    IN_PROGRESS: { label: 'Đang thực hiện', color: 'blue' },
    COMPLETED: { label: 'Hoàn thành', color: 'green' }
};

export const reviewerTypeLabels = {
    SELF: { label: 'Tự đánh giá', color: 'blue' },
    MANAGER: { label: 'Quản lý', color: 'red' },
    PEER: { label: 'Đồng cấp', color: 'green' },
    JUNIOR: { label: 'Cấp dưới', color: 'orange' }
};

// Aliases and Extensions for Goals Page
export type KPIPeriod = ReviewCycle;
export const kpiPeriodTypeLabels: Record<string, { label: string; color: string }> = {
    QUARTERLY: { label: 'Quý', color: 'blue' },
    SEMI_ANNUAL: { label: '6 Tháng', color: 'indigo' },
    ANNUAL: { label: 'Năm', color: 'purple' },
    PROBATION: { label: 'Thử việc', color: 'orange' }
};

export const kpiPeriodStatusLabels: Record<string, { label: string; color: string }> = {
    PLANNING: { label: 'Lên kế hoạch', color: 'gray' },
    IN_PROGRESS: { label: 'Đang diễn ra', color: 'blue' },
    COMPLETED: { label: 'Đã hoàn thành', color: 'green' },
    LOCKED: { label: 'Đã khóa', color: 'red' },
};

export interface KPIObjective {
    id: string;
    periodId: string;
    employeeId: string;
    employeeName: string;
    departmentName: string;
    title: string;
    unit: string;
    targetValue: number;
    actualValue: number;
    weight: number;
    score: number;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export const mockKPIObjectives: KPIObjective[] = [
    {
        id: 'obj-1', periodId: 'cyc-1', employeeId: '6', employeeName: 'Võ Thị Lan', departmentName: 'Nhân sự',
        title: 'Tuyển dụng nhân sự mới', unit: 'Người', targetValue: 10, actualValue: 8, weight: 40, score: 80, status: 'IN_PROGRESS'
    },
    {
        id: 'obj-2', periodId: 'cyc-1', employeeId: '6', employeeName: 'Võ Thị Lan', departmentName: 'Nhân sự',
        title: 'Đào tạo hội nhập', unit: 'Khóa', targetValue: 5, actualValue: 5, weight: 30, score: 100, status: 'COMPLETED'
    }
];

export const objectiveStatusLabels = {
    NOT_STARTED: { label: 'Chưa bắt đầu', color: 'gray' },
    IN_PROGRESS: { label: 'Đang thực hiện', color: 'blue' },
    COMPLETED: { label: 'Hoàn thành', color: 'green' }
};
