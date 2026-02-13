// Mock Data - Recruitment Module
// Consolidates: mock-data.ts, mock-candidates.ts, mock-interviews.ts, mock-offers.ts, mock-onboarding.ts
import { formatDate, formatCurrency } from '@/lib/utils';
// Quick wrapper for formatDateTime since it's not in utils yet, or move it to utils?
// For now, let's keep formatDateTime here or add to utils.
// Actually, let's add formatDateTime to utils as well to be consistent. 
export { formatDate, formatCurrency };

export const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};



// ==================== JOBS ====================
export interface Job {
    id: string;
    slug: string;
    title: string;
    department: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
    workMode: 'ONSITE' | 'REMOTE' | 'HYBRID';
    experience: string;
    salary: { min: number; max: number };
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
    description: string;
    requirements: string[];
    benefits: string[];
    createdAt: string;
    updatedAt: string;
    applicants: number;
}

export const mockJobs: Job[] = [
    {
        id: '1',
        slug: 'senior-frontend-developer',
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'Ho Chi Minh',
        type: 'Full-time',
        workMode: 'HYBRID',
        experience: '3-5 years',
        salary: { min: 25000000, max: 40000000 },
        status: 'PUBLISHED',
        description: 'We are looking for a Senior Frontend Developer to join our team.',
        requirements: ['3+ years React/Next.js', 'TypeScript', 'Responsive Design', 'Git'],
        benefits: ['13th month salary', 'Health insurance', 'Flexible hours', 'Training budget'],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        applicants: 15,
    },
    {
        id: '2',
        slug: 'ux-ui-designer',
        title: 'UX/UI Designer',
        department: 'Design',
        location: 'Ho Chi Minh',
        type: 'Full-time',
        workMode: 'ONSITE',
        experience: '2-4 years',
        salary: { min: 20000000, max: 35000000 },
        status: 'PUBLISHED',
        description: 'Join our design team to create beautiful user experiences.',
        requirements: ['Figma', 'Adobe XD', 'User Research', 'Design Systems'],
        benefits: ['13th month salary', 'Health insurance', 'Creative environment'],
        createdAt: '2024-01-18',
        updatedAt: '2024-01-22',
        applicants: 8,
    },
    {
        id: '3',
        slug: 'backend-developer-node-js',
        title: 'Backend Developer (Node.js)',
        department: 'Engineering',
        location: 'Ha Noi',
        type: 'Full-time',
        workMode: 'REMOTE',
        experience: '2-5 years',
        salary: { min: 22000000, max: 38000000 },
        status: 'DRAFT',
        description: 'Building scalable APIs and microservices.',
        requirements: ['Node.js', 'PostgreSQL', 'Docker', 'REST/GraphQL'],
        benefits: ['Remote work', 'Stock options', 'Conference budget'],
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        applicants: 0,
    },
];

export const departments = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Sales',
    'HR',
    'Finance'
];

export const locations = [
    'Ho Chi Minh',
    'Ha Noi',
    'Da Nang',
    'Remote'
];

export const jobTypes = [
    { value: 'Full-time', label: 'Toàn thời gian' },
    { value: 'Part-time', label: 'Bán thời gian' },
    { value: 'Contract', label: 'Hợp đồng' },
    { value: 'Internship', label: 'Thực tập' },
];

export const workModes = [
    { value: 'ONSITE', label: 'Tại văn phòng' },
    { value: 'REMOTE', label: 'Từ xa' },
    { value: 'HYBRID', label: 'Linh hoạt' },
];

// ==================== CANDIDATES ====================
export type CandidateStatus = 'NEW' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    jobId: string;
    jobTitle: string;
    status: CandidateStatus;
    appliedDate: string;
    cvUrl: string;
    notes?: string;
    rating?: number;
    source: 'LinkedIn' | 'Website' | 'Referral' | 'Job Board' | 'Other';
    activities?: CandidateActivity[];
}

