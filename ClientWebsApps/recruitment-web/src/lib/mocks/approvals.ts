import { ApprovalWorkflow, ApprovalRequest } from "@/lib/types/approval";

export const mockWorkflows: ApprovalWorkflow[] = [
    {
        id: 'WF-LEAVE-STD',
        name: 'Quy trình Xin nghỉ phép (Tiêu chuẩn)',
        description: 'Dành cho nghỉ phép dưới 3 ngày',
        type: 'LEAVE',
        steps: [
            { order: 1, role: 'MANAGER', label: 'Quản lý trực tiếp' }
        ]
    },
    {
        id: 'WF-LEAVE-LONG',
        name: 'Quy trình Xin nghỉ phép (>3 ngày)',
        description: 'Dành cho nghỉ phép dài ngày',
        type: 'LEAVE',
        steps: [
            { order: 1, role: 'MANAGER', label: 'Quản lý trực tiếp' },
            { order: 2, role: 'HR_MANAGER', label: 'Trưởng phòng Nhân sự' }
        ]
    },
    {
        id: 'WF-ASSET',
        name: 'Quy trình Yêu cầu Tài sản',
        description: 'Mua sắm hoặc cấp phát thiết bị',
        type: 'ASSET_REQUEST',
        steps: [
            { order: 1, role: 'MANAGER', label: 'Quản lý trực tiếp' },
            { order: 2, role: 'IT_ADMIN', label: 'IT Admin' },
            { order: 3, role: 'FINANCE', label: 'Kế toán trưởng' } // For budget approval
        ]
    }
];

export const mockApprovalRequests: ApprovalRequest[] = [
    {
        id: 'REQ-001',
        code: 'REQ-2024-001',
        type: 'LEAVE',
        requesterId: 'USR-002',
        requesterName: 'Nguyễn Văn A',
        department: 'Engineering',
        title: 'Xin nghỉ phép du lịch',
        description: 'Nghỉ phép năm từ 20/02 đến 25/02 (5 ngày)',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        status: 'PENDING',
        currentStepOrder: 2,
        totalSteps: 2,
        steps: [
            {
                id: 'S1',
                order: 1,
                role: 'MANAGER',
                status: 'APPROVED',
                approvedBy: 'Trần Văn Quản Lý',
                approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
                comment: 'Đồng ý, nhớ bàn giao công việc.'
            },
            {
                id: 'S2',
                order: 2,
                role: 'HR_MANAGER',
                status: 'PENDING'
            }
        ]
    },
    {
        id: 'REQ-002',
        code: 'REQ-2024-002',
        type: 'ASSET_REQUEST',
        requesterId: 'USR-005',
        requesterName: 'Lê Thị C',
        department: 'Design',
        title: 'Yêu cầu màn hình rời',
        description: 'Màn hình Dell Ultrasharp phục vụ thiết kế',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        status: 'PENDING',
        currentStepOrder: 1,
        totalSteps: 3,
        steps: [
            {
                id: 'S1',
                order: 1,
                role: 'MANAGER',
                status: 'PENDING'
            },
            {
                id: 'S2',
                order: 2,
                role: 'IT_ADMIN',
                status: 'PENDING'
            },
            {
                id: 'S3',
                order: 3,
                role: 'FINANCE',
                status: 'PENDING'
            }
        ]
    }
];
