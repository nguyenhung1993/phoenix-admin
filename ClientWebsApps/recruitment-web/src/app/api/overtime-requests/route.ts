import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/overtime-requests - List overtime requests
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');

        const where: any = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }

        const requests = await prisma.overtimeRequest.findMany({
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
            date: r.date,
            startTime: r.startTime,
            endTime: r.endTime,
            hours: r.hours,
            reason: r.reason,
            status: r.status,
            approverId: r.approverId,
            approverName: r.approverName,
            createdAt: r.createdAt,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/overtime-requests error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/overtime-requests - Approve/Reject
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, approverName } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: id, status' },
                { status: 400 }
            );
        }

        const updated = await prisma.overtimeRequest.update({
            where: { id },
            data: {
                status,
                approverName: approverName || null,
                approvedAt: ['APPROVED', 'REJECTED'].includes(status) ? new Date() : undefined,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('PATCH /api/overtime-requests error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
