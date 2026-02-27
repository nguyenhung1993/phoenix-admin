import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const where: any = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }

        const cycles = await prisma.reviewCycle.findMany({
            where,
            include: {
                _count: {
                    select: { evaluations: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const data = cycles.map((cycle) => ({
            id: cycle.id,
            name: cycle.name,
            startDate: cycle.startDate.toISOString(),
            endDate: cycle.endDate.toISOString(),
            status: cycle.status,
            type: cycle.type,
            participants: cycle.participants || cycle._count.evaluations,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/reviews error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, startDate, endDate, type } = body;

        const cycle = await prisma.reviewCycle.create({
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                type,
                status: 'PLANNING',
            },
        });

        return NextResponse.json({ data: cycle }, { status: 201 });
    } catch (error) {
        console.error('POST /api/reviews error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
