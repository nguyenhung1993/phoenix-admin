export interface Lesson {
    id: string;
    title: string;
    description?: string;
    duration: string; // e.g., "10:00"
    type: 'VIDEO' | 'ARTICLE' | 'QUIZ';
    videoUrl?: string; // Mock URL
    content?: string; // For articles
}

export interface CourseModule {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    instructor: string;
    duration: string; // "2h 30m"
    totalModules: number;
    totalLessons: number;
    category: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    students: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
    modules: CourseModule[]; // Included for detail view
}

export const courseCategories = [
    { id: 'cat-1', name: 'Onboarding' },
    { id: 'cat-2', name: 'Technical Skills' },
    { id: 'cat-3', name: 'Soft Skills' },
    { id: 'cat-4', name: 'Compliance' },
    { id: 'cat-5', name: 'Leadership' },
];

export const mockCourses: Course[] = [
    {
        id: 'c-1',
        title: 'Hội nhập văn hóa doanh nghiệp',
        description: 'Khóa học bắt buộc dành cho nhân viên mới để tìm hiểu về lịch sử, sứ mệnh và văn hóa của công ty Phoenix.',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        instructor: 'HR Department',
        duration: '1h 30m',
        totalModules: 3,
        totalLessons: 8,
        category: 'Onboarding',
        level: 'BEGINNER',
        students: 156,
        rating: 4.8,
        createdAt: '2025-12-01',
        updatedAt: '2026-01-15',
        status: 'PUBLISHED',
        modules: [
            {
                id: 'm-1-1',
                title: 'Giới thiệu về Phoenix',
                lessons: [
                    { id: 'l-1-1-1', title: 'Lịch sử hình thành', duration: '10:00', type: 'VIDEO' },
                    { id: 'l-1-1-2', title: 'Tầm nhìn & Sứ mệnh', duration: '15:00', type: 'VIDEO' },
                ]
            },
            {
                id: 'm-1-2',
                title: 'Quy định & Chính sách',
                lessons: [
                    { id: 'l-1-2-1', title: 'Sổ tay nhân viên', duration: '20:00', type: 'ARTICLE' },
                    { id: 'l-1-2-2', title: 'Quy định bảo mật', duration: '15:00', type: 'VIDEO' },
                    { id: 'l-1-2-3', title: 'Kiểm tra kiến thức', duration: '10:00', type: 'QUIZ' },
                ]
            }
        ]
    },
    {
        id: 'c-2',
        title: 'Kỹ năng giao tiếp hiệu quả',
        description: 'Nâng cao khả năng giao tiếp, thuyết trình và làm việc nhóm trong môi trường công sở chuyên nghiệp.',
        thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
        instructor: 'Dr. John Doe',
        duration: '3h 45m',
        totalModules: 5,
        totalLessons: 15,
        category: 'Soft Skills',
        level: 'INTERMEDIATE',
        students: 89,
        rating: 4.5,
        createdAt: '2026-01-05',
        updatedAt: '2026-02-01',
        status: 'PUBLISHED',
        modules: []
    },
    {
        id: 'c-3',
        title: 'Quy trình Tuyển dụng 2026',
        description: 'Cập nhật quy trình tuyển dụng mới áp dụng từ năm 2026 cho bộ phận TA.',
        thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
        instructor: 'Recruitment Team',
        duration: '45m',
        totalModules: 2,
        totalLessons: 4,
        category: 'Technical Skills',
        level: 'ADVANCED',
        students: 12,
        rating: 5.0,
        createdAt: '2026-02-01',
        updatedAt: '2026-02-01',
        status: 'DRAFT',
        modules: []
    }
];

export const courseStatusLabels: Record<Course['status'], { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | null | undefined }> = {
    PUBLISHED: { label: 'Đã xuất bản', variant: 'default' },
    DRAFT: { label: 'Bản nháp', variant: 'secondary' },
    ARCHIVED: { label: 'Lưu trữ', variant: 'outline' },
};

// ========== CLASSES SUPPORT ==========

export type ClassStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface Class {
    id: string;
    courseId: string;
    code: string;
    startDate: string;
    endDate: string;
    instructor: string;
    capacity: number;
    enrolled: number;
    status: ClassStatus;
    location?: string;
}

