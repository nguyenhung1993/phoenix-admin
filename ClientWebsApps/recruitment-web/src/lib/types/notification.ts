
export type NotificationType =
    | 'LEAVE_REQUEST'
    | 'OVERTIME_REQUEST'
    | 'CONTRACT_EXPIRY'
    | 'SYSTEM_ALERT'
    | 'BIRTHDAY'
    | 'TASK_ASSIGNMENT';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    isRead: boolean;
    createdAt: string; // ISO String
    actionUrl?: string; // Link to the relevant page (e.g., /admin/leave/[id])
    sender?: {
        name: string;
        avatar?: string;
    };
}
