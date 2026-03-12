import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { notificationService } from '@/lib/notification-service';
import { format, addDays } from 'date-fns';

export const dynamic = 'force-dynamic';

/**
 * CRON endpoint for daily automated notifications.
 * Should be called once per day by an external scheduler (e.g., Vercel Cron, GitHub Actions).
 * 
 * Protected by CRON_SECRET env variable.
 * 
 * Handles:
 * 1. Contract expiry reminders (15 and 30 days before expiry)
 * 2. Birthday greetings
 */
export async function POST(request: NextRequest) {
    return handleCronJob(request);
}

// Vercel Cron calls GET — support both methods
export async function GET(request: NextRequest) {
    return handleCronJob(request);
}

async function handleCronJob(request: NextRequest) {
    try {
        // Verify CRON secret
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const results = {
            contractExpiry: { checked: 0, notified: 0 },
            birthdays: { checked: 0, notified: 0 },
        };

        // ========== 1. CONTRACT EXPIRY REMINDERS ==========
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const in15Days = addDays(today, 15);
        const in30Days = addDays(today, 30);

        // Find contracts expiring in exactly 15 or 30 days
        const expiringContracts = await prisma.contract.findMany({
            where: {
                status: 'ACTIVE',
                endDate: {
                    in: [in15Days, in30Days],
                },
            },
            include: {
                employee: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                contractType: {
                    select: { name: true },
                },
            },
        });

        results.contractExpiry.checked = expiringContracts.length;

        for (const contract of expiringContracts) {
            if (!contract.endDate) continue;

            const daysRemaining = Math.ceil(
                (contract.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );

            const employeeName = contract.employee?.fullName || 'Nhân viên';
            const contractTypeName = contract.contractType?.name || 'Hợp đồng lao động';
            const expiryDateStr = format(contract.endDate, 'dd/MM/yyyy');

            // Notify HR team
            await notificationService.notifyHR(
                `Hợp đồng sắp hết hạn (${daysRemaining} ngày)`,
                `Hợp đồng ${contractTypeName} của ${employeeName} sẽ hết hạn vào ${expiryDateStr}.`,
                'CONTRACT_EXPIRY',
                '/admin/contracts'
            );

            results.contractExpiry.notified++;
        }

        // ========== 2. BIRTHDAY GREETINGS ==========
        const todayMonth = today.getMonth() + 1; // getMonth() returns 0-11
        const todayDay = today.getDate();

        // Find employees with birthday today
        // Using raw query because Prisma doesn't support EXTRACT on DateTime easily
        const birthdayEmployees = await prisma.employee.findMany({
            where: {
                status: 'ACTIVE',
                dob: { not: null },
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                dob: true,
                user: { select: { id: true } },
            },
        });

        // Filter in-memory for birthday match (month + day)
        const todayBirthdays = birthdayEmployees.filter(emp => {
            if (!emp.dob) return false;
            const dob = new Date(emp.dob);
            return dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDay;
        });

        results.birthdays.checked = birthdayEmployees.length;

        if (todayBirthdays.length > 0) {
            const birthdayNames = todayBirthdays.map(e => e.fullName).join(', ');

            // Notify all active employees about the birthdays
            const allUsers = await prisma.user.findMany({
                where: { status: 'ACTIVE' },
                select: { id: true },
            });

            await notificationService.notifyMany({
                userIds: allUsers.map(u => u.id),
                title: '🎂 Sinh nhật hôm nay!',
                message: `Hôm nay là sinh nhật của: ${birthdayNames}. Gửi lời chúc nhé!`,
                type: 'BIRTHDAY',
                priority: 'LOW',
            });

            results.birthdays.notified = todayBirthdays.length;
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            results,
        });
    } catch (error) {
        console.error('CRON daily-notifications error:', error);
        return NextResponse.json(
            { error: 'Lỗi hệ thống' },
            { status: 500 }
        );
    }
}
