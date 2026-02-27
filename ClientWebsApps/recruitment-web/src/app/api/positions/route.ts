import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/positions - List positions with employee count
export async function GET() {
    try {
        const positions = await prisma.position.findMany({
            include: {
                _count: { select: { employees: true } },
                department: { select: { id: true, name: true } },
            },
            orderBy: { name: 'asc' },
        });

        const data = positions.map(p => ({
            ...p,
            employeeCount: p._count.employees,
            departmentName: p.department?.name || null,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/positions error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/positions - Create new position
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, name, level, minSalary, maxSalary, departmentId } = body;

        if (!code || !name || !level) {
            return NextResponse.json(
                { error: 'Missing required fields: code, name, level' },
                { status: 400 }
            );
        }

        const position = await prisma.position.create({
            data: {
                code,
                name,
                level,
                minSalary: minSalary || 0,
                maxSalary: maxSalary || 0,
                departmentId: departmentId || null,
            },
        });

        return NextResponse.json(position, { status: 201 });
    } catch (error) {
        console.error('POST /api/positions error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
