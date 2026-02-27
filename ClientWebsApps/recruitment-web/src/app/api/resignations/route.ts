import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/resignations - List resignation requests
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');

        const where: any = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }

        const resignations = await prisma.resignationRequest.findMany({
            where,
            include: {
                employee: {
                    select: { id: true, employeeCode: true, fullName: true },
                },
                manager: {
                    select: { id: true, fullName: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const data = resignations.map(r => ({
            id: r.id,
            employeeId: r.employeeId,
            employeeName: r.employee.fullName,
            employeeCode: r.employee.employeeCode,
            managerId: r.managerId,
            managerName: r.manager.fullName,
            reason: r.reason,
            lastWorkingDate: r.lastWorkingDate,
            status: r.status,
            handoverStatus: r.handoverStatus,
            feedback: r.feedback,
            createdAt: r.createdAt,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/resignations error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/resignations - Create resignation request
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { employeeId, managerId, reason, lastWorkingDate } = body;

        if (!employeeId || !managerId || !reason || !lastWorkingDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const resignation = await prisma.resignationRequest.create({
            data: {
                employeeId,
                managerId,
                reason,
                lastWorkingDate: new Date(lastWorkingDate),
            },
            include: {
                employee: { select: { fullName: true } },
                manager: { select: { fullName: true } },
            },
        });

        return NextResponse.json(resignation, { status: 201 });
    } catch (error) {
        console.error('POST /api/resignations error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/resignations - Approve/Reject resignation
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, feedback } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: id, status' },
                { status: 400 }
            );
        }

        const resignation = await prisma.resignationRequest.update({
            where: { id },
            data: {
                status,
                feedback: feedback || null,
            },
        });

        return NextResponse.json(resignation);
    } catch (error) {
        console.error('PATCH /api/resignations error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
