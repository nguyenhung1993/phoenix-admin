import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const components = await prisma.salaryComponent.findMany({ orderBy: { order: 'asc' } });
        return NextResponse.json(components);
    } catch (error) {
        console.error('Error fetching salary components:', error);
        return NextResponse.json({ error: 'Failed to fetch salary components' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const component = await prisma.salaryComponent.create({ data: body });
        return NextResponse.json(component);
    } catch (error) {
        console.error('Error creating salary component:', error);
        return NextResponse.json({ error: 'Failed to create salary component' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        const component = await prisma.salaryComponent.update({ where: { id }, data });
        return NextResponse.json(component);
    } catch (error) {
        console.error('Error updating salary component:', error);
        return NextResponse.json({ error: 'Failed to update salary component' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        await prisma.salaryComponent.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting salary component:', error);
        return NextResponse.json({ error: 'Failed to delete salary component' }, { status: 500 });
    }
}
