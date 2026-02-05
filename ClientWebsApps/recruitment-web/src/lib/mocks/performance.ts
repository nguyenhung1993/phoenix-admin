// Performance Module - KPI & Đánh giá
// Mock Data and Interfaces

// ========== KPI PERIODS ==========
export type KPIPeriodType = 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
export type KPIPeriodStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';

export interface KPIPeriod {
    id: string;
    name: string;
    type: KPIPeriodType;
    startDate: string;
    endDate: string;
    status: KPIPeriodStatus;
    createdAt: string;
    createdBy: string;
}

export const kpiPeriodTypeLabels: Record<KPIPeriodType, { label: string; color: string }> = {
    QUARTERLY: { label: 'Quý', color: 'blue' },
    SEMI_ANNUAL: { label: 'Nửa năm', color: 'purple' },
    ANNUAL: { label: 'Năm', color: 'orange' },
};

export const kpiPeriodStatusLabels: Record<KPIPeriodStatus, { label: string; color: string }> = {
    DRAFT: { label: 'Nháp', color: 'gray' },
    ACTIVE: { label: 'Đang thực hiện', color: 'green' },
    CLOSED: { label: 'Đã kết thúc', color: 'red' },
};

export const mockKPIPeriods: KPIPeriod[] = [
    {
        id: 'period-1',
        name: 'Q1 2024',
        type: 'QUARTERLY',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        status: 'CLOSED',
        createdAt: '2023-12-15',
        createdBy: 'admin',
    },
    {
        id: 'period-2',
        name: 'Q2 2024',
        type: 'QUARTERLY',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        status: 'CLOSED',
        createdAt: '2024-03-15',
        createdBy: 'admin',
    },
    {
        id: 'period-3',
        name: 'Q3 2024',
        type: 'QUARTERLY',
        startDate: '2024-07-01',
        endDate: '2024-09-30',
        status: 'ACTIVE',
        createdAt: '2024-06-15',
        createdBy: 'admin',
    },
    {
        id: 'period-4',
        name: 'Năm 2024',
        type: 'ANNUAL',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'ACTIVE',
        createdAt: '2023-12-01',
        createdBy: 'admin',
    },
];

// ========== KPI OBJECTIVES ==========
export type ObjectiveStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface KPIObjective {
    id: string;
    periodId: string;
    employeeId: string;
    employeeName: string;
    departmentId: string;
    departmentName: string;
    title: string;
    description: string;
    weight: number;
    targetValue: number;
    actualValue: number;
    unit: string;
    status: ObjectiveStatus;
    score: number;
    createdAt: string;
    updatedAt: string;
}

export const objectiveStatusLabels: Record<ObjectiveStatus, { label: string; color: string }> = {
    NOT_STARTED: { label: 'Chưa bắt đầu', color: 'gray' },
    IN_PROGRESS: { label: 'Đang thực hiện', color: 'blue' },
    COMPLETED: { label: 'Hoàn thành', color: 'green' },
    CANCELLED: { label: 'Đã hủy', color: 'red' },
};

