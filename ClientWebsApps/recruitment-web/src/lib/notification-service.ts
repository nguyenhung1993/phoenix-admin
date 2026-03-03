import prisma from '@/lib/prisma';
import { NotificationType, NotificationPriority } from '@prisma/client';
import { sendEmail } from '@/lib/email';

// ========== TYPES ==========

export interface NotifyOptions {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    priority?: NotificationPriority;
    actionUrl?: string;
    senderName?: string;
    senderAvatar?: string;
    /** If true, also send an email notification */
    sendEmailNotification?: boolean;
    /** Email address to send to (required if sendEmailNotification is true) */
    emailTo?: string;
    /** Custom email subject (defaults to title) */
    emailSubject?: string;
}

export interface NotifyManyOptions {
    userIds: string[];
    title: string;
    message: string;
    type: NotificationType;
    priority?: NotificationPriority;
    actionUrl?: string;
    senderName?: string;
}

// ========== NOTIFICATION SERVICE ==========

export const notificationService = {

    /**
     * Send a notification to a single user (in-app + optional email)
     */
    async notify(options: NotifyOptions) {
        const {
            userId,
            title,
            message,
            type,
            priority = 'MEDIUM',
            actionUrl,
            senderName,
            senderAvatar,
            sendEmailNotification = false,
            emailTo,
            emailSubject,
        } = options;

        try {
            // 1. Create in-app notification
            const notification = await prisma.notification.create({
                data: {
                    userId,
                    title,
                    message,
                    type,
                    priority,
                    actionUrl,
                    senderName,
                    senderAvatar,
                    isRead: false,
                },
            });

            // 2. Send email if requested
            if (sendEmailNotification && emailTo) {
                try {
                    await sendEmail(
                        emailTo,
                        emailSubject || title,
                        this.buildEmailHtml(title, message, actionUrl)
                    );
                } catch (emailError) {
                    console.error('Email notification failed (non-blocking):', emailError);
                    // Don't throw — email failure should not block in-app notification
                }
            }

            return notification;
        } catch (error) {
            console.error('Failed to create notification:', error);
            return null;
        }
    },

    /**
     * Send notifications to multiple users at once (in-app only)
     */
    async notifyMany(options: NotifyManyOptions) {
        const {
            userIds,
            title,
            message,
            type,
            priority = 'MEDIUM',
            actionUrl,
            senderName,
        } = options;

        if (userIds.length === 0) return;

        try {
            await prisma.notification.createMany({
                data: userIds.map(userId => ({
                    userId,
                    title,
                    message,
                    type,
                    priority,
                    actionUrl,
                    senderName,
                })),
            });
        } catch (error) {
            console.error('Failed to create bulk notifications:', error);
        }
    },

    /**
     * Notify all HR staff (SUPER_ADMIN, HR_MANAGER, HR_STAFF, RECRUITER)
     */
    async notifyHR(title: string, message: string, type: NotificationType, actionUrl?: string) {
        try {
            const hrUsers = await prisma.user.findMany({
                where: {
                    role: { in: ['SUPER_ADMIN', 'HR_MANAGER', 'HR_STAFF', 'RECRUITER'] },
                    status: 'ACTIVE',
                },
                select: { id: true },
            });

            await this.notifyMany({
                userIds: hrUsers.map(u => u.id),
                title,
                message,
                type,
                actionUrl,
                senderName: 'Hệ thống',
            });
        } catch (error) {
            console.error('Failed to notify HR:', error);
        }
    },

    /**
     * Notify manager of employee (look up employee, find their manager's userId)
     */
    async notifyManager(employeeId: string, title: string, message: string, type: NotificationType, actionUrl?: string) {
        try {
            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
                select: {
                    fullName: true,
                    manager: {
                        select: {
                            user: { select: { id: true } },
                        },
                    },
                },
            });

            if (employee?.manager?.user?.id) {
                await this.notify({
                    userId: employee.manager.user.id,
                    title,
                    message,
                    type,
                    actionUrl,
                    senderName: employee.fullName,
                });
            }
        } catch (error) {
            console.error('Failed to notify manager:', error);
        }
    },

    /**
     * Build simple HTML email body
     */
    buildEmailHtml(title: string, message: string, actionUrl?: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
    <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0;">🔔 ${title}</h2>
            </div>
            <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 24px 0;">
                ${message}
            </p>
            ${actionUrl ? `
            <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${actionUrl}" 
                   style="display: inline-block; padding: 10px 24px; background: #0f172a; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    Xem chi tiết
                </a>
            </div>` : ''}
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;">
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
                Phoenix HR System — Thông báo tự động
            </p>
        </div>
    </div>
</body>
</html>`;
    },
};
