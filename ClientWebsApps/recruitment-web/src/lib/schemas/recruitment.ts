// Client-safe types and schemas for Recruitment module
// These replace @prisma/client enums to avoid loading Prisma in the browser

// ==================== STATUS & SOURCE CONSTANTS ====================
export const JobTypeValues = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'] as const;
export type JobType = typeof JobTypeValues[number];

export const JobStatusValues = ['DRAFT', 'PUBLISHED', 'CLOSED'] as const;
export type JobStatus = typeof JobStatusValues[number];

export const CandidateStatusValues = ['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'] as const;
export type CandidateStatus = typeof CandidateStatusValues[number];

export const CandidateSourceValues = ['LINKEDIN', 'WEBSITE', 'REFERRAL', 'JOB_BOARD', 'OTHER'] as const;
export type CandidateSource = typeof CandidateSourceValues[number];

// ==================== LABELS ====================
export const jobTypeLabels: Record<JobType, string> = {
    FULL_TIME: 'Toàn thời gian',
    PART_TIME: 'Bán thời gian',
    CONTRACT: 'Hợp đồng',
    INTERNSHIP: 'Thực tập',
};

export const jobStatusLabels: Record<JobStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    DRAFT: { label: 'Nháp', variant: 'secondary' },
    PUBLISHED: { label: 'Đang tuyển', variant: 'default' },
    CLOSED: { label: 'Đã đóng', variant: 'destructive' },
};

export const candidateStatusLabels: Record<CandidateStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    NEW: { label: 'Mới', variant: 'secondary' },
    SCREENING: { label: 'Sàng lọc', variant: 'outline' },
    INTERVIEW: { label: 'Phỏng vấn', variant: 'default' },
    OFFER: { label: 'Đề xuất', variant: 'default' },
    HIRED: { label: 'Đã tuyển', variant: 'default' },
    REJECTED: { label: 'Từ chối', variant: 'destructive' },
};

export const candidateSourceLabels: Record<CandidateSource, string> = {
    LINKEDIN: 'LinkedIn',
    WEBSITE: 'Website',
    REFERRAL: 'Giới thiệu',
    JOB_BOARD: 'Job Board',
    OTHER: 'Khác',
};

// ==================== TYPES ====================
export interface JobItem {
    id: string;
    slug: string;
    title: string;
    departmentId: string | null;
    department?: { name: string };
    location: string | null;
    salaryMin: number;
    salaryMax: number;
    type: JobType;
    workMode: string;
    status: JobStatus;
    postedAt: string | null;
    expiresAt: string | null;
    createdAt: string;
    _count?: {
        candidates: number;
    };
}

export interface CandidateActivity {
    id: string;
    type: string;
    title: string;
    content: string;
    createdAt: string | Date;
    createdBy?: string;
}

export interface CandidateItem {
    id: string;
    name: string;
    email: string;
    phone: string;
    job?: { id: string; title: string };
    status: CandidateStatus;
    appliedAt: string | Date;
    rating?: number;
    cvUrl?: string | null;
    source?: CandidateSource | string;
    notes?: string | null;
    activities?: CandidateActivity[];
}

// ==================== INTERVIEW & OFFER ====================
export const InterviewTypeValues = ['PHONE', 'VIDEO', 'ONSITE'] as const;
export type InterviewType = typeof InterviewTypeValues[number];

export const InterviewStatusValues = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const;
export type InterviewStatus = typeof InterviewStatusValues[number];

export const OfferStatusValues = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'] as const;
export type OfferStatus = typeof OfferStatusValues[number];

export const interviewTypeLabels: Record<InterviewType, string> = {
    PHONE: 'Điện thoại',
    VIDEO: 'Online / Video',
    ONSITE: 'Trực tiếp',
};

export const interviewStatusLabels: Record<InterviewStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    SCHEDULED: { label: 'Đã lên lịch', variant: 'outline' },
    COMPLETED: { label: 'Hoàn thành', variant: 'default' },
    CANCELLED: { label: 'Đã hủy', variant: 'secondary' },
    NO_SHOW: { label: 'Vắng mặt', variant: 'destructive' },
};

