// Mock data for Training Module: Courses, Classes, Materials

// ========== COURSE ==========
export type CourseStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Course {
    id: string;
    code: string;
    name: string;
    description: string;
    level: CourseLevel;
    duration: number; // in hours
    departmentId?: string;
    status: CourseStatus;
    thumbnail?: string;
    createdAt: string;
    updatedAt: string;
}

export const courseStatusLabels: Record<CourseStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    DRAFT: { label: 'Nháp', variant: 'secondary' },
    ACTIVE: { label: 'Đang hoạt động', variant: 'default' },
    ARCHIVED: { label: 'Lưu trữ', variant: 'outline' },
};

export const courseLevelLabels: Record<CourseLevel, { label: string; color: string }> = {
    BEGINNER: { label: 'Cơ bản', color: 'bg-green-100 text-green-800' },
    INTERMEDIATE: { label: 'Trung cấp', color: 'bg-yellow-100 text-yellow-800' },
    ADVANCED: { label: 'Nâng cao', color: 'bg-red-100 text-red-800' },
};

export const mockCourses: Course[] = [
    {
        id: 'course-1',
        code: 'ONBOARD-001',
        name: 'Định hướng nhân viên mới',
        description: 'Khóa học giới thiệu văn hóa công ty, quy trình làm việc và các công cụ cần thiết cho nhân viên mới.',
        level: 'BEGINNER',
        duration: 8,
        status: 'ACTIVE',
        createdAt: '2025-01-15',
        updatedAt: '2025-01-15',
    },
    {
        id: 'course-2',
        code: 'SKILL-001',
        name: 'Kỹ năng giao tiếp chuyên nghiệp',
        description: 'Nâng cao kỹ năng giao tiếp, thuyết trình và làm việc nhóm hiệu quả.',
        level: 'INTERMEDIATE',
        duration: 16,
        status: 'ACTIVE',
        createdAt: '2025-02-01',
        updatedAt: '2025-02-01',
    },
    {
        id: 'course-3',
        code: 'LEAD-001',
        name: 'Lãnh đạo và quản lý đội nhóm',
        description: 'Khóa học dành cho các quản lý, trưởng nhóm về kỹ năng lãnh đạo và phát triển nhân viên.',
        level: 'ADVANCED',
        duration: 24,
        status: 'ACTIVE',
        createdAt: '2025-02-10',
        updatedAt: '2025-02-10',
    },
    {
        id: 'course-4',
        code: 'SAFE-001',
        name: 'An toàn lao động cơ bản',
        description: 'Kiến thức cơ bản về an toàn lao động, phòng cháy chữa cháy và sơ cấp cứu.',
        level: 'BEGINNER',
        duration: 4,
        status: 'ACTIVE',
        createdAt: '2025-01-20',
        updatedAt: '2025-01-20',
    },
];

// ========== CLASS ==========
export type ClassStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface TrainingClass {
    id: string;
    courseId: string;
    courseName: string;
    instructor: string;
    startDate: string;
    endDate: string;
    location: string;
    maxParticipants: number;
    enrolledCount: number;
    status: ClassStatus;
}

export const classStatusLabels: Record<ClassStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    SCHEDULED: { label: 'Đã lên lịch', variant: 'secondary' },
    IN_PROGRESS: { label: 'Đang diễn ra', variant: 'default' },
    COMPLETED: { label: 'Hoàn thành', variant: 'outline' },
    CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
};

export const mockTrainingClasses: TrainingClass[] = [
    {
        id: 'class-1',
        courseId: 'course-1',
        courseName: 'Định hướng nhân viên mới',
        instructor: 'Nguyễn Thu Hà',
        startDate: '2026-02-10',
        endDate: '2026-02-10',
        location: 'Phòng họp A3',
        maxParticipants: 20,
        enrolledCount: 8,
        status: 'SCHEDULED',
    },
    {
        id: 'class-2',
        courseId: 'course-2',
        courseName: 'Kỹ năng giao tiếp chuyên nghiệp',
        instructor: 'Trần Minh Quân',
        startDate: '2026-02-15',
        endDate: '2026-02-16',
        location: 'Online - Google Meet',
        maxParticipants: 30,
        enrolledCount: 25,
        status: 'SCHEDULED',
    },
    {
        id: 'class-3',
        courseId: 'course-4',
        courseName: 'An toàn lao động cơ bản',
        instructor: 'Lê Văn Hùng',
        startDate: '2026-02-05',
        endDate: '2026-02-05',
        location: 'Phòng họp B1',
        maxParticipants: 40,
        enrolledCount: 35,
        status: 'IN_PROGRESS',
    },
];

// ========== TRAINING MATERIAL ==========
export type MaterialType = 'PDF' | 'VIDEO' | 'DOCUMENT' | 'SLIDE' | 'LINK';

