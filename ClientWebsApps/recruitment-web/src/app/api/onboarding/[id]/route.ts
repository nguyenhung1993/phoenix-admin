import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/onboarding/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const onboarding = await prisma.onboarding.findUnique({
            where: { id },
            include: {
                tasks: { orderBy: { dueDay: 'asc' } },
                candidate: { select: { id: true, name: true, email: true } },
            },
        });

        if (!onboarding) {
            return NextResponse.json({ error: 'Onboarding not found' }, { status: 404 });
        }

        return NextResponse.json(onboarding);
    } catch (error) {
        console.error('GET /api/onboarding/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/onboarding/[id]
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Handle Status Update
        if (body.status) {
            const onboarding = await prisma.onboarding.update({
                where: { id },
                data: { status: body.status },
            });
            return NextResponse.json(onboarding);
        }

        // Handle Task Update
        if (body.taskId && body.taskStatus) {
            await prisma.onboardingTask.update({
                where: { id: body.taskId },
                data: {
                    status: body.taskStatus,
                    completedAt: body.taskStatus === 'COMPLETED' ? new Date() : null,
                    completedBy: body.taskStatus === 'COMPLETED' ? session.user?.name || 'Admin' : null,
                },
            });

            // Update main onboarding status based on tasks
            const allTasks = await prisma.onboardingTask.findMany({ where: { onboardingId: id } });
            const allCompleted = allTasks.every(t => t.status === 'COMPLETED');
            const anyInProgress = allTasks.some(t => t.status !== 'PENDING');

            let newStatus = 'NOT_STARTED';
            if (allCompleted) newStatus = 'COMPLETED';
            else if (anyInProgress) newStatus = 'IN_PROGRESS';

            const updatedOnboarding = await prisma.onboarding.update({
                where: { id },
                data: { status: newStatus as any },
                include: { tasks: { orderBy: { dueDay: 'asc' } } },
            });

            return NextResponse.json(updatedOnboarding);
        }

        return NextResponse.json({ error: 'Invalid update data' }, { status: 400 });
    } catch (error) {
        console.error('PATCH /api/onboarding/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/onboarding/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.onboarding.delete({ where: { id } });

        return NextResponse.json({ message: 'Onboarding deleted' });
    } catch (error) {
        console.error('DELETE /api/onboarding/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