export const offerStatusLabels: Record<OfferStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    DRAFT: { label: 'Nháp', variant: 'secondary' },
    SENT: { label: 'Đã gửi', variant: 'outline' },
    ACCEPTED: { label: 'Chấp nhận', variant: 'default' },
    REJECTED: { label: 'Từ chối', variant: 'destructive' },
    EXPIRED: { label: 'Hết hạn', variant: 'secondary' },
};

export interface Interviewer {
    id: string;
    name: string;
    role: string;
}

export interface InterviewFeedback {
    rating: number;
    strengths: string;
    weaknesses: string;
    notes: string;
    recommendation: 'HIRE' | 'NO_HIRE' | 'STRONG_HIRE' | 'MAYBE';
}

export interface InterviewItem {
    id: string;
    candidateId: string;
    jobId: string;
    type: InterviewType;
    status: InterviewStatus;
    scheduledAt: string;
    duration: number;
    location: string | null;
    meetingLink: string | null;
    interviewers: Interviewer[];
    notes: string | null;
    feedback: InterviewFeedback | null;
    createdAt: string;
    updatedAt: string;
    candidate?: { id: string; name: string; email: string };
    job?: { id: string; title: string };
}

export interface OfferItem {
    id: string;
    candidateId: string;
    jobId: string;
    status: OfferStatus;
    salaryBase: number;
    startDate: string;
    expiryDate: string;
    benefits: string[];
    notes: string | null;
    sentAt: string | null;
    respondedAt: string | null;
    createdAt: string;
    updatedAt: string;
    candidate?: { id: string; name: string; email: string };
    job?: { id: string; title: string };
}

// ==================== ONBOARDING ====================
export const OnboardingStatusValues = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const;
export type OnboardingStatus = typeof OnboardingStatusValues[number];

export const TaskStatusValues = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const;
export type TaskStatus = typeof TaskStatusValues[number];

export const TaskCategoryValues = ['DOCUMENTS', 'IT_SETUP', 'TRAINING', 'INTRODUCTION', 'ADMIN'] as const;
export type TaskCategory = typeof TaskCategoryValues[number];

export const onboardingStatusLabels: Record<OnboardingStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    NOT_STARTED: { label: 'Chưa bắt đầu', variant: 'secondary' },
    IN_PROGRESS: { label: 'Đang thực hiện', variant: 'outline' },
    COMPLETED: { label: 'Hoàn thành', variant: 'default' },
};

export const taskStatusLabels: Record<TaskStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    PENDING: { label: 'Chờ xử lý', variant: 'secondary' },
    IN_PROGRESS: { label: 'Đang thực hiện', variant: 'outline' },
    COMPLETED: { label: 'Hoàn thành', variant: 'default' },
};

export const taskCategoryLabels: Record<TaskCategory, { label: string; color: string }> = {
    DOCUMENTS: { label: 'Hồ sơ', color: 'bg-blue-100 text-blue-800' },
    IT_SETUP: { label: 'IT Setup', color: 'bg-purple-100 text-purple-800' },
    TRAINING: { label: 'Đào tạo', color: 'bg-green-100 text-green-800' },
    INTRODUCTION: { label: 'Giới thiệu', color: 'bg-orange-100 text-orange-800' },
    ADMIN: { label: 'Hành chính', color: 'bg-gray-100 text-gray-800' },
};

export interface OnboardingTaskItem {
    id: string;
    onboardingId: string;
    title: string;
    description: string | null;
    category: TaskCategory;
    isRequired: boolean;
    dueDay: number;
    assignedTo: string | null;
    status: TaskStatus;
    completedAt: string | null;
    completedBy: string | null;
}

export interface OnboardingItem {
    id: string;
    candidateId: string;
    employeeName: string;
    employeeEmail: string;
    jobTitle: string;
    department: string;
    startDate: string;
    buddyName: string | null;
    status: OnboardingStatus;
    createdAt: string;
    updatedAt: string;
    tasks?: OnboardingTaskItem[];
    candidate?: { id: string; name: string; email: string };
}

// ==================== PUBLIC CAREER TYPES ====================
export interface PublicJobItem {
    id: string;
    slug: string;
    title: string;
    department: string;
    location: string;
    type: JobType;
    workMode: string; // ONSITE, REMOTE, HYBRID
    salary: {
        min: number;
        max: number;
    };
    createdAt: string | Date;
}

export interface PublicJobDetail extends PublicJobItem {
    description: string;
    requirements: string;
    benefits: string;
}
