import prisma from '@/lib/prisma';
import { NotificationType } from '@prisma/client';

export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = 'SYSTEM_ALERT'
) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                isRead: false,
            },
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
}

export async function notifyAdmins(title: string, message: string, type: NotificationType = 'SYSTEM_ALERT') {
    try {
        // Find all admins
        const admins = await prisma.user.findMany({
            where: {
                role: {
                    in: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']
                }
            },
            select: { id: true }
        });

        if (admins.length === 0) return;

        // Create notifications using createMany
        await prisma.notification.createMany({
            data: admins.map(admin => ({
                userId: admin.id,
                title,
                message,
                type,
            }))
        });
    } catch (error) {
        console.error('Error notifying admins:', error);
    }
}
