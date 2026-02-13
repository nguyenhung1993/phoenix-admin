import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/interviews - List interviews
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const candidateId = searchParams.get('candidateId');
        const jobId = searchParams.get('jobId');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const where: Record<string, unknown> = {};
        if (candidateId) where.candidateId = candidateId;
        if (jobId) where.jobId = jobId;
        if (status) where.status = status;
        if (search) {
            where.candidate = { name: { contains: search, mode: 'insensitive' } };
        }

        const interviews = await prisma.interview.findMany({
            where,
            include: {
                candidate: { select: { id: true, name: true, email: true } },
                job: { select: { id: true, title: true } },
            },
            orderBy: { scheduledAt: 'desc' },
        });

        return NextResponse.json({ data: interviews });
    } catch (error) {
        console.error('GET /api/interviews error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/interviews - Create new interview
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { candidateId, jobId, type, scheduledAt, duration, location, meetingLink, interviewers, notes } = body;

        if (!candidateId || !scheduledAt) {
            return NextResponse.json(
                { error: 'Missing required fields: candidateId, scheduledAt' },
                { status: 400 }
            );
        }

        // Get the candidate to find jobId if not provided
        let resolvedJobId = jobId;
        if (!resolvedJobId) {
            const candidate = await prisma.candidate.findUnique({
                where: { id: candidateId },
                select: { jobId: true },
            });
            resolvedJobId = candidate?.jobId;
        }

        const interview = await prisma.interview.create({
            data: {
                candidateId,
                jobId: resolvedJobId,
                type: type || 'VIDEO',
                scheduledAt: new Date(scheduledAt),
                duration: duration || 60,
                location,
                meetingLink,
                interviewers: interviewers || [],
                notes,
            },
            include: {
                candidate: { select: { id: true, name: true, email: true } },
                job: { select: { id: true, title: true } },
            },
        });

        // Update candidate status to INTERVIEW
        await prisma.candidate.update({
            where: { id: candidateId },
            data: { status: 'INTERVIEW' },
        });

        return NextResponse.json(interview, { status: 201 });
    } catch (error) {
        console.error('POST /api/interviews error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