export interface CandidateActivity {
    id: string;
    type: 'EMAIL' | 'NOTE' | 'STATUS_CHANGE' | 'INTERVIEW_LOG';
    title: string;
    content: string;
    createdAt: string;
    createdBy: string;
}

export const candidateStatusLabels: Record<CandidateStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    NEW: { label: 'Mới', variant: 'secondary' },
    SCREENING: { label: 'Sàng lọc', variant: 'outline' },
    INTERVIEW: { label: 'Phỏng vấn', variant: 'default' },
    OFFER: { label: 'Đề xuất', variant: 'default' },
    HIRED: { label: 'Đã tuyển', variant: 'default' },
    REJECTED: { label: 'Từ chối', variant: 'destructive' },
};

export const mockCandidates: Candidate[] = [
    { id: '1', name: 'Nguyễn Văn An', email: 'an.nguyen@email.com', phone: '0901234567', jobId: '1', jobTitle: 'Senior Frontend Developer', status: 'INTERVIEW', appliedDate: '2024-01-16', cvUrl: '/cv/an-nguyen.pdf', rating: 4, source: 'LinkedIn' },
    { id: '2', name: 'Trần Thị Bình', email: 'binh.tran@email.com', phone: '0912345678', jobId: '1', jobTitle: 'Senior Frontend Developer', status: 'SCREENING', appliedDate: '2024-01-18', cvUrl: '/cv/binh-tran.pdf', rating: 3, source: 'Website' },
    { id: '3', name: 'Lê Hoàng Cường', email: 'cuong.le@email.com', phone: '0923456789', jobId: '2', jobTitle: 'UX/UI Designer', status: 'NEW', appliedDate: '2024-01-20', cvUrl: '/cv/cuong-le.pdf', source: 'Referral' },
    { id: '4', name: 'Phạm Minh Dũng', email: 'dung.pham@email.com', phone: '0934567890', jobId: '1', jobTitle: 'Senior Frontend Developer', status: 'OFFER', appliedDate: '2024-01-10', cvUrl: '/cv/dung-pham.pdf', rating: 5, source: 'LinkedIn' },
    { id: '5', name: 'Võ Thị Em', email: 'em.vo@email.com', phone: '0945678901', jobId: '2', jobTitle: 'UX/UI Designer', status: 'REJECTED', appliedDate: '2024-01-12', cvUrl: '/cv/em-vo.pdf', rating: 2, source: 'Job Board', notes: 'Thiếu kinh nghiệm' },
];

// ==================== INTERVIEWS ====================
export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type InterviewType = 'PHONE' | 'VIDEO' | 'ONSITE' | 'TECHNICAL';

export interface Interview {
    id: string;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    jobId: string;
    jobTitle: string;
    type: InterviewType;
    status: InterviewStatus;
    scheduledAt: string;
    duration: number;
    location?: string;
    meetingLink?: string;
    interviewers: { id: string; name: string; role: string }[];
    feedback?: { rating: number; strengths: string[]; weaknesses: string[]; notes: string; recommendation: 'HIRE' | 'REJECT' | 'NEXT_ROUND' | 'UNDECIDED' };
    createdAt: string;
}

export const interviewStatusLabels: Record<InterviewStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    SCHEDULED: { label: 'Đã lên lịch', variant: 'default' },
    COMPLETED: { label: 'Hoàn thành', variant: 'secondary' },
    CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
    NO_SHOW: { label: 'Vắng mặt', variant: 'destructive' },
};

export const interviewTypeLabels: Record<InterviewType, string> = {
    PHONE: 'Điện thoại',
    VIDEO: 'Video call',
    ONSITE: 'Tại văn phòng',
    TECHNICAL: 'Technical',
};

