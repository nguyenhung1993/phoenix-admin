import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Personal Income Tax (PIT) report API
// Returns PIT data for all active employees for a given month/year
// Data comes from PayrollSlip if available, otherwise calculated from Contract salary

const PERSONAL_DEDUCTION = 11000000; // Giảm trừ bản thân 11 triệu
const DEPENDENT_DEDUCTION = 4400000; // Giảm trừ mỗi người phụ thuộc 4.4 triệu
const SOCIAL_INSURANCE_RATE = 0.105; // BHXH+BHYT+BHTN = 8% + 1.5% + 1% = 10.5%

function calculatePIT(taxableIncome: number): number {
    if (taxableIncome <= 0) return 0;

    // Progressive tax rates
    const brackets = [
        { limit: 5000000, rate: 0.05 },
        { limit: 10000000, rate: 0.10 },
        { limit: 18000000, rate: 0.15 },
        { limit: 32000000, rate: 0.20 },
        { limit: 52000000, rate: 0.25 },
        { limit: 80000000, rate: 0.30 },
        { limit: Infinity, rate: 0.35 },
    ];

    let remaining = taxableIncome;
    let tax = 0;

    for (const bracket of brackets) {
        const taxable = Math.min(remaining, bracket.limit);
        tax += taxable * bracket.rate;
        remaining -= taxable;
        if (remaining <= 0) break;
    }

    return Math.round(tax);
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
        const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

        // Get all active employees with payroll slips for the period
        const employees = await prisma.employee.findMany({
            where: { status: { in: ['ACTIVE', 'PROBATION'] } },
            select: {
                id: true,
                employeeCode: true,
                fullName: true,
                taxCode: true,
                payrollSlips: {
                    where: { month, year },
                    take: 1,
                },
                contracts: {
                    where: { status: 'ACTIVE' },
                    orderBy: { startDate: 'desc' },
                    take: 1,
                },
            },
            orderBy: { employeeCode: 'asc' },
        });

        const pitData = employees.map((emp) => {
            const slip = emp.payrollSlips[0];
            const contract = emp.contracts[0];

            // Use payroll slip data if available, otherwise estimate from contract
            const grossIncome = slip?.totalIncome ?? contract?.salary ?? 0;
            const socialInsurance = slip
                ? (slip.bhxh + slip.bhyt + slip.bhtn)
                : Math.round(grossIncome * SOCIAL_INSURANCE_RATE);

            // dependentDeduction = 0 for now (no dependent model yet), personal deduction included
            const dependentDeduction = 0;
            const taxableIncome = Math.max(0, grossIncome - socialInsurance - PERSONAL_DEDUCTION - dependentDeduction);
            const pitAmount = slip?.tax ?? calculatePIT(taxableIncome);

            return {
                id: emp.id,
                code: emp.employeeCode,
                name: emp.fullName,
                taxCode: emp.taxCode || '',
                grossIncome,
                socialInsurance,
                dependentDeduction,
                taxableIncome,
                pitAmount,
            };
        });

        return NextResponse.json(pitData);
    } catch (error) {
        console.error('PIT report error:', error);
        return NextResponse.json({ error: 'Failed to generate PIT report' }, { status: 500 });
    }
}
