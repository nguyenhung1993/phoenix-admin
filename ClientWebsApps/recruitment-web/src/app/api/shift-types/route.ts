import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const shifts = await prisma.shiftType.findMany({ orderBy: { createdAt: 'asc' } });
        return NextResponse.json(shifts);
    } catch (error) {
        console.error('Error fetching shift types:', error);
        return NextResponse.json({ error: 'Failed to fetch shift types' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const shift = await prisma.shiftType.create({ data: body });
        return NextResponse.json(shift);
    } catch (error) {
        console.error('Error creating shift type:', error);
        return NextResponse.json({ error: 'Failed to create shift type' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        const shift = await prisma.shiftType.update({ where: { id }, data });
        return NextResponse.json(shift);
    } catch (error) {
        console.error('Error updating shift type:', error);
        return NextResponse.json({ error: 'Failed to update shift type' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        await prisma.shiftType.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting shift type:', error);
        return NextResponse.json({ error: 'Failed to delete shift type' }, { status: 500 });
    }
}