export const mockKPIObjectives: KPIObjective[] = [
    // Q3 2024 - Nguyễn Văn A (Sales)
    {
        id: 'obj-1',
        periodId: 'period-3',
        employeeId: 'emp-1',
        employeeName: 'Nguyễn Văn A',
        departmentId: 'dept-sales',
        departmentName: 'Kinh doanh',
        title: 'Doanh số bán hàng',
        description: 'Đạt doanh số 500 triệu VND trong Q3',
        weight: 40,
        targetValue: 500000000,
        actualValue: 380000000,
        unit: 'VND',
        status: 'IN_PROGRESS',
        score: 76,
        createdAt: '2024-07-01',
        updatedAt: '2024-08-15',
    },
    {
        id: 'obj-2',
        periodId: 'period-3',
        employeeId: 'emp-1',
        employeeName: 'Nguyễn Văn A',
        departmentId: 'dept-sales',
        departmentName: 'Kinh doanh',
        title: 'Khách hàng mới',
        description: 'Phát triển 10 khách hàng mới',
        weight: 30,
        targetValue: 10,
        actualValue: 8,
        unit: 'khách hàng',
        status: 'IN_PROGRESS',
        score: 80,
        createdAt: '2024-07-01',
        updatedAt: '2024-08-15',
    },
    {
        id: 'obj-3',
        periodId: 'period-3',
        employeeId: 'emp-1',
        employeeName: 'Nguyễn Văn A',
        departmentId: 'dept-sales',
        departmentName: 'Kinh doanh',
        title: 'Tỷ lệ chốt đơn',
        description: 'Đạt tỷ lệ chốt đơn 40%',
        weight: 30,
        targetValue: 40,
        actualValue: 42,
        unit: '%',
        status: 'COMPLETED',
        score: 100,
        createdAt: '2024-07-01',
        updatedAt: '2024-08-10',
    },
    // Q3 2024 - Trần Thị B (HR)
    {
        id: 'obj-4',
        periodId: 'period-3',
        employeeId: 'emp-2',
        employeeName: 'Trần Thị B',
        departmentId: 'dept-hr',
        departmentName: 'Nhân sự',
        title: 'Tuyển dụng nhân sự',
        description: 'Tuyển dụng 15 nhân sự mới',
        weight: 50,
        targetValue: 15,
        actualValue: 12,
        unit: 'người',
        status: 'IN_PROGRESS',
        score: 80,
        createdAt: '2024-07-01',
        updatedAt: '2024-08-15',
    },
    {
        id: 'obj-5',
        periodId: 'period-3',
        employeeId: 'emp-2',
        employeeName: 'Trần Thị B',
        departmentId: 'dept-hr',
        departmentName: 'Nhân sự',
        title: 'Tỷ lệ nghỉ việc',
        description: 'Giảm tỷ lệ nghỉ việc xuống dưới 5%',
        weight: 30,
        targetValue: 5,
        actualValue: 3.5,
        unit: '%',
        status: 'COMPLETED',
        score: 100,
        createdAt: '2024-07-01',
        updatedAt: '2024-08-05',
    },
    {
        id: 'obj-6',
        periodId: 'period-3',
        employeeId: 'emp-2',
        employeeName: 'Trần Thị B',
        departmentId: 'dept-hr',
        departmentName: 'Nhân sự',
        title: 'Đào tạo nội bộ',
        description: 'Tổ chức 5 khóa đào tạo nội bộ',
        weight: 20,
        targetValue: 5,
        actualValue: 3,
        unit: 'khóa',
        status: 'IN_PROGRESS',
        score: 60,
        createdAt: '2024-07-01',
        updatedAt: '2024-08-15',
    },
];

// ========== EVALUATION TEMPLATES ==========
export type EvaluationTemplateType = 'PERFORMANCE' | 'COMPETENCY' | 'MIXED';
export type TemplateStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type RatingScaleType = 'NUMERIC' | 'STARS' | 'OPTIONS';

export interface RatingScale {
    type: RatingScaleType;
    min?: number;
    max?: number;
    options?: { value: number; label: string }[];
}

export interface EvaluationCriteria {
    id: string;
    name: string;
    description: string;
    maxScore: number;
    weight: number;
    ratingScale: RatingScale;
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
    type: EvaluationTemplateType;
    sections: EvaluationSection[];
    status: TemplateStatus;
    createdAt: string;
    updatedAt: string;
}

export const templateTypeLabels: Record<EvaluationTemplateType, { label: string; color: string }> = {
    PERFORMANCE: { label: 'Hiệu suất', color: 'blue' },
    COMPETENCY: { label: 'Năng lực', color: 'purple' },
    MIXED: { label: 'Kết hợp', color: 'orange' },
};

export const templateStatusLabels: Record<TemplateStatus, { label: string; color: string }> = {
    DRAFT: { label: 'Nháp', color: 'gray' },
    ACTIVE: { label: 'Đang sử dụng', color: 'green' },
    ARCHIVED: { label: 'Đã lưu trữ', color: 'red' },
};

