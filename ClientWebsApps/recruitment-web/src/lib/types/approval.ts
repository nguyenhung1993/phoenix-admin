
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export type ApprovalRole = 'MANAGER' | 'HR_MANAGER' | 'DIRECTOR' | 'FINANCE' | 'IT_ADMIN';

export interface ApprovalStep {
    id: string;
    order: number;
    role: ApprovalRole; // The role required to approve this step
    approverId?: string; // Optional: specific user ID
    status: ApprovalStatus;
    approvedBy?: string;
    approvedAt?: string;
    comment?: string;
}

export interface ApprovalWorkflow {
    id: string;
    name: string;
    description: string;
    type: 'LEAVE' | 'OVERTIME' | 'PROMOTION' | 'RESIGNATION' | 'ASSET_REQUEST';
    steps: { order: number; role: ApprovalRole; label: string }[];
}

export interface ApprovalRequest {
    id: string;
    code: string; // e.g., REQ-2024-001
    type: ApprovalWorkflow['type'];
    requesterId: string;
    requesterName: string;
    department: string;

    // Request Details (Dynamic payload depending on type)
    title: string;
    description: string;
    metadata?: Record<string, any>;

    createdAt: string;
    status: ApprovalStatus;

    // Workflow State
    currentStepOrder: number;
    totalSteps: number;
    steps: ApprovalStep[];
}
