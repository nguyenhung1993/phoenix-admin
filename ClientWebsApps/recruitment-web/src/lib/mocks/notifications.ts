import { Notification } from "@/lib/types/notification";

export const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Đơn xin nghỉ phép mới',
        message: 'Nguyễn Văn A đã gửi yêu cầu nghỉ phép (Phép năm) từ 12/02 - 14/02.',
        type: 'LEAVE_REQUEST',
        priority: 'MEDIUM',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        actionUrl: '/admin/leave',
        sender: {
            name: 'Nguyễn Văn A',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=A'
        }
    },
    {
        id: '2',
        title: 'Hợp đồng sắp hết hạn',
        message: 'Hợp đồng lao động của Trần Thị B sẽ hết hạn trong 15 ngày tới.',
        type: 'CONTRACT_EXPIRY',
        priority: 'HIGH',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        actionUrl: '/admin/employees',
        sender: {
            name: 'Hệ thống'
        }
    },
    {
        id: '3',
        title: 'Sinh nhật nhân viên',
        message: 'Hôm nay là sinh nhật của Lê Văn C! Hãy gửi lời chúc mừng.',
        type: 'BIRTHDAY',
        priority: 'LOW',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        sender: {
            name: 'Hệ thống'
        }
    },
    {
        id: '4',
        title: 'Cập nhật hệ thống',
        message: 'Hệ thống sẽ bảo trì vào 22:00 tối nay. Vui lòng lưu công việc.',
        type: 'SYSTEM_ALERT',
        priority: 'CRITICAL',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
        sender: {
            name: 'Admin System'
        }
    }
];
