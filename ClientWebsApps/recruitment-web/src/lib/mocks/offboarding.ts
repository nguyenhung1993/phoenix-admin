
// Mock data for Offboarding (Resignations)

export interface ResignationRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    managerId: string;
    managerName?: string;
    reason: string;
    lastWorkingDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    handoverStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    feedback?: string;
    createdAt: string;
}

export const mockResignations: ResignationRequest[] = [
    {
        id: '1',
        employeeId: '6',
        employeeName: 'Võ Thị Lan',
        managerId: '2',
        managerName: 'Trần Thị Hương',
        reason: 'Chuyển định hướng nghề nghiệp, muốn thử sức ở môi trường startup.',
        lastWorkingDate: '2026-03-01',
        status: 'PENDING',
        handoverStatus: 'PENDING',
        createdAt: '2026-02-01',
    },
    {
        id: '2',
        employeeId: '8',
        employeeName: 'Trần Thị Bình',
        managerId: '4',
        managerName: 'Nguyễn Hoàng Nam',
        reason: 'Lý do cá nhân (Sức khỏe).',
        lastWorkingDate: '2026-02-15',
        status: 'APPROVED',
        handoverStatus: 'IN_PROGRESS',
        feedback: 'Đồng ý nguyện vọng. Đã trao đổi kỹ.',
        createdAt: '2026-01-20',
    }
];

export const resignationStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' }> = {
    PENDING: { label: 'Chờ duyệt', variant: 'secondary' },
    APPROVED: { label: 'Đã duyệt', variant: 'default' }, // Changed to default (usually black/dark in shadcn) or success green if available
    REJECTED: { label: 'Từ chối', variant: 'destructive' },
    COMPLETED: { label: 'Hoàn tất', variant: 'outline' },
};
