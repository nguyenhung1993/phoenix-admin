import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const types = await prisma.contractType.findMany({ orderBy: { createdAt: 'asc' } });
        return NextResponse.json(types);
    } catch (error) {
        console.error('Error fetching contract types:', error);
        return NextResponse.json({ error: 'Lỗi tải contract types' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const type = await prisma.contractType.create({ data: body });
        return NextResponse.json(type);
    } catch (error) {
        console.error('Error creating contract type:', error);
        return NextResponse.json({ error: 'Lỗi tạo contract type' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        const type = await prisma.contractType.update({ where: { id }, data });
        return NextResponse.json(type);
    } catch (error) {
        console.error('Error updating contract type:', error);
        return NextResponse.json({ error: 'Lỗi cập nhật contract type' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
        await prisma.contractType.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting contract type:', error);
        return NextResponse.json({ error: 'Lỗi xóa contract type' }, { status: 500 });
    }
}