export const mockEvaluationTemplates: EvaluationTemplate[] = [
    {
        id: 'template-1',
        name: 'Đánh giá hiệu suất chuẩn',
        description: 'Mẫu đánh giá hiệu suất làm việc cho nhân viên',
        type: 'PERFORMANCE',
        status: 'ACTIVE',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
        sections: [
            {
                id: 'sect-1',
                name: 'Kết quả công việc',
                weight: 60,
                criteria: [
                    {
                        id: 'crit-1',
                        name: 'Hoàn thành KPI',
                        description: 'Mức độ hoàn thành các chỉ tiêu KPI đề ra',
                        maxScore: 100,
                        weight: 40,
                        ratingScale: { type: 'NUMERIC', min: 0, max: 100 },
                    },
                    {
                        id: 'crit-2',
                        name: 'Chất lượng công việc',
                        description: 'Độ chính xác, chi tiết của công việc',
                        maxScore: 5,
                        weight: 30,
                        ratingScale: { type: 'STARS', max: 5 },
                    },
                    {
                        id: 'crit-3',
                        name: 'Đúng tiến độ',
                        description: 'Hoàn thành công việc đúng thời hạn',
                        maxScore: 5,
                        weight: 30,
                        ratingScale: {
                            type: 'OPTIONS',
                            options: [
                                { value: 1, label: 'Thường xuyên trễ hạn' },
                                { value: 2, label: 'Đôi khi trễ hạn' },
                                { value: 3, label: 'Đúng hạn' },
                                { value: 4, label: 'Thường xong trước hạn' },
                                { value: 5, label: 'Luôn xong trước hạn' },
                            ],
                        },
                    },
                ],
            },
            {
                id: 'sect-2',
                name: 'Thái độ làm việc',
                weight: 40,
                criteria: [
                    {
                        id: 'crit-4',
                        name: 'Tinh thần teamwork',
                        description: 'Khả năng phối hợp với đồng nghiệp',
                        maxScore: 5,
                        weight: 50,
                        ratingScale: { type: 'STARS', max: 5 },
                    },
                    {
                        id: 'crit-5',
                        name: 'Chủ động sáng tạo',
                        description: 'Đề xuất ý tưởng, cải tiến quy trình',
                        maxScore: 5,
                        weight: 50,
                        ratingScale: { type: 'STARS', max: 5 },
                    },
                ],
            },
        ],
    },
    {
        id: 'template-2',
        name: 'Đánh giá năng lực quản lý',
        description: 'Dành cho vị trí quản lý cấp trung trở lên',
        type: 'COMPETENCY',
        status: 'ACTIVE',
        createdAt: '2024-02-01',
        updatedAt: '2024-02-10',
        sections: [
            {
                id: 'sect-3',
                name: 'Năng lực lãnh đạo',
                weight: 50,
                criteria: [
                    {
                        id: 'crit-6',
                        name: 'Khả năng ra quyết định',
                        description: 'Đưa ra quyết định đúng đắn, kịp thời',
                        maxScore: 5,
                        weight: 35,
                        ratingScale: { type: 'STARS', max: 5 },
                    },
                    {
                        id: 'crit-7',
                        name: 'Phát triển nhân viên',
                        description: 'Coaching, mentoring cho team',
                        maxScore: 5,
                        weight: 35,
                        ratingScale: { type: 'STARS', max: 5 },
                    },
                    {
                        id: 'crit-8',
                        name: 'Quản lý xung đột',
                        description: 'Giải quyết mâu thuẫn trong team',
                        maxScore: 5,
                        weight: 30,
                        ratingScale: { type: 'STARS', max: 5 },
                    },
                ],
            },
            {
                id: 'sect-4',
                name: 'Tư duy chiến lược',
                weight: 50,
                criteria: [
                    {
                        id: 'crit-9',
                        name: 'Lập kế hoạch',
                        description: 'Xây dựng kế hoạch dài hạn cho team',
                        maxScore: 5,
                        weight: 50,
                        ratingScale: { type: 'STARS', max: 5 },
                    },
                    {
                        id: 'crit-10',
                        name: 'Quản lý nguồn lực',
                        description: 'Phân bổ tài nguyên hiệu quả',
                        maxScore: 5,
                        weight: 50,
                        ratingScale: { type: 'STARS', max: 5 },
                    },
                ],
            },
        ],
    },
];

// ========== 360 EVALUATIONS ==========
export type Evaluation360Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type ReviewerType = 'SELF' | 'MANAGER' | 'PEER' | 'SUBORDINATE' | 'EXTERNAL';
export type ReviewStatus = 'PENDING' | 'SUBMITTED';

export interface CriteriaResponse {
    criteriaId: string;
    score: number;
    comment?: string;
}

export interface Review360 {
    id: string;
    reviewerId: string;
    reviewerName: string;
    reviewerType: ReviewerType;
    status: ReviewStatus;
    responses: CriteriaResponse[];
    comments: string;
    submittedAt?: string;
}