export interface TrainingMaterial {
    id: string;
    courseId: string;
    courseName: string;
    name: string;
    type: MaterialType;
    url?: string;
    size?: number; // in bytes
    uploadedBy: string;
    uploadedAt: string;
}

export const materialTypeLabels: Record<MaterialType, { label: string; icon: string }> = {
    PDF: { label: 'PDF', icon: 'FileText' },
    VIDEO: { label: 'Video', icon: 'Video' },
    DOCUMENT: { label: 'Tài liệu', icon: 'File' },
    SLIDE: { label: 'Slide', icon: 'Presentation' },
    LINK: { label: 'Link', icon: 'Link' },
};

export const mockTrainingMaterials: TrainingMaterial[] = [
    {
        id: 'mat-1',
        courseId: 'course-1',
        courseName: 'Định hướng nhân viên mới',
        name: 'Giới thiệu văn hóa công ty.pdf',
        type: 'PDF',
        size: 2500000,
        uploadedBy: 'Nguyễn Thu Hà',
        uploadedAt: '2025-12-01',
    },
    {
        id: 'mat-2',
        courseId: 'course-1',
        courseName: 'Định hướng nhân viên mới',
        name: 'Hướng dẫn sử dụng hệ thống.mp4',
        type: 'VIDEO',
        size: 150000000,
        uploadedBy: 'Nguyễn Thu Hà',
        uploadedAt: '2025-12-05',
    },
    {
        id: 'mat-3',
        courseId: 'course-2',
        courseName: 'Kỹ năng giao tiếp chuyên nghiệp',
        name: 'Slide bài giảng - Giao tiếp hiệu quả.pptx',
        type: 'SLIDE',
        size: 5000000,
        uploadedBy: 'Trần Minh Quân',
        uploadedAt: '2025-12-10',
    },
];

// ========== ENROLLMENT ==========
export type EnrollmentStatus = 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED';

export interface Enrollment {
    id: string;
    employeeId: string;
    employeeName: string;
    classId: string;
    courseName: string;
    enrolledAt: string;
    completedAt?: string;
    progress: number; // 0-100
    status: EnrollmentStatus;
    score?: number;
}

export const enrollmentStatusLabels: Record<EnrollmentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    ENROLLED: { label: 'Đã đăng ký', variant: 'secondary' },
    IN_PROGRESS: { label: 'Đang học', variant: 'default' },
    COMPLETED: { label: 'Hoàn thành', variant: 'outline' },
    DROPPED: { label: 'Bỏ học', variant: 'destructive' },
};

export const mockEnrollments: Enrollment[] = [
    {
        id: 'enroll-1',
        employeeId: '6',
        employeeName: 'Võ Thị Lan',
        classId: 'class-1',
        courseName: 'Định hướng nhân viên mới',
        enrolledAt: '2026-02-01',
        progress: 0,
        status: 'ENROLLED',
    },
    {
        id: 'enroll-2',
        employeeId: '7',
        employeeName: 'Hoàng Văn Tuấn',
        classId: 'class-3',
        courseName: 'An toàn lao động cơ bản',
        enrolledAt: '2026-01-28',
        progress: 60,
        status: 'IN_PROGRESS',
    },
    {
        id: 'enroll-3',
        employeeId: '3',
        employeeName: 'Phạm Văn Tùng',
        classId: 'class-2',
        courseName: 'Kỹ năng giao tiếp chuyên nghiệp',
        enrolledAt: '2026-01-20',
        completedAt: '2026-01-25',
        progress: 100,
        status: 'COMPLETED',
        score: 85,
    },
];

// ========== EXAMS ==========
export type ExamStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface Exam {
    id: string;
    courseId: string;
    courseName: string;
    title: string;
    description: string;
    duration: number; // in minutes
    passingScore: number;
    totalQuestions: number;
    status: ExamStatus;
    createdAt: string;
}

export const examStatusLabels: Record<ExamStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    DRAFT: { label: 'Nháp', variant: 'secondary' },
    ACTIVE: { label: 'Đang hoạt động', variant: 'default' },
    ARCHIVED: { label: 'Lưu trữ', variant: 'outline' },
};

