import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/candidates - List candidates with optional filters
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const jobId = searchParams.get('jobId');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const source = searchParams.get('source');
        const rating = searchParams.get('rating');
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const sortBy = searchParams.get('sortBy') || 'appliedDate';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const where: Record<string, unknown> = {};

        if (jobId) where.jobId = jobId;
        if (status) where.status = status;
        if (source) where.source = source;
        if (rating) where.rating = { gte: parseInt(rating) };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (dateFrom || dateTo) {
            const dateFilter: Record<string, Date> = {};
            if (dateFrom) dateFilter.gte = new Date(dateFrom);
            if (dateTo) dateFilter.lte = new Date(dateTo + 'T23:59:59.999Z');
            where.appliedDate = dateFilter;
        }

        // Build orderBy
        const validSortFields = ['appliedDate', 'name', 'rating', 'status'];
        const orderField = validSortFields.includes(sortBy) ? sortBy : 'appliedDate';
        const orderDirection = sortOrder === 'asc' ? 'asc' : 'desc';

        const [candidates, total] = await Promise.all([
            prisma.candidate.findMany({
                where,
                include: {
                    job: { select: { id: true, title: true } },
                    _count: { select: { activities: true, interviews: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [orderField]: orderDirection },
            }),
            prisma.candidate.count({ where }),
        ]);

        return NextResponse.json({
            data: candidates,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('GET /api/candidates error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/candidates - Create new candidate (also used by public careers apply)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, jobId, cvUrl, source, notes } = body;

        if (!name || !email || !jobId) {
            return NextResponse.json(
                { error: 'Missing required fields: name, email, jobId' },
                { status: 400 }
            );
        }

        // Verify job exists and is published
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            select: { id: true, status: true },
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const candidate = await prisma.candidate.create({
            data: {
                name,
                email,
                phone,
                jobId,
                cvUrl,
                source: source || 'WEBSITE',
                notes,
            },
            include: {
                job: { select: { id: true, title: true } },
            },
        });

        // Increment job applicants count
        await prisma.job.update({
            where: { id: jobId },
            data: { applicants: { increment: 1 } },
        });

        return NextResponse.json(candidate, { status: 201 });
    } catch (error) {
        console.error('POST /api/candidates error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
