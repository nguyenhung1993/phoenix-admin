import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/offers - List offers
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const where: Record<string, unknown> = {};
        if (status) where.status = status;
        if (search) {
            where.candidate = { name: { contains: search, mode: 'insensitive' } };
        }

        const offers = await prisma.offer.findMany({
            where,
            include: {
                candidate: { select: { id: true, name: true, email: true } },
                job: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ data: offers });
    } catch (error) {
        console.error('GET /api/offers error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/offers - Create new offer
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { candidateId, jobId, salaryBase, salaryBonus, salaryAllowance, startDate, expiryDate, benefits, notes } = body;

        if (!candidateId || !salaryBase || !startDate || !expiryDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get candidate's jobId if not provided
        let resolvedJobId = jobId;
        if (!resolvedJobId) {
            const candidate = await prisma.candidate.findUnique({
                where: { id: candidateId },
                select: { jobId: true },
            });
            resolvedJobId = candidate?.jobId;
        }

        const offer = await prisma.offer.create({
            data: {
                candidateId,
                jobId: resolvedJobId,
                salaryBase,
                salaryBonus,
                salaryAllowance,
                startDate: new Date(startDate),
                expiryDate: new Date(expiryDate),
                benefits: benefits || [],
                notes,
            },
            include: {
                candidate: { select: { id: true, name: true, email: true } },
                job: { select: { id: true, title: true } },
            },
        });

        // Update candidate status to OFFER
        await prisma.candidate.update({
            where: { id: candidateId },
            data: { status: 'OFFER' },
        });

        return NextResponse.json(offer, { status: 201 });
    } catch (error) {
        console.error('POST /api/offers error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