export interface Evaluation360 {
    id: string;
    periodId: string;
    periodName: string;
    targetEmployeeId: string;
    targetEmployeeName: string;
    templateId: string;
    templateName: string;
    status: Evaluation360Status;
    reviews: Review360[];
    finalScore?: number;
    createdAt: string;
    dueDate: string;
}

export const reviewerTypeLabels: Record<ReviewerType, { label: string; color: string }> = {
    SELF: { label: 'Tự đánh giá', color: 'blue' },
    MANAGER: { label: 'Cấp trên', color: 'purple' },
    PEER: { label: 'Đồng nghiệp', color: 'orange' },
    SUBORDINATE: { label: 'Cấp dưới', color: 'green' },
    EXTERNAL: { label: 'Bên ngoài', color: 'gray' },
};

export const evaluation360StatusLabels: Record<Evaluation360Status, { label: string; color: string }> = {
    PENDING: { label: 'Chờ thực hiện', color: 'gray' },
    IN_PROGRESS: { label: 'Đang thực hiện', color: 'blue' },
    COMPLETED: { label: 'Hoàn thành', color: 'green' },
};

export const mockEvaluation360s: Evaluation360[] = [
    {
        id: 'eval360-1',
        periodId: 'period-3',
        periodName: 'Q3 2024',
        targetEmployeeId: 'emp-1',
        targetEmployeeName: 'Nguyễn Văn A',
        templateId: 'template-1',
        templateName: 'Đánh giá hiệu suất chuẩn',
        status: 'IN_PROGRESS',
        createdAt: '2024-08-01',
        dueDate: '2024-09-15',
        reviews: [
            {
                id: 'rev-1',
                reviewerId: 'emp-1',
                reviewerName: 'Nguyễn Văn A',
                reviewerType: 'SELF',
                status: 'SUBMITTED',
                responses: [
                    { criteriaId: 'crit-1', score: 85, comment: 'Đã hoàn thành 85% KPI' },
                    { criteriaId: 'crit-2', score: 4 },
                    { criteriaId: 'crit-3', score: 4 },
                ],
                comments: 'Tôi đã cố gắng hoàn thành tốt công việc trong quý này.',
                submittedAt: '2024-08-10',
            },
            {
                id: 'rev-2',
                reviewerId: 'manager-1',
                reviewerName: 'Lê Văn C (Trưởng phòng)',
                reviewerType: 'MANAGER',
                status: 'SUBMITTED',
                responses: [
                    { criteriaId: 'crit-1', score: 80 },
                    { criteriaId: 'crit-2', score: 4 },
                    { criteriaId: 'crit-3', score: 3 },
                ],
                comments: 'Nhân viên có tiến bộ, cần cải thiện thời gian.',
                submittedAt: '2024-08-15',
            },
            {
                id: 'rev-3',
                reviewerId: 'emp-3',
                reviewerName: 'Phạm Thị D',
                reviewerType: 'PEER',
                status: 'PENDING',
                responses: [],
                comments: '',
            },
        ],
    },
    {
        id: 'eval360-2',
        periodId: 'period-3',
        periodName: 'Q3 2024',
        targetEmployeeId: 'emp-2',
        targetEmployeeName: 'Trần Thị B',
        templateId: 'template-2',
        templateName: 'Đánh giá năng lực quản lý',
        status: 'COMPLETED',
        finalScore: 87,
        createdAt: '2024-08-01',
        dueDate: '2024-09-15',
        reviews: [
            {
                id: 'rev-4',
                reviewerId: 'emp-2',
                reviewerName: 'Trần Thị B',
                reviewerType: 'SELF',
                status: 'SUBMITTED',
                responses: [],
                comments: 'Đã hoàn thành các mục tiêu đề ra.',
                submittedAt: '2024-08-08',
            },
            {
                id: 'rev-5',
                reviewerId: 'ceo',
                reviewerName: 'Giám đốc',
                reviewerType: 'MANAGER',
                status: 'SUBMITTED',
                responses: [],
                comments: 'Quản lý team tốt, cần chiến lược dài hạn hơn.',
                submittedAt: '2024-08-12',
            },
        ],
    },
];

