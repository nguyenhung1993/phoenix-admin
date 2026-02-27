import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const where: any = {};
        if (userId) where.userId = userId;

        const enrollments = await prisma.enrollment.findMany({
            where,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        category: { select: { name: true } },
                        instructor: true,
                        duration: true,
                        totalLessons: true,
                        totalModules: true,
                        modules: true,
                        level: true,
                    },
                },
            },
            orderBy: { enrolledAt: 'desc' },
        });

        const data = enrollments.map((enr) => ({
            id: enr.id,
            userId: enr.userId,
            userName: enr.userName,
            courseId: enr.courseId,
            courseName: enr.courseName || enr.course.title,
            courseTitle: enr.course.title,
            courseThumbnail: enr.course.thumbnail || '/images/course-placeholder.jpg',
            courseCategory: enr.course.category?.name || '',
            courseInstructor: enr.course.instructor,
            courseDuration: enr.course.duration,
            courseTotalLessons: enr.course.totalLessons,
            courseModules: enr.course.modules,
            courseLevel: enr.course.level,
            enrolledAt: enr.enrolledAt.toISOString(),
            completedAt: enr.completedAt?.toISOString() || null,
            progress: enr.progress,
            score: enr.score,
            status: enr.status,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/enrollments error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
