import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const events = await prisma.workplaceEvent.findMany({
            orderBy: { date: 'asc' },
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching workplace events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}
