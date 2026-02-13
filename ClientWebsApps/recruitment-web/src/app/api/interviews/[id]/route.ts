import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/interviews/:id
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const interview = await prisma.interview.findUnique({
            where: { id },
            include: {
                candidate: { select: { id: true, name: true, email: true, phone: true } },
                job: { select: { id: true, title: true } },
            },
        });

        if (!interview) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }

        return NextResponse.json(interview);
    } catch (error) {
        console.error('GET /api/interviews/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/interviews/:id
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const interview = await prisma.interview.update({
            where: { id },
            data: {
                ...(body.type && { type: body.type }),
                ...(body.status && { status: body.status }),
                ...(body.scheduledAt && { scheduledAt: new Date(body.scheduledAt) }),
                ...(body.duration && { duration: body.duration }),
                ...(body.location !== undefined && { location: body.location }),
                ...(body.meetingLink !== undefined && { meetingLink: body.meetingLink }),
                ...(body.interviewers !== undefined && { interviewers: body.interviewers }),
                ...(body.notes !== undefined && { notes: body.notes }),
                ...(body.feedback !== undefined && { feedback: body.feedback }),
            },
            include: {
                candidate: { select: { id: true, name: true, email: true } },
                job: { select: { id: true, title: true } },
            },
        });

        return NextResponse.json(interview);
    } catch (error) {
        console.error('PATCH /api/interviews/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/interviews/:id
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.interview.delete({ where: { id } });

        return NextResponse.json({ message: 'Interview deleted' });
    } catch (error) {
        console.error('DELETE /api/interviews/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
