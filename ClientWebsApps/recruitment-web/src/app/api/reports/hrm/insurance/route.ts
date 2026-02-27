import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Insurance report API (BHXH, BHYT, BHTN)
// Returns insurance contribution data for active employees

// Default rates (Vietnamese law)
const RATES = {
    BHXH: { employee: 0.08, company: 0.175 },
    BHYT: { employee: 0.015, company: 0.03 },
    BHTN: { employee: 0.01, company: 0.01 },
};

export async function GET(request: NextRequest) {
    try {
        const employees = await prisma.employee.findMany({
            where: { status: { in: ['ACTIVE', 'PROBATION'] } },
            select: {
                id: true,
                employeeCode: true,
                fullName: true,
                status: true,
                insuranceRecords: {
                    where: { status: 'ACTIVE' },
                },
                contracts: {
                    where: { status: 'ACTIVE' },
                    orderBy: { startDate: 'desc' },
                    take: 1,
                },
            },
            orderBy: { employeeCode: 'asc' },
        });

        const insuranceData = employees.map((emp) => {
            const contract = emp.contracts[0];
            const baseSalary = contract?.salary ?? 0;

            // Check if employee has actual InsuranceRecord data
            const bhxhRecord = emp.insuranceRecords.find(r => r.type === 'BHXH');
            const bhytRecord = emp.insuranceRecords.find(r => r.type === 'BHYT');
            const bhtnRecord = emp.insuranceRecords.find(r => r.type === 'BHTN');

            // Use InsuranceRecord rates if available, otherwise default rates
            const insuranceSalary = bhxhRecord?.baseSalary ?? baseSalary;

            const bhxh = {
                employee: bhxhRecord ? Math.round(bhxhRecord.baseSalary * bhxhRecord.employeeRate) : Math.round(insuranceSalary * RATES.BHXH.employee),
                company: bhxhRecord ? Math.round(bhxhRecord.baseSalary * bhxhRecord.companyRate) : Math.round(insuranceSalary * RATES.BHXH.company),
            };

            const bhyt = {
                employee: bhytRecord ? Math.round(bhytRecord.baseSalary * bhytRecord.employeeRate) : Math.round(insuranceSalary * RATES.BHYT.employee),
                company: bhytRecord ? Math.round(bhytRecord.baseSalary * bhytRecord.companyRate) : Math.round(insuranceSalary * RATES.BHYT.company),
            };

            const bhtn = {
                employee: bhtnRecord ? Math.round(bhtnRecord.baseSalary * bhtnRecord.employeeRate) : Math.round(insuranceSalary * RATES.BHTN.employee),
                company: bhtnRecord ? Math.round(bhtnRecord.baseSalary * bhtnRecord.companyRate) : Math.round(insuranceSalary * RATES.BHTN.company),
            };

            // Get insurance number from BHXH record
            const socialInsuranceNo = bhxhRecord?.insuranceNumber || '';

            // Determine status
            let insuranceStatus = 'ACTIVE';
            if (!bhxhRecord && !bhytRecord && !bhtnRecord) {
                insuranceStatus = emp.status === 'PROBATION' ? 'NEW' : 'ACTIVE';
            }

            return {
                id: emp.id,
                code: emp.employeeCode,
                name: emp.fullName,
                socialInsuranceNo,
                baseSalary: insuranceSalary,
                bhxh,
                bhyt,
                bhtn,
                status: insuranceStatus,
            };
        });

        return NextResponse.json(insuranceData);
    } catch (error) {
        console.error('Insurance report error:', error);
        return NextResponse.json({ error: 'Failed to generate insurance report' }, { status: 500 });
    }
}
