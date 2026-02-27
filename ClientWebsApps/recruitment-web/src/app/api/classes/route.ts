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

        const classes = await prisma.trainingClass.findMany({
            where,
            include: {
                course: {
                    select: { id: true, title: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const data = classes.map((cls) => ({
            id: cls.id,
            courseId: cls.courseId,
            courseName: cls.course.title,
            code: cls.code,
            startDate: cls.startDate.toISOString(),
            endDate: cls.endDate.toISOString(),
            instructor: cls.instructor,
            capacity: cls.capacity,
            enrolled: cls.enrolled,
            status: cls.status,
            location: cls.location,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/classes error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { courseId, code, startDate, endDate, instructor, capacity, location } = body;

        const cls = await prisma.trainingClass.create({
            data: {
                courseId,
                code: code || `CLS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                instructor,
                capacity: capacity || 30,
                location,
                status: 'UPCOMING',
            },
        });

        return NextResponse.json({ data: cls }, { status: 201 });
    } catch (error) {
        console.error('POST /api/classes error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
