import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/leave-requests - List leave requests with balances
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const includeBalances = searchParams.get('balances') === 'true';

        const where: any = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }

        const requests = await prisma.leaveRequest.findMany({
            where,
            include: {
                employee: {
                    select: { id: true, employeeCode: true, fullName: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const data = requests.map(r => ({
            id: r.id,
            employeeId: r.employeeId,
            employeeName: r.employee.fullName,
            employeeCode: r.employee.employeeCode,
            leaveType: r.leaveType,
            startDate: r.startDate,
            endDate: r.endDate,
            totalDays: r.totalDays,
            reason: r.reason,
            status: r.status,
            approverId: r.approverId,
            approverName: r.approverName,
            rejectionReason: r.rejectionReason,
            createdAt: r.createdAt,
        }));

        let balances: any[] = [];
        if (includeBalances) {
            const year = new Date().getFullYear();
            const balanceRecords = await prisma.leaveBalance.findMany({
                where: { year },
                include: {
                    employee: { select: { fullName: true } },
                },
            });
            balances = balanceRecords.map(b => ({
                employeeId: b.employeeId,
                employeeName: b.employee.fullName,
                annualTotal: b.annualTotal,
                annualUsed: b.annualUsed,
                annualRemaining: b.annualRemaining,
                sickTotal: b.sickTotal,
                sickUsed: b.sickUsed,
            }));
        }

        return NextResponse.json({ data, balances });
    } catch (error) {
        console.error('GET /api/leave-requests error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/leave-requests - Approve/Reject
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, rejectionReason, approverName } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: id, status' },
                { status: 400 }
            );
        }

        const updated = await prisma.leaveRequest.update({
            where: { id },
            data: {
                status,
                rejectionReason: rejectionReason || null,
                approverName: approverName || null,
                approvedAt: ['APPROVED', 'REJECTED'].includes(status) ? new Date() : undefined,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('PATCH /api/leave-requests error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
