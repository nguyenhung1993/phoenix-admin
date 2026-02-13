import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/departments - List departments (supports tree structure)
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const tree = searchParams.get('tree') === 'true';

        const departments = await prisma.department.findMany({
            include: {
                _count: { select: { employees: true } },
            },
            orderBy: { name: 'asc' },
        });

        if (tree) {
            // Build tree structure
            type DeptItem = typeof departments[number];
            type DeptNode = DeptItem & { children: DeptItem[] };
            const deptMap = new Map<string, DeptNode>(
                departments.map((d: DeptItem) => [d.id, { ...d, children: [] }])
            );
            const roots: DeptNode[] = [];

            departments.forEach((dept: DeptItem) => {
                const node = deptMap.get(dept.id)!;
                if (dept.parentId && deptMap.has(dept.parentId)) {
                    deptMap.get(dept.parentId)!.children.push(node);
                } else {
                    roots.push(node);
                }
            });

            return NextResponse.json({ data: roots });
        }

        return NextResponse.json({ data: departments });
    } catch (error) {
        console.error('GET /api/departments error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/departments - Create new department
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { code, name, parentId, managerId } = body;

        if (!code || !name) {
            return NextResponse.json(
                { error: 'Missing required fields: code, name' },
                { status: 400 }
            );
        }

        const department = await prisma.department.create({
            data: { code, name, parentId, managerId },
        });

        return NextResponse.json(department, { status: 201 });
    } catch (error) {
        console.error('POST /api/departments error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
