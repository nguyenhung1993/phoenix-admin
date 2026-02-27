import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const workflows = await prisma.approvalWorkflow.findMany({ orderBy: { createdAt: 'asc' } });
        return NextResponse.json(workflows);
    } catch (error) {
        console.error('Error fetching approval workflows:', error);
        return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const workflow = await prisma.approvalWorkflow.create({ data: body });
        return NextResponse.json(workflow);
    } catch (error) {
        console.error('Error creating approval workflow:', error);
        return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        const workflow = await prisma.approvalWorkflow.update({ where: { id }, data });
        return NextResponse.json(workflow);
    } catch (error) {
        console.error('Error updating approval workflow:', error);
        return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        await prisma.approvalWorkflow.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting approval workflow:', error);
        return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
    }
}
