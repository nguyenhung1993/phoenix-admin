import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/public/jobs/[slug]
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;

        const job = await prisma.job.findUnique({
            where: { slug },
            include: {
                department: { select: { name: true } },
            },
        });

        if (!job || job.status !== 'PUBLISHED') {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const formattedJob = {
            ...job,
            department: job.department?.name || 'N/A',
            salary: { min: job.salaryMin, max: job.salaryMax }
        };

        return NextResponse.json(formattedJob);
    } catch (error) {
        console.error('GET /api/public/jobs/[slug] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
