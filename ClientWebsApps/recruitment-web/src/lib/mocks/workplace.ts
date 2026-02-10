
// Mock data for Workplace (Social Network)

export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string; // URL or simplified initials logic
    authorRole?: string;
    content: string;
    images?: string[];
    type: 'ANNOUNCEMENT' | 'SOCIAL' | 'EVENT';
    likes: number;
    comments: number;
    createdAt: string; // ISO string or relative time mock
}

export interface WorkplaceEvent {
    id: string;
    type: 'BIRTHDAY' | 'NEW_HIRE' | 'COMPANY_EVENT';
    title: string;
    date: string; // YYYY-MM-DD
    targetId?: string; // Employee ID for birthday/new hire
    description?: string;
}

export const mockPosts: Post[] = [
    {
        id: '1',
        authorId: '1', // Nguyen Van Minh
        authorName: 'Nguyễn Văn Minh',
        authorRole: 'CEO',
        content: 'Chào mừng các thành viên mới gia nhập đại gia đình Phoenix! Chúc mọi người có những trải nghiệm tuyệt vời và cùng nhau bứt phá trong quý này. 🚀🔥',
        type: 'ANNOUNCEMENT',
        likes: 45,
        comments: 12,
        createdAt: '2026-02-06T08:00:00Z',
    },
    {
        id: '2',
        authorId: '2', // Tran Thi Huong
        authorName: 'Trần Thị Hương',
        authorRole: 'HR Manager',
        content: 'Thông báo: Chiều nay 15:00 sẽ có tiệc trà tại khu vực Pantry mừng sinh nhật tháng 2. Mọi người nhớ tham gia đầy đủ nhé! 🎂🍰',
        type: 'EVENT',
        images: ['https://images.unsplash.com/photo-1530103862676-de3c9a59af38?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        likes: 32,
        comments: 5,
        createdAt: '2026-02-06T09:30:00Z',
    },
    {
        id: '3',
        authorId: '3', // Pham Van Tung
        authorName: 'Phạm Văn Tùng',
        authorRole: 'IT Manager',
        content: 'Vừa hoàn thành nâng cấp hệ thống mạng nội bộ. Anh em test thử xem tốc độ có "xé gió" không nhé! 🏎️💨',
        type: 'SOCIAL',
        likes: 18,
        comments: 8,
        createdAt: '2026-02-05T16:00:00Z',
    }
];

export const mockEvents: WorkplaceEvent[] = [
    {
        id: '1',
        type: 'BIRTHDAY',
        title: 'Sinh nhật Lê Minh Đức',
        date: '2026-02-10',
        targetId: '5',
    },
    {
        id: '2',
        type: 'NEW_HIRE',
        title: 'Chào mừng Võ Thị Lan',
        date: '2026-02-01',
        targetId: '6',
    },
    {
        id: '3',
        type: 'COMPANY_EVENT',
        title: 'Year End Party 2025',
        date: '2026-01-31',
        description: 'Tiệc tất niên tổng kết năm',
    }
];