export const mockInterviews: Interview[] = [
    {
        id: 'int-1',
        candidateId: '1',
        candidateName: 'Nguyễn Văn An',
        candidateEmail: 'an.nguyen@email.com',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        type: 'VIDEO',
        status: 'COMPLETED',
        scheduledAt: '2024-01-22T10:00:00',
        duration: 60,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        interviewers: [{ id: 'emp-1', name: 'Nguyễn Văn Admin', role: 'Engineering Manager' }],
        feedback: { rating: 4, strengths: ['React knowledge', 'Clean code'], weaknesses: ['Limited backend'], notes: 'Good candidate', recommendation: 'NEXT_ROUND' },
        createdAt: '2024-01-18',
    },
    {
        id: 'int-2',
        candidateId: '4',
        candidateName: 'Phạm Minh Dũng',
        candidateEmail: 'dung.pham@email.com',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        type: 'ONSITE',
        status: 'COMPLETED',
        scheduledAt: '2024-01-20T14:00:00',
        duration: 90,
        location: 'Phòng họp A, Tầng 5',
        interviewers: [{ id: 'emp-1', name: 'Nguyễn Văn Admin', role: 'Engineering Manager' }, { id: 'emp-2', name: 'Trần Thị HR', role: 'HR Manager' }],
        feedback: { rating: 5, strengths: ['Excellent skills', 'Leadership'], weaknesses: [], notes: 'Best candidate', recommendation: 'HIRE' },
        createdAt: '2024-01-15',
    },
    {
        id: 'int-3',
        candidateId: '2',
        candidateName: 'Trần Thị Bình',
        candidateEmail: 'binh.tran@email.com',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        type: 'PHONE',
        status: 'SCHEDULED',
        scheduledAt: '2024-01-25T09:00:00',
        duration: 30,
        interviewers: [{ id: 'emp-2', name: 'Trần Thị HR', role: 'HR Manager' }],
        createdAt: '2024-01-22',
    },
];

// ==================== OFFERS ====================
export type OfferStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface Offer {
    id: string;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    jobId: string;
    jobTitle: string;
    status: OfferStatus;
    salary: { base: number; bonus?: number; allowance?: number };
    startDate: string;
    expiryDate: string;
    benefits: string[];
    notes?: string;
    createdAt: string;
    sentAt?: string;
    respondedAt?: string;
}

export const offerStatusLabels: Record<OfferStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    DRAFT: { label: 'Nháp', variant: 'secondary' },
    SENT: { label: 'Đã gửi', variant: 'default' },
    ACCEPTED: { label: 'Chấp nhận', variant: 'default' },
    REJECTED: { label: 'Từ chối', variant: 'destructive' },
    EXPIRED: { label: 'Hết hạn', variant: 'outline' },
};

export const mockOffers: Offer[] = [
    {
        id: 'off-1',
        candidateId: '4',
        candidateName: 'Phạm Minh Dũng',
        candidateEmail: 'dung.pham@email.com',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        status: 'ACCEPTED',
        salary: { base: 35000000, bonus: 3000000, allowance: 2000000 },
        startDate: '2024-02-15',
        expiryDate: '2024-01-30',
        benefits: ['13th month salary', 'Health insurance', 'Laptop'],
        createdAt: '2024-01-22',
        sentAt: '2024-01-22',
        respondedAt: '2024-01-24',
    },
    {
        id: 'off-2',
        candidateId: '1',
        candidateName: 'Nguyễn Văn An',
        candidateEmail: 'an.nguyen@email.com',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        status: 'SENT',
        salary: { base: 30000000, bonus: 2500000 },
        startDate: '2024-02-20',
        expiryDate: '2024-02-01',
        benefits: ['13th month salary', 'Health insurance'],
        createdAt: '2024-01-25',
        sentAt: '2024-01-25',
    },
];

// ==================== ONBOARDING ====================
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskCategory = 'DOCUMENTS' | 'IT_SETUP' | 'TRAINING' | 'INTRODUCTION' | 'ADMIN';

export interface OnboardingTask {
    id: string;
    title: string;
    description: string;
    category: TaskCategory;
    isRequired: boolean;
    dueDay: number;
    assignedTo?: string;
}

