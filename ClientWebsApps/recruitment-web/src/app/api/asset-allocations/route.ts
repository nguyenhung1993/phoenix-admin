import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const assetId = searchParams.get('assetId');

        const where: any = {};
        if (assetId) where.assetId = assetId;

        const allocations = await prisma.assetAllocation.findMany({
            where,
            include: { employee: true, asset: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ data: allocations });
    } catch (error) {
        console.error('GET /api/asset-allocations error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const allocation = await prisma.assetAllocation.create({ data: body });

        if (body.status === 'ALLOCATED') {
            const employee = await prisma.employee.findUnique({ where: { id: body.employeeId } });
            await prisma.asset.update({
                where: { id: body.assetId },
                data: { status: 'IN_USE', holderId: body.employeeId, holderName: employee?.fullName, assignedDate: new Date() }
            });
        }
        return NextResponse.json({ data: allocation }, { status: 201 });
    } catch (error) {
        console.error('POST /api/asset-allocations error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });

        const allocation = await prisma.assetAllocation.update({ where: { id }, data });

        if (data.status === 'RETURNED') {
            await prisma.asset.update({
                where: { id: allocation.assetId },
                data: { status: 'AVAILABLE', holderId: null, holderName: null, assignedDate: null }
            });
        }

        return NextResponse.json({ data: allocation });
    } catch (error) {
        console.error('PATCH /api/asset-allocations error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
