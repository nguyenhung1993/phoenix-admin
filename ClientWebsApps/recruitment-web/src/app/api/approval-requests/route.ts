import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const where: any = {};
        if (status && status !== 'ALL') where.status = status;

        const requests = await prisma.approvalRequest.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ data: requests });
    } catch (error) {
        console.error('GET /api/approval-requests error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        const updated = await prisma.approvalRequest.update({ where: { id }, data });
        return NextResponse.json({ data: updated });
    } catch (error) {
        console.error('PATCH /api/approval-requests error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
