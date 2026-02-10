import { Role } from '../rbac';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
    status: 'active' | 'inactive';
    department?: string;
    position?: string;
    joinedDate: string;
}

// Initial Mock Data
let mockUsersData: User[] = [
    {
        id: 'usr_admin',
        name: 'Admin User',
        email: 'admin@phoenix.com',
        role: 'SUPER_ADMIN',
        avatar: 'https://avatar.vercel.sh/admin',
        status: 'active',
        department: 'Board of Directors',
        position: 'System Administrator',
        joinedDate: '2023-01-01',
    },
    {
        id: 'usr_manager',
        name: 'HR Manager',
        email: 'manager@phoenix.com',
        role: 'HR_MANAGER',
        avatar: 'https://avatar.vercel.sh/manager',
        status: 'active',
        department: 'Human Resources',
        position: 'HR Manager',
        joinedDate: '2023-03-15',
    },
    {
        id: 'usr_employee',
        name: 'Nguyễn Văn Minh',
        email: 'employee@phoenix.com',
        role: 'EMPLOYEE',
        avatar: 'https://avatar.vercel.sh/employee',
        status: 'active',
        department: 'Engineering',
        position: 'Software Engineer',
        joinedDate: '2024-01-10',
    },
    {
        id: 'usr_recruiter',
        name: 'Le Thi Thu Ha',
        email: 'recruiter@phoenix.com',
        role: 'RECRUITER',
        avatar: 'https://avatar.vercel.sh/recruiter',
        status: 'active',
        department: 'Human Resources',
        position: 'Recruitment Specialist',
        joinedDate: '2023-06-20',
    },
    {
        id: 'usr_dept_head',
        name: 'Tran Van Bao',
        email: 'head@phoenix.com',
        role: 'DEPARTMENT_HEAD',
        avatar: 'https://avatar.vercel.sh/head',
        status: 'active',
        department: 'Engineering',
        position: 'Engineering Manager',
        joinedDate: '2022-11-05',
    },
];

export const getMockUsers = (): User[] => {
    return mockUsersData;
};

export const addUser = (user: Omit<User, 'id' | 'joinedDate'>): User => {
    const newUser: User = {
        ...user,
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: `https://avatar.vercel.sh/${user.email}`,
    };
    mockUsersData = [newUser, ...mockUsersData];
    return newUser;
};

export const updateUser = (id: string, updates: Partial<User>): boolean => {
    const index = mockUsersData.findIndex(u => u.id === id);
    if (index === -1) return false;

    mockUsersData[index] = { ...mockUsersData[index], ...updates };
    return true;
};

export const deleteUser = (id: string): boolean => {
    const initialLength = mockUsersData.length;
    mockUsersData = mockUsersData.filter(u => u.id !== id);
    return mockUsersData.length < initialLength;
};

export const updateMockUserRole = (userId: string, newRole: Role): boolean => {
    return updateUser(userId, { role: newRole });
};
