import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const session = await auth();
        const body = await request.json();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const employee = await prisma.employee.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });

        if (!employee) return NextResponse.json({ error: 'Không tìm thấy nhân viên' }, { status: 404 });

        const evaluation = await prisma.evaluation.findUnique({
            where: { id },
            select: { reviewerId: true, employeeId: true, status: true },
        });

        if (!evaluation || evaluation.reviewerId !== employee.id || evaluation.employeeId !== employee.id) {
            return NextResponse.json({ error: 'Forbidden. You can only update your own self-evaluations.' }, { status: 403 });
        }

        if (evaluation.status !== 'DRAFT') {
            return NextResponse.json({ error: 'Không thể chỉnh sửa đánh giá đã nộp.' }, { status: 400 });
        }

        const { status, finalScore } = body;

        const updated = await prisma.evaluation.update({
            where: { id },
            data: {
                status: status || 'SUBMITTED',
                selfScore: finalScore,
                finalScore: finalScore,
                submittedAt: new Date(),
            },
            include: {
                reviewCycle: true,
            }
        });

        return NextResponse.json({ data: updated });
    } catch (error) {
        console.error('PATCH /api/portal/performance/[id] error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
