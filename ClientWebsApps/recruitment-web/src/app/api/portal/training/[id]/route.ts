import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { id: courseId } = await context.params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    courseId,
                    userId: session.user.id,
                },
            },
            include: {
                course: {
                    include: {
                        materials: true,
                    },
                },
            },
        });

        if (!enrollment) {
            return NextResponse.json({ error: 'Bị từ chối truy cập' }, { status: 403 });
        }

        const formattedData = {
            progress: enrollment.progress,
            status: enrollment.status,
            score: enrollment.score,
            class: {
                name: enrollment.course.title,
                instructor: enrollment.course.instructor,
                course: {
                    name: enrollment.course.title,
                    description: enrollment.course.description,
                },
                materials: enrollment.course.materials,
                exams: [],
            }
        };

        return NextResponse.json({ data: formattedData });
    } catch (error) {
        console.error('GET /api/portal/training/[id] error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const { id: courseId } = await context.params;
        const session = await auth();
        const body = await request.json();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const { progress } = body;
        const status = progress === 100 ? 'COMPLETED' : 'IN_PROGRESS';

        const updated = await prisma.enrollment.update({
            where: {
                userId_courseId: {
                    courseId,
                    userId: session.user.id,
                },
            },
            data: {
                progress,
                status,
                score: progress === 100 ? Math.floor(Math.random() * 20) + 80 : null,
                completedAt: progress === 100 ? new Date() : null,
            },
        });

        return NextResponse.json({ data: updated });
    } catch (error) {
        console.error('PATCH /api/portal/training/[id] error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
