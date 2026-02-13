import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/jobs - List jobs with optional filters
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        // Allow public access for careers page
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const isPublic = searchParams.get('public') === 'true';

        const where: Record<string, unknown> = {};

        // Public requests only see PUBLISHED jobs
        if (isPublic || !session) {
            where.status = 'PUBLISHED';
        } else if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                include: {
                    department: { select: { id: true, name: true } },
                    _count: { select: { candidates: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.job.count({ where }),
        ]);

        return NextResponse.json({
            data: jobs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('GET /api/jobs error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/jobs - Create new job
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title, slug, departmentId, location, type, experienceLevel,
            salaryMin, salaryMax, description, requirements, benefits, status: jobStatus,
        } = body;

        if (!title || !slug) {
            return NextResponse.json(
                { error: 'Missing required fields: title, slug' },
                { status: 400 }
            );
        }

        const job = await prisma.job.create({
            data: {
                title,
                slug,
                departmentId,
                location,
                type: type || 'FULL_TIME',
                experienceLevel,
                salaryMin,
                salaryMax,
                description,
                requirements: requirements || [],
                benefits: benefits || [],
                status: jobStatus || 'DRAFT',
            },
            include: {
                department: { select: { id: true, name: true } },
            },
        });

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        console.error('POST /api/jobs error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
