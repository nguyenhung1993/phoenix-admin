import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');

        const where: any = {};
        if (courseId && courseId !== 'ALL') {
            where.courseId = courseId;
        }

        const materials = await prisma.material.findMany({
            where,
            include: {
                course: {
                    select: { id: true, title: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const data = materials.map((mat) => ({
            id: mat.id,
            title: mat.title,
            courseId: mat.courseId,
            courseName: mat.course.title,
            type: mat.type,
            url: mat.url,
            size: mat.size,
            createdAt: mat.createdAt.toISOString(),
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/materials error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        await prisma.material.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/materials error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
