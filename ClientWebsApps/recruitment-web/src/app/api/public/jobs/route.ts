import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/public/jobs
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search');
        const department = searchParams.get('department');
        const location = searchParams.get('location');
        const type = searchParams.get('type');
        const workMode = searchParams.get('workMode');

        const where: Record<string, unknown> = {
            status: 'PUBLISHED',
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (department && department !== 'Tất cả') {
            where.department = { name: department };
        }

        if (location && location !== 'Tất cả') {
            where.location = location;
        }

        // Use precise enum mapping checking if needed, but Prisma usually handles string-to-enum if valid
        if (type && type !== 'ALL') {
            where.type = type;
        }

        if (workMode && workMode !== 'ALL') {
            where.workMode = workMode;
        }

        const jobs = await prisma.job.findMany({
            where,
            select: {
                id: true,
                slug: true,
                title: true,
                department: { select: { name: true } },
                location: true,
                type: true,
                workMode: true,
                salaryMin: true,
                salaryMax: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Explicit mapping to avoid type conflicts
        const formattedJobs = jobs.map(job => ({
            id: job.id,
            slug: job.slug,
            title: job.title,
            department: job.department?.name || 'Unknown',
            location: job.location || '',
            type: job.type,
            workMode: job.workMode,
            salary: {
                min: job.salaryMin,
                max: job.salaryMax
            },
            createdAt: job.createdAt,
        }));

        return NextResponse.json({ data: formattedJobs });
    } catch (error) {
        console.error('GET /api/public/jobs error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
