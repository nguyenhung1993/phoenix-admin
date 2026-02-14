import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { getInterviewEmailTemplate } from '@/lib/templates';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

        // Update candidate status
        await prisma.candidate.update({
            where: { id: candidateId },
            data: { status: 'INTERVIEW' },
        });

        // Send Interview Invitation Email
        if (interview.candidate.email) {
            const formattedDate = format(new Date(interview.scheduledAt), 'HH:mm dd/MM/yyyy', { locale: vi });
            const emailHtml = getInterviewEmailTemplate(
                interview.candidate.name,
                interview.job.title,
                formattedDate,
                interview.type,
                interview.location,
                interview.meetingLink
            );

            // Non-blocking email sending
            sendEmail(interview.candidate.email, `Phỏng vấn chuyên môn - ${interview.job.title}`, emailHtml).catch(err => console.error('Failed to send interview email:', err));
        }

        return NextResponse.json(interview, { status: 201 });
    } catch (error) {
        console.error('POST /api/interviews error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
