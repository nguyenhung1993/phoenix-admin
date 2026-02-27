import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const holidays = await prisma.publicHoliday.findMany({ orderBy: { date: 'asc' } });
        return NextResponse.json(holidays);
    } catch (error) {
        console.error('Error fetching holidays:', error);
        return NextResponse.json({ error: 'Failed to fetch holidays' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const holiday = await prisma.publicHoliday.create({ data: body });
        return NextResponse.json(holiday);
    } catch (error) {
        console.error('Error creating holiday:', error);
        return NextResponse.json({ error: 'Failed to create holiday' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        const holiday = await prisma.publicHoliday.update({ where: { id }, data });
        return NextResponse.json(holiday);
    } catch (error) {
        console.error('Error updating holiday:', error);
        return NextResponse.json({ error: 'Failed to update holiday' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        await prisma.publicHoliday.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting holiday:', error);
        return NextResponse.json({ error: 'Failed to delete holiday' }, { status: 500 });
    }
}