// ========== PERFORMANCE RESULTS ==========
export type RankingLabel = 'A' | 'B' | 'C' | 'D';
export type CalibrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PerformanceResult {
    id: string;
    periodId: string;
    periodName: string;
    employeeId: string;
    employeeName: string;
    departmentId: string;
    departmentName: string;
    kpiScore: number;
    competencyScore: number;
    review360Score: number;
    finalScore: number;
    ranking: RankingLabel;
    calibrationStatus: CalibrationStatus;
    calibratedBy?: string;
    calibratedAt?: string;
    notes?: string;
}

export interface RankingConfig {
    label: RankingLabel;
    name: string;
    minScore: number;
    maxScore: number;
    color: string;
    bonus?: string;
}

export const rankingConfigs: RankingConfig[] = [
    { label: 'A', name: 'Xuất sắc', minScore: 90, maxScore: 100, color: 'green', bonus: '200%' },
    { label: 'B', name: 'Tốt', minScore: 75, maxScore: 89, color: 'blue', bonus: '150%' },
    { label: 'C', name: 'Đạt yêu cầu', minScore: 60, maxScore: 74, color: 'yellow', bonus: '100%' },
    { label: 'D', name: 'Cần cải thiện', minScore: 0, maxScore: 59, color: 'red', bonus: '0%' },
];

export const calibrationStatusLabels: Record<CalibrationStatus, { label: string; color: string }> = {
    PENDING: { label: 'Chờ duyệt', color: 'gray' },
    APPROVED: { label: 'Đã duyệt', color: 'green' },
    REJECTED: { label: 'Từ chối', color: 'red' },
};

export const mockPerformanceResults: PerformanceResult[] = [
    {
        id: 'result-1',
        periodId: 'period-2',
        periodName: 'Q2 2024',
        employeeId: 'emp-1',
        employeeName: 'Nguyễn Văn A',
        departmentId: 'dept-sales',
        departmentName: 'Kinh doanh',
        kpiScore: 85,
        competencyScore: 80,
        review360Score: 82,
        finalScore: 83,
        ranking: 'B',
        calibrationStatus: 'APPROVED',
        calibratedBy: 'HR Manager',
        calibratedAt: '2024-07-10',
    },
    {
        id: 'result-2',
        periodId: 'period-2',
        periodName: 'Q2 2024',
        employeeId: 'emp-2',
        employeeName: 'Trần Thị B',
        departmentId: 'dept-hr',
        departmentName: 'Nhân sự',
        kpiScore: 92,
        competencyScore: 88,
        review360Score: 90,
        finalScore: 90,
        ranking: 'A',
        calibrationStatus: 'APPROVED',
        calibratedBy: 'HR Manager',
        calibratedAt: '2024-07-10',
    },
    {
        id: 'result-3',
        periodId: 'period-2',
        periodName: 'Q2 2024',
        employeeId: 'emp-3',
        employeeName: 'Lê Văn C',
        departmentId: 'dept-it',
        departmentName: 'Công nghệ',
        kpiScore: 78,
        competencyScore: 75,
        review360Score: 72,
        finalScore: 75,
        ranking: 'B',
        calibrationStatus: 'APPROVED',
        calibratedBy: 'HR Manager',
        calibratedAt: '2024-07-10',
    },
    {
        id: 'result-4',
        periodId: 'period-2',
        periodName: 'Q2 2024',
        employeeId: 'emp-4',
        employeeName: 'Phạm Thị D',
        departmentId: 'dept-sales',
        departmentName: 'Kinh doanh',
        kpiScore: 65,
        competencyScore: 70,
        review360Score: 68,
        finalScore: 68,
        ranking: 'C',
        calibrationStatus: 'PENDING',
    },
    {
        id: 'result-5',
        periodId: 'period-2',
        periodName: 'Q2 2024',
        employeeId: 'emp-5',
        employeeName: 'Hoàng Văn E',
        departmentId: 'dept-it',
        departmentName: 'Công nghệ',
        kpiScore: 55,
        competencyScore: 60,
        review360Score: 58,
        finalScore: 58,
        ranking: 'D',
        calibrationStatus: 'PENDING',
        notes: 'Cần lập kế hoạch cải thiện',
    },
];

// Helper function to get ranking from score
export function getRankingFromScore(score: number): RankingConfig {
    return rankingConfigs.find(r => score >= r.minScore && score <= r.maxScore) || rankingConfigs[3];
}
