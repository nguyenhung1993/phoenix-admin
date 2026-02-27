import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.courseCategory.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { courses: true } } },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching course categories:', error);
        return NextResponse.json({ error: 'Failed to fetch course categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const category = await prisma.courseCategory.create({ data: body });
        return NextResponse.json(category);
    } catch (error) {
        console.error('Error creating course category:', error);
        return NextResponse.json({ error: 'Failed to create course category' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        const category = await prisma.courseCategory.update({ where: { id }, data });
        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating course category:', error);
        return NextResponse.json({ error: 'Failed to update course category' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        await prisma.courseCategory.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting course category:', error);
        return NextResponse.json({ error: 'Failed to delete course category' }, { status: 500 });
    }
}
