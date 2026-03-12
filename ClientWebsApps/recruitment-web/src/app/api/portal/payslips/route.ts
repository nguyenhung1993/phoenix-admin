import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const employee = await prisma.employee.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });

        if (!employee) {
            return NextResponse.json({ error: 'Không tìm thấy hồ sơ nhân viên cho người dùng này' }, { status: 404 });
        }

        const payslips = await prisma.payrollSlip.findMany({
            where: {
                employeeId: employee.id,
                status: 'PAID', // Employees only see paid/confirmed payslips
            },
            orderBy: [
                { year: 'desc' },
                { month: 'desc' },
            ],
            take: 24, // Last 2 years max
        });

        return NextResponse.json({ data: payslips });
    } catch (error) {
        console.error('GET /api/portal/payslips error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
