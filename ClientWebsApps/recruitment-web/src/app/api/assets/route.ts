import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const companyId = searchParams.get('companyId');
        const departmentId = searchParams.get('departmentId');

        const where: any = {};
        if (type && type !== 'ALL') where.type = type;
        if (status && status !== 'ALL') where.status = status;
        if (companyId && companyId !== 'ALL') where.companyId = companyId;
        if (departmentId && departmentId !== 'ALL') where.departmentId = departmentId;

        const assets = await prisma.asset.findMany({
            where,
            include: {
                company: { select: { name: true } },
                department: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ data: assets });
    } catch (error) {
        console.error('GET /api/assets error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (Array.isArray(body)) {
            const assets = await prisma.asset.createMany({ data: body });
            return NextResponse.json({ data: assets }, { status: 201 });
        }

        const asset = await prisma.asset.create({ data: body });

        // Auto create allocation record if a holder is assigned
        if (body.holderId && body.holderId !== 'none') {
            await prisma.assetAllocation.create({
                data: {
                    assetId: asset.id,
                    employeeId: body.holderId,
                    allocatedDate: body.assignedDate ? new Date(body.assignedDate) : new Date(),
                    status: 'ALLOCATED'
                }
            });
        }

        return NextResponse.json({ data: asset }, { status: 201 });
    } catch (error) {
        console.error('POST /api/assets error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });

        const currentAsset = await prisma.asset.findUnique({ where: { id } });

        const asset = await prisma.asset.update({ where: { id }, data });

        // Tracker asset allocation when holderId changes
        if (data.holderId !== undefined && currentAsset && currentAsset.holderId !== data.holderId) {
            // Un-assign previous holder if it exists
            if (currentAsset.holderId) {
                await prisma.assetAllocation.updateMany({
                    where: { assetId: id, employeeId: currentAsset.holderId, status: 'ALLOCATED' },
                    data: { status: 'RETURNED', returnedDate: new Date() }
                });
            }

            // Assign new holder if explicitly set
            if (data.holderId && data.holderId !== 'none') {
                await prisma.assetAllocation.create({
                    data: {
                        assetId: id,
                        employeeId: data.holderId,
                        allocatedDate: data.assignedDate ? new Date(data.assignedDate) : new Date(),
                        status: 'ALLOCATED'
                    }
                });
            }
        }

        return NextResponse.json({ data: asset });
    } catch (error) {
        console.error('PATCH /api/assets error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });

        await prisma.asset.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/assets error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
