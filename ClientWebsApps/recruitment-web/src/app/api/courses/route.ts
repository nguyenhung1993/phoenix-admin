import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const where: any = {};
        if (category && category !== 'ALL') {
            where.category = { name: category };
        }

        const courses = await prisma.course.findMany({
            where,
            include: {
                category: { select: { id: true, name: true } },
                _count: {
                    select: { classes: true, materials: true, enrollments: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const data = courses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail || '/images/course-placeholder.jpg',
            instructor: course.instructor,
            duration: course.duration,
            totalModules: course.totalModules,
            totalLessons: course.totalLessons,
            category: course.category?.name || 'Chưa phân loại',
            level: course.level,
            students: course.students,
            rating: course.rating,
            status: course.status,
            modules: course.modules || [],
            createdAt: course.createdAt.toISOString(),
            updatedAt: course.updatedAt.toISOString(),
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/courses error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description, instructor, duration, categoryId, level, modules } = body;

        const course = await prisma.course.create({
            data: {
                title,
                description,
                instructor,
                duration,
                categoryId: categoryId || null,
                level: level || 'BEGINNER',
                status: 'DRAFT',
                modules: modules || [],
                totalModules: modules?.length || 0,
                totalLessons: modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0,
            },
        });

        return NextResponse.json({ data: course }, { status: 201 });
    } catch (error) {
        console.error('POST /api/courses error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
