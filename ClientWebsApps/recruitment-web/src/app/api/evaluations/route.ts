import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const reviewCycleId = searchParams.get('reviewCycleId');
        const status = searchParams.get('status');

        const where: any = {};
        if (reviewCycleId) where.reviewCycleId = reviewCycleId;
        if (status && status !== 'ALL') where.status = status;

        const evaluations = await prisma.evaluation.findMany({
            where,
            include: {
                employee: {
                    select: { id: true, employeeCode: true, fullName: true, departmentId: true },
                },
                reviewer: {
                    select: { id: true, fullName: true },
                },
                reviewCycle: {
                    select: { id: true, name: true, startDate: true, endDate: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Get department names
        const deptIds = [...new Set(evaluations.map(e => e.employee.departmentId).filter(Boolean))];
        const departments = await prisma.department.findMany({
            where: { id: { in: deptIds as string[] } },
            select: { id: true, name: true },
        });
        const deptMap = new Map(departments.map(d => [d.id, d.name]));

        const data = evaluations.map((ev) => ({
            id: ev.id,
            reviewCycleId: ev.reviewCycleId,
            reviewCycleName: ev.reviewCycle.name,
            employeeId: ev.employee.id,
            employeeCode: ev.employee.employeeCode,
            employeeName: ev.employee.fullName,
            departmentName: deptMap.get(ev.employee.departmentId || '') || '',
            reviewerName: ev.reviewer?.fullName || null,
            status: ev.status,
            selfScore: ev.selfScore,
            managerScore: ev.managerScore,
            finalScore: ev.finalScore,
            kpiResults: ev.kpiResults,
            strengths: ev.strengths,
            weaknesses: ev.weaknesses,
            developmentPlan: ev.developmentPlan,
            submittedAt: ev.submittedAt?.toISOString() || null,
            reviewedAt: ev.reviewedAt?.toISOString() || null,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/evaluations error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { reviewCycleId, employeeId, reviewerId, kpiResults, strengths, weaknesses, developmentPlan } = body;

        const evaluation = await prisma.evaluation.create({
            data: {
                reviewCycleId,
                employeeId,
                reviewerId: reviewerId || null,
                status: 'DRAFT',
                kpiResults: kpiResults || null,
                strengths,
                weaknesses,
                developmentPlan,
            },
        });

        return NextResponse.json({ data: evaluation }, { status: 201 });
    } catch (error) {
        console.error('POST /api/evaluations error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status, selfScore, managerScore, finalScore, kpiResults, strengths, weaknesses, developmentPlan } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing evaluation id' }, { status: 400 });
        }

        const data: any = {};
        if (status) data.status = status;
        if (selfScore !== undefined) data.selfScore = selfScore;
        if (managerScore !== undefined) data.managerScore = managerScore;
        if (finalScore !== undefined) data.finalScore = finalScore;
        if (kpiResults) data.kpiResults = kpiResults;
        if (strengths !== undefined) data.strengths = strengths;
        if (weaknesses !== undefined) data.weaknesses = weaknesses;
        if (developmentPlan !== undefined) data.developmentPlan = developmentPlan;

        if (status === 'SUBMITTED') data.submittedAt = new Date();
        if (status === 'REVIEWED' || status === 'APPROVED') data.reviewedAt = new Date();

        const updated = await prisma.evaluation.update({
            where: { id },
            data,
        });

        return NextResponse.json({ data: updated });
    } catch (error) {
        console.error('PATCH /api/evaluations error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
