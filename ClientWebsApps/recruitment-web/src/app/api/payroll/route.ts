import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/payroll - List payroll slips by month/year
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
        const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

        const slips = await prisma.payrollSlip.findMany({
            where: { month, year },
            include: {
                employee: {
                    select: { id: true, employeeCode: true, fullName: true, departmentId: true },
                },
            },
            orderBy: { employee: { fullName: 'asc' } },
        });

        const data = slips.map(s => ({
            id: s.id,
            employeeId: s.employeeId,
            employeeName: s.employee.fullName,
            employeeCode: s.employee.employeeCode,
            month: s.month,
            year: s.year,
            standardWorkDays: s.standardWorkDays,
            actualWorkDays: s.actualWorkDays,
            baseSalary: s.baseSalary,
            salaryByWorkDays: s.salaryByWorkDays,
            overtimeHours: s.overtimeHours,
            overtimePay: s.overtimePay,
            allowances: s.allowances,
            bonus: s.bonus,
            totalIncome: s.totalIncome,
            bhxh: s.bhxh,
            bhyt: s.bhyt,
            bhtn: s.bhtn,
            tax: s.tax,
            totalDeductions: s.totalDeductions,
            netSalary: s.netSalary,
            status: s.status,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/payroll error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
