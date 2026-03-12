import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const employee = await prisma.employee.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });

        if (!employee) {
            return NextResponse.json({ error: 'Không tìm thấy nhân viên' }, { status: 404 });
        }

        const evaluations = await prisma.evaluation.findMany({
            where: {
                employeeId: employee.id,
            },
            include: {
                reviewCycle: true, // Fix from cycle
                reviewer: {       // Fix from evaluator
                    select: { fullName: true, id: true }
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // ReviewerId == employeeId => Self Evaluation
        const selfEvaluations = evaluations.filter(e => e.reviewerId === employee.id).map(e => ({
            ...e,
            cycle: e.reviewCycle,
            template: { name: 'Mẫu đánh giá chuẩn', type: 'KPI' } // Mock since relation doesn't exist
        }));

        const managerEvaluations = evaluations.filter(e => e.reviewerId !== employee.id).map(e => ({
            ...e,
            evaluator: e.reviewer,
            cycle: e.reviewCycle,
            template: { name: 'Mẫu đánh giá quản lý', type: 'COMPETENCY' }
        }));

        return NextResponse.json({
            data: {
                self: selfEvaluations,
                manager: managerEvaluations.filter(e => e.status === 'APPROVED' || e.status === 'REVIEWED')
            }
        });
    } catch (error) {
        console.error('GET /api/portal/performance error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
