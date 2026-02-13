import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/employees/[id] - Get single employee
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
                department: { select: { id: true, name: true } },
                position: { select: { id: true, name: true, level: true } },
            },
        });

        if (!employee) {
            return NextResponse.json({ error: 'Không tìm thấy nhân viên' }, { status: 404 });
        }

        return NextResponse.json(employee);
    } catch (error) {
        console.error('GET /api/employees/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/employees/[id] - Update employee
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Check if employee exists
        const existing = await prisma.employee.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Không tìm thấy nhân viên' }, { status: 404 });
        }

        const {
            fullName, email, phone, dob, gender,
            departmentId, positionId, managerId, hireDate,
            address, identityCard, taxCode, bankAccount, bankName,
            contractTypeId, shiftTypeId, status, employeeCode,
        } = body;

        // Check for duplicate email (excluding current employee)
        if (email && email !== existing.email) {
            const existingEmail = await prisma.employee.findUnique({
                where: { email },
            });
            if (existingEmail) {
                return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 400 });
            }
        }

        // Check for duplicate employee code (excluding current employee)
        if (employeeCode && employeeCode !== existing.employeeCode) {
            const existingCode = await prisma.employee.findUnique({
                where: { employeeCode },
            });
            if (existingCode) {
                return NextResponse.json({ error: 'Mã nhân viên đã tồn tại' }, { status: 400 });
            }
        }

        const employee = await prisma.employee.update({
            where: { id },
            data: {
                ...(fullName && { fullName }),
                ...(email && { email }),
                ...(phone !== undefined && { phone }),
                ...(dob && { dob: new Date(dob) }),
                ...(gender && { gender }),
                ...(departmentId && { departmentId }),
                ...(positionId && { positionId }),
                ...(managerId !== undefined && { managerId: managerId || null }),
                ...(hireDate && { hireDate: new Date(hireDate) }),
                ...(address !== undefined && { address }),
                ...(identityCard !== undefined && { identityCard }),
                ...(taxCode !== undefined && { taxCode }),
                ...(bankAccount !== undefined && { bankAccount }),
                ...(bankName !== undefined && { bankName }),
                ...(contractTypeId !== undefined && { contractTypeId: contractTypeId || null }),
                ...(shiftTypeId !== undefined && { shiftTypeId: shiftTypeId || null }),
                ...(status && { status }),
                ...(employeeCode && { employeeCode }),
            },
            include: {
                department: { select: { id: true, name: true } },
                position: { select: { id: true, name: true } },
            },
        });

        return NextResponse.json(employee);
    } catch (error) {
        console.error('PATCH /api/employees/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/employees/[id] - Delete employee
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const existing = await prisma.employee.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Không tìm thấy nhân viên' }, { status: 404 });
        }

        await prisma.employee.delete({ where: { id } });

        return NextResponse.json({ message: 'Đã xóa nhân viên thành công' });
    } catch (error) {
        console.error('DELETE /api/employees/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
