import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const templates = await prisma.evaluationTemplate.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const data = templates.map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            type: t.type,
            status: t.status,
            sections: t.sections || [],
            createdAt: t.createdAt.toISOString(),
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/evaluation-templates error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