export const mockExams: Exam[] = [
    {
        id: 'exam-1',
        courseId: 'course-1',
        courseName: 'Định hướng nhân viên mới',
        title: 'Bài kiểm tra cuối khóa - Định hướng NV mới',
        description: 'Kiểm tra kiến thức về văn hóa công ty và quy trình làm việc',
        duration: 30,
        passingScore: 70,
        totalQuestions: 20,
        status: 'ACTIVE',
        createdAt: '2025-01-20',
    },
    {
        id: 'exam-2',
        courseId: 'course-4',
        courseName: 'An toàn lao động cơ bản',
        title: 'Bài kiểm tra An toàn lao động',
        description: 'Kiểm tra kiến thức về an toàn lao động và phòng cháy chữa cháy',
        duration: 45,
        passingScore: 80,
        totalQuestions: 30,
        status: 'ACTIVE',
        createdAt: '2025-01-25',
    },
    {
        id: 'exam-3',
        courseId: 'course-2',
        courseName: 'Kỹ năng giao tiếp chuyên nghiệp',
        title: 'Bài tập thực hành Giao tiếp',
        description: 'Bài tập case study về kỹ năng giao tiếp và xử lý tình huống',
        duration: 60,
        passingScore: 75,
        totalQuestions: 15,
        status: 'ACTIVE',
        createdAt: '2025-02-05',
    },
];

export interface ExamResult {
    id: string;
    examId: string;
    examTitle: string;
    employeeId: string;
    employeeName: string;
    score: number;
    passed: boolean;
    startedAt: string;
    completedAt: string;
    duration: number; // actual time in minutes
}

export const mockExamResults: ExamResult[] = [
    {
        id: 'result-1',
        examId: 'exam-1',
        examTitle: 'Bài kiểm tra cuối khóa - Định hướng NV mới',
        employeeId: '3',
        employeeName: 'Phạm Văn Tùng',
        score: 85,
        passed: true,
        startedAt: '2026-01-25T09:00:00',
        completedAt: '2026-01-25T09:22:00',
        duration: 22,
    },
    {
        id: 'result-2',
        examId: 'exam-2',
        examTitle: 'Bài kiểm tra An toàn lao động',
        employeeId: '7',
        employeeName: 'Hoàng Văn Tuấn',
        score: 65,
        passed: false,
        startedAt: '2026-02-03T14:00:00',
        completedAt: '2026-02-03T14:40:00',
        duration: 40,
    },
];

// ========== E-LEARNING LESSONS ==========
export type LessonType = 'VIDEO' | 'DOCUMENT' | 'QUIZ';
export type LessonStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Lesson {
    id: string;
    courseId: string;
    courseName: string;
    title: string;
    description: string;
    type: LessonType;
    videoUrl?: string;
    duration: number; // in minutes
    order: number;
    content?: string; // for DOCUMENT type
}

export interface LessonProgress {
    lessonId: string;
    lessonTitle: string;
    employeeId: string;
    employeeName: string;
    status: LessonStatus;
    progress: number; // 0-100 for video watch progress
    completedAt?: string;
    watchTime: number; // seconds
}

export const lessonTypeLabels: Record<LessonType, { label: string; icon: string }> = {
    VIDEO: { label: 'Video', icon: 'Video' },
    DOCUMENT: { label: 'Tài liệu', icon: 'FileText' },
    QUIZ: { label: 'Kiểm tra', icon: 'FileQuestion' },
};

export const mockLessons: Lesson[] = [
    {
        id: 'lesson-1',
        courseId: 'course-1',
        courseName: 'Định hướng nhân viên mới',
        title: 'Giới thiệu văn hóa công ty',
        description: 'Tìm hiểu về văn hóa, giá trị cốt lõi và tầm nhìn của công ty',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 15,
        order: 1,
    },
    {
        id: 'lesson-2',
        courseId: 'course-1',
        courseName: 'Định hướng nhân viên mới',
        title: 'Quy trình làm việc và công cụ',
        description: 'Hướng dẫn sử dụng các công cụ và quy trình nội bộ',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        duration: 20,
        order: 2,
    },
    {
        id: 'lesson-3',
        courseId: 'course-1',
        courseName: 'Định hướng nhân viên mới',
        title: 'Chính sách nhân sự',
        description: 'Các chính sách về nghỉ phép, phúc lợi và quy định',
        type: 'DOCUMENT',
        duration: 10,
        order: 3,
        content: '# Chính sách nhân sự\n\n## 1. Nghỉ phép\n- Phép năm: 12 ngày/năm\n- Nghỉ ốm: 30 ngày/năm\n\n## 2. Phúc lợi\n- BHXH, BHYT, BHTN\n- Bảo hiểm sức khỏe toàn diện\n- Thưởng hiệu suất',
    },
    {
        id: 'lesson-4',
        courseId: 'course-1',
        courseName: 'Định hướng nhân viên mới',
        title: 'Bài kiểm tra cuối khóa',
        description: 'Kiểm tra kiến thức đã học',
        type: 'QUIZ',
        duration: 15,
        order: 4,
    },
    {
        id: 'lesson-5',
        courseId: 'course-4',
        courseName: 'An toàn lao động cơ bản',
        title: 'Nguyên tắc an toàn lao động',
        description: 'Các nguyên tắc cơ bản về an toàn lao động',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        duration: 25,
        order: 1,
    },
];

