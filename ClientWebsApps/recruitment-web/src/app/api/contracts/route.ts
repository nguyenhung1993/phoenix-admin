import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/contracts - List contracts with employee and contract type info
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');

        const where: any = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }

        const contracts = await prisma.contract.findMany({
            where,
            include: {
                employee: {
                    select: { id: true, employeeCode: true, fullName: true },
                },
                contractType: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { startDate: 'desc' },
        });

        const data = contracts.map(c => ({
            id: c.id,
            employeeId: c.employeeId,
            employeeName: c.employee.fullName,
            employeeCode: c.employee.employeeCode,
            contractType: c.contractType?.name || 'Không xác định',
            contractTypeId: c.contractTypeId,
            startDate: c.startDate,
            endDate: c.endDate,
            salary: c.salary,
            status: c.status,
            createdAt: c.createdAt,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/contracts error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
