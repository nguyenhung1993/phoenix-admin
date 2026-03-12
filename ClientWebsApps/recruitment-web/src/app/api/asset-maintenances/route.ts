import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const assetId = searchParams.get('assetId');

        const where: any = {};
        if (assetId) where.assetId = assetId;

        const maintenances = await prisma.assetMaintenance.findMany({
            where,
            include: { asset: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ data: maintenances });
    } catch (error) {
        console.error('GET /api/asset-maintenances error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Use a transaction to ensure both operations succeed or fail together
        const [maintenance, asset] = await prisma.$transaction([
            prisma.assetMaintenance.create({ data: body }),
            prisma.asset.update({
                where: { id: body.assetId },
                data: { status: 'MAINTENANCE' }
            })
        ]);

        return NextResponse.json({ data: maintenance }, { status: 201 });
    } catch (error) {
        console.error('POST /api/asset-maintenances error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
