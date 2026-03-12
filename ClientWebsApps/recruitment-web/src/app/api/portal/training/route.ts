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

        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                course: true,
            },
            orderBy: {
                enrolledAt: 'desc',
            },
        });

        const data = enrollments.map(e => ({
            id: e.id,
            classId: e.courseId, // Used as ID for frontend routing
            courseId: e.courseId,
            courseName: e.course.title,
            courseLevel: e.course.level,
            thumbnail: e.course.thumbnail,
            className: e.course.title,
            instructor: e.course.instructor,
            startDate: e.enrolledAt.toISOString(),
            endDate: e.completedAt?.toISOString() || new Date().toISOString(),
            status: e.status,
            progress: e.progress,
            score: e.score,
            enrolledAt: e.enrolledAt,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/portal/training error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
