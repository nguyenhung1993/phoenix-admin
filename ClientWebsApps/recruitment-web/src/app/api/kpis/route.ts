import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const where: any = {};
        if (category && category !== 'ALL') {
            where.category = category;
        }

        const kpis = await prisma.kPI.findMany({
            where,
            include: {
                department: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const data = kpis.map((kpi) => ({
            id: kpi.id,
            code: kpi.code,
            name: kpi.name,
            description: kpi.description,
            unit: kpi.unit,
            target: kpi.target,
            weight: kpi.weight,
            category: kpi.category,
            departmentId: kpi.departmentId,
            departmentName: kpi.department?.name || 'Chung',
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/kpis error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code, name, description, unit, target, weight, category, departmentId } = body;

        const kpi = await prisma.kPI.create({
            data: {
                code,
                name,
                description,
                unit,
                target: parseFloat(target),
                weight: parseFloat(weight),
                category,
                departmentId: departmentId || null,
            },
        });

        return NextResponse.json({ data: kpi }, { status: 201 });
    } catch (error) {
        console.error('POST /api/kpis error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
