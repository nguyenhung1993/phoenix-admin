import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export type AuditAction =
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'APPROVE'
    | 'REJECT'
    | 'LOGIN'
    | 'LOGOUT'
    | 'EXPORT'
    | 'IMPORT';

interface LogOptions {
    userId?: string | null;
    userName?: string | null;
    action: AuditAction;
    target: string;
    details?: string;
    status?: 'success' | 'error';
}

class AuditService {
    /**
     * Ghi audit log vào database
     */
    async log(options: LogOptions) {
        const { userId, userName, action, target, details, status = 'success' } = options;

        let ip: string | null = null;
        try {
            const headersList = await headers();
            ip = headersList.get('x-forwarded-for')
                || headersList.get('x-real-ip')
                || null;
        } catch {
            // headers() might fail outside request context
        }

        try {
            await prisma.auditLog.create({
                data: {
                    userId,
                    userName,
                    action: `${action}${details ? `: ${details}` : ''}`,
                    target,
                    status,
                    ip,
                },
            });
        } catch (error) {
            console.error('Failed to write audit log:', error);
            // Don't throw — audit failures should never break the main flow
        }
    }

    /** Shorthand: log a CREATE action */
    async logCreate(userId: string | null, userName: string | null, target: string, details?: string) {
        return this.log({ userId, userName, action: 'CREATE', target, details });
    }

    /** Shorthand: log an UPDATE action */
    async logUpdate(userId: string | null, userName: string | null, target: string, details?: string) {
        return this.log({ userId, userName, action: 'UPDATE', target, details });
    }

    /** Shorthand: log a DELETE action */
    async logDelete(userId: string | null, userName: string | null, target: string, details?: string) {
        return this.log({ userId, userName, action: 'DELETE', target, details });
    }

    /** Shorthand: log an APPROVE action */
    async logApprove(userId: string | null, userName: string | null, target: string, details?: string) {
        return this.log({ userId, userName, action: 'APPROVE', target, details });
    }

    /** Shorthand: log a REJECT action */
    async logReject(userId: string | null, userName: string | null, target: string, details?: string) {
        return this.log({ userId, userName, action: 'REJECT', target, details });
    }

    /** Shorthand: log a LOGIN action */
    async logLogin(userId: string | null, userName: string | null) {
        return this.log({ userId, userName, action: 'LOGIN', target: 'auth' });
    }
}

export const auditService = new AuditService();