export const mockLessonProgress: LessonProgress[] = [
    {
        lessonId: 'lesson-1',
        lessonTitle: 'Giới thiệu văn hóa công ty',
        employeeId: '6',
        employeeName: 'Võ Thị Lan',
        status: 'COMPLETED',
        progress: 100,
        completedAt: '2026-02-03',
        watchTime: 900,
    },
    {
        lessonId: 'lesson-2',
        lessonTitle: 'Quy trình làm việc và công cụ',
        employeeId: '6',
        employeeName: 'Võ Thị Lan',
        status: 'IN_PROGRESS',
        progress: 45,
        watchTime: 540,
    },
    {
        lessonId: 'lesson-1',
        lessonTitle: 'Giới thiệu văn hóa công ty',
        employeeId: '7',
        employeeName: 'Hoàng Văn Tuấn',
        status: 'IN_PROGRESS',
        progress: 30,
        watchTime: 270,
    },
];

// ========== QUIZ QUESTIONS ==========
export interface QuizQuestion {
    id: string;
    lessonId: string;
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option
    explanation?: string;
}

export interface QuizAttempt {
    id: string;
    lessonId: string;
    employeeId: string;
    employeeName: string;
    answers: number[]; // selected option indexes
    score: number;
    passed: boolean;
    completedAt: string;
}

export const mockQuizQuestions: QuizQuestion[] = [
    // Lesson 4 - Bài kiểm tra cuối khóa (course-1)
    {
        id: 'q1',
        lessonId: 'lesson-4',
        question: 'Công ty được thành lập vào năm nào?',
        options: ['2010', '2015', '2018', '2020'],
        correctAnswer: 1,
        explanation: 'Công ty được thành lập vào năm 2015.',
    },
    {
        id: 'q2',
        lessonId: 'lesson-4',
        question: 'Giá trị cốt lõi nào KHÔNG thuộc về công ty?',
        options: ['Đổi mới sáng tạo', 'Khách hàng là trung tâm', 'Lợi nhuận tối đa', 'Làm việc nhóm'],
        correctAnswer: 2,
        explanation: 'Lợi nhuận tối đa không phải là giá trị cốt lõi của công ty.',
    },
    {
        id: 'q3',
        lessonId: 'lesson-4',
        question: 'Nhân viên mới được hưởng bao nhiêu ngày phép năm?',
        options: ['10 ngày', '12 ngày', '14 ngày', '15 ngày'],
        correctAnswer: 1,
        explanation: 'Theo quy định, nhân viên được hưởng 12 ngày phép/năm.',
    },
    {
        id: 'q4',
        lessonId: 'lesson-4',
        question: 'Ai là người liên hệ khi cần hỗ trợ IT?',
        options: ['Bộ phận HR', 'Bộ phận IT helpdesk', 'Quản lý trực tiếp', 'Phòng tổng hợp'],
        correctAnswer: 1,
        explanation: 'Bộ phận IT helpdesk sẽ hỗ trợ các vấn đề về công nghệ.',
    },
    {
        id: 'q5',
        lessonId: 'lesson-4',
        question: 'Thời gian làm việc chính thức là?',
        options: ['8h00 - 17h00', '8h30 - 17h30', '9h00 - 18h00', '8h00 - 18h00'],
        correctAnswer: 1,
        explanation: 'Thời gian làm việc chính thức từ 8h30 đến 17h30.',
    },
    // Additional questions for safety course
    {
        id: 'q6',
        lessonId: 'lesson-5',
        question: 'Khi phát hiện hỏa hoạn, bước đầu tiên cần làm là gì?',
        options: ['Chạy thoát khỏi tòa nhà', 'Báo động và thông báo cho mọi người', 'Cố gắng dập lửa', 'Gọi điện cho người thân'],
        correctAnswer: 1,
        explanation: 'Việc đầu tiên là báo động để mọi người biết và di chuyển đến nơi an toàn.',
    },
    {
        id: 'q7',
        lessonId: 'lesson-5',
        question: 'Thiết bị bảo hộ cá nhân (PPE) bao gồm những gì?',
        options: ['Mũ bảo hộ, găng tay, kính bảo hộ', 'Điện thoại, laptop, tai nghe', 'Giày dép, quần áo thường', 'Đồ ăn, nước uống'],
        correctAnswer: 0,
        explanation: 'PPE bao gồm các thiết bị bảo vệ như mũ, găng tay, kính bảo hộ...',
    },
];

export const mockQuizAttempts: QuizAttempt[] = [
    {
        id: 'attempt-1',
        lessonId: 'lesson-4',
        employeeId: '3',
        employeeName: 'Phạm Văn Tùng',
        answers: [1, 2, 1, 1, 1],
        score: 100,
        passed: true,
        completedAt: '2026-01-25T09:22:00',
    },
];