export interface EmployeeOnboarding {
    id: string;
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    jobTitle: string;
    department: string;
    startDate: string;
    buddyId?: string;
    buddyName?: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    tasks: { taskId: string; status: TaskStatus; completedAt?: string; completedBy?: string }[];
    createdAt: string;
}

export const taskCategoryLabels: Record<TaskCategory, { label: string; color: string }> = {
    DOCUMENTS: { label: 'Hồ sơ', color: 'bg-blue-100 text-blue-800' },
    IT_SETUP: { label: 'IT Setup', color: 'bg-purple-100 text-purple-800' },
    TRAINING: { label: 'Đào tạo', color: 'bg-green-100 text-green-800' },
    INTRODUCTION: { label: 'Giới thiệu', color: 'bg-orange-100 text-orange-800' },
    ADMIN: { label: 'Hành chính', color: 'bg-gray-100 text-gray-800' },
};

export const defaultOnboardingTasks: OnboardingTask[] = [
    { id: 'task-1', title: 'Nộp CMND/CCCD', description: 'Bản photo công chứng', category: 'DOCUMENTS', isRequired: true, dueDay: 1 },
    { id: 'task-2', title: 'Nộp sổ hộ khẩu', description: 'Bản photo', category: 'DOCUMENTS', isRequired: true, dueDay: 1 },
    { id: 'task-3', title: 'Ảnh 3x4', description: '4 tấm nền trắng', category: 'DOCUMENTS', isRequired: true, dueDay: 1 },
    { id: 'task-4', title: 'Cấp laptop', description: 'Liên hệ IT', category: 'IT_SETUP', isRequired: true, dueDay: 1, assignedTo: 'IT' },
    { id: 'task-5', title: 'Tạo email công ty', description: '@phoenix.com.vn', category: 'IT_SETUP', isRequired: true, dueDay: 1, assignedTo: 'IT' },
    { id: 'task-6', title: 'Hướng dẫn quy trình', description: 'HR giới thiệu', category: 'TRAINING', isRequired: true, dueDay: 2, assignedTo: 'HR' },
    { id: 'task-7', title: 'Tour văn phòng', description: 'Giới thiệu các phòng ban', category: 'INTRODUCTION', isRequired: true, dueDay: 1 },
    { id: 'task-8', title: 'Ký hợp đồng', description: 'HĐLĐ thử việc', category: 'ADMIN', isRequired: true, dueDay: 1 },
];

export const mockOnboardings: EmployeeOnboarding[] = [
    {
        id: 'onb-1',
        employeeId: 'new-1',
        employeeName: 'Phạm Minh Dũng',
        employeeEmail: 'dung.pham@phoenix.com.vn',
        jobTitle: 'Senior Frontend Developer',
        department: 'Engineering',
        startDate: '2024-02-15',
        buddyId: 'emp-3',
        buddyName: 'Lê Văn Dev',
        status: 'IN_PROGRESS',
        tasks: [
            { taskId: 'task-1', status: 'COMPLETED', completedAt: '2024-02-15', completedBy: 'HR' },
            { taskId: 'task-2', status: 'COMPLETED', completedAt: '2024-02-15', completedBy: 'HR' },
            { taskId: 'task-3', status: 'COMPLETED', completedAt: '2024-02-15', completedBy: 'HR' },
            { taskId: 'task-4', status: 'COMPLETED', completedAt: '2024-02-15', completedBy: 'IT' },
            { taskId: 'task-5', status: 'COMPLETED', completedAt: '2024-02-15', completedBy: 'IT' },
            { taskId: 'task-6', status: 'IN_PROGRESS' },
            { taskId: 'task-7', status: 'COMPLETED', completedAt: '2024-02-15' },
            { taskId: 'task-8', status: 'PENDING' },
        ],
        createdAt: '2024-02-15',
    },
];