export const mockClasses: Class[] = [
    {
        id: 'cls-1',
        courseId: 'c-1',
        code: 'CLS-2026-001',
        startDate: '2026-02-15',
        endDate: '2026-02-15',
        instructor: 'HR Department',
        capacity: 30,
        enrolled: 25,
        status: 'scheduled',
        location: 'Phòng họp lớn tầng 3'
    },
    {
        id: 'cls-2',
        courseId: 'c-2',
        code: 'CLS-2026-002',
        startDate: '2026-02-20',
        endDate: '2026-02-22',
        instructor: 'Dr. John Doe',
        capacity: 20,
        enrolled: 18,
        status: 'scheduled',
        location: 'Online Zoom'
    },
    {
        id: 'cls-3',
        courseId: 'c-1',
        code: 'CLS-2026-003',
        startDate: '2026-01-10',
        endDate: '2026-01-10',
        instructor: 'HR Department',
        capacity: 30,
        enrolled: 30,
        status: 'completed',
        location: 'Phòng đào tạo'
    }
];

// ========== MATERIAL SUPPORT ==========

export type MaterialType = 'pdf' | 'video' | 'slide' | 'link';

export interface Material {
    id: string;
    title: string;
    courseId: string;
    type: MaterialType;
    url: string;
    size?: string;
    createdAt: string;
}

export const mockMaterials: Material[] = [
    { id: 'mat-1', title: 'Sổ tay nhân viên 2026.pdf', courseId: 'c-1', type: 'pdf', url: '#', size: '2.5 MB', createdAt: '2026-01-10' },
    { id: 'mat-2', title: 'Video giới thiệu văn hóa.mp4', courseId: 'c-1', type: 'video', url: '#', size: '150 MB', createdAt: '2026-01-12' },
    { id: 'mat-3', title: 'Slide bài giảng - Kỹ năng giao tiếp.pptx', courseId: 'c-2', type: 'slide', url: '#', size: '15 MB', createdAt: '2026-02-05' },
    { id: 'mat-4', title: 'Quy trình tuyển dụng chi tiết (Link)', courseId: 'c-3', type: 'link', url: '#', createdAt: '2026-02-01' },
];

// ========== ENROLLMENT SUPPORT (History Page) ==========

export interface Enrollment {
    id: string;
    userId: string;
    userName: string;
    courseId: string;
    courseName: string;
    enrolledAt: string;
    completedAt?: string;
    progress: number; // 0-100
    score?: number;
    status: 'in-progress' | 'completed' | 'failed';
}

export const mockEnrollments: Enrollment[] = [
    {
        id: 'enr-1',
        userId: 'u-1', userName: 'Nguyễn Văn A',
        courseId: 'c-1', courseName: 'Hội nhập văn hóa doanh nghiệp',
        enrolledAt: '2026-01-10', completedAt: '2026-01-15',
        progress: 100, score: 95, status: 'completed'
    },
    {
        id: 'enr-2',
        userId: 'u-2', userName: 'Trần Thị B',
        courseId: 'c-1', courseName: 'Hội nhập văn hóa doanh nghiệp',
        enrolledAt: '2026-02-01',
        progress: 45, status: 'in-progress'
    },
    {
        id: 'enr-3',
        userId: 'u-3', userName: 'Lê Văn C',
        courseId: 'c-2', courseName: 'Kỹ năng giao tiếp hiệu quả',
        enrolledAt: '2026-01-20',
        progress: 10, status: 'in-progress'
    },
    {
        id: 'enr-4',
        userId: 'u-4', userName: 'Phạm Thị D',
        courseId: 'c-1', courseName: 'Hội nhập văn hóa doanh nghiệp',
        enrolledAt: '2026-01-05', completedAt: '2026-01-08',
        progress: 100, score: 60, status: 'failed' // Example failed
    }
];

// ========== EXAM SUPPORT ==========

export interface Exam {
    id: string;
    title: string;
    durationMinutes: number;
    totalQuestions: number;
    passScore: number;
    status: 'active' | 'draft';
}

export const mockExams: Exam[] = [
    { id: 'ex-1', title: 'Kiểm tra IQ - Tuyển dụng', durationMinutes: 30, totalQuestions: 20, passScore: 70, status: 'active' },
    { id: 'ex-2', title: 'Đánh giá năng lực chuyên môn - IT', durationMinutes: 60, totalQuestions: 40, passScore: 60, status: 'active' },
    { id: 'ex-3', title: 'Kiểm tra Tiếng Anh đầu vào', durationMinutes: 45, totalQuestions: 50, passScore: 50, status: 'draft' },
];

export const getCourses = () => mockCourses;
export const getAllClasses = () => mockClasses;
export const getEnrollments = () => mockEnrollments;
export const getExams = () => mockExams;
