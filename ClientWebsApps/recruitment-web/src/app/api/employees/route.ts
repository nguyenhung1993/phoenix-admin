import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/employees - List employees with optional filters
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const departmentId = searchParams.get('departmentId');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const where: Record<string, unknown> = {};

        if (departmentId) where.departmentId = departmentId;
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { employeeCode: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [employees, total] = await Promise.all([
            prisma.employee.findMany({
                where,
                include: {
                    department: { select: { id: true, name: true } },
                    position: { select: { id: true, name: true, level: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.employee.count({ where }),
        ]);

        return NextResponse.json({
            data: employees,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('GET /api/employees error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/employees - Create new employee
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            employeeCode, fullName, email, phone, dob, gender,
            departmentId, positionId, managerId, hireDate,
            address, identityCard, taxCode, bankAccount, bankName,
            contractTypeId, shiftTypeId, status, type // Added status and type
        } = body;

        if (!employeeCode || !fullName || !email || !hireDate || !departmentId || !positionId) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc: Mã NV, Họ tên, Email, Ngày vào làm, Phòng ban, Chức vụ' },
                { status: 400 }
            );
        }

        // Check for duplicate
        const existingCode = await prisma.employee.findUnique({
            where: { employeeCode }
        });
        if (existingCode) {
            return NextResponse.json({ error: 'Mã nhân viên đã tồn tại' }, { status: 400 });
        }

        const existingEmail = await prisma.employee.findUnique({
            where: { email }
        });
        if (existingEmail) {
            return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 400 });
        }

        const employee = await prisma.employee.create({
            data: {
                employeeCode,
                fullName,
                email,
                phone,
                dob: dob ? new Date(dob) : undefined,
                gender,
                departmentId,
                positionId,
                managerId: managerId || null,
                hireDate: new Date(hireDate),
                address,
                identityCard,
                taxCode,
                bankAccount,
                bankName,
                contractTypeId: contractTypeId || null,
                shiftTypeId: shiftTypeId || null,
                status, // Optional
                // type field is not in Prisma schema step 822 (Employee model)?? 
                // schema (Step 822) L434 shows status, contractTypeId, shiftTypeId.
                // It DOES NOT show `type`.
                // Reference Step 822 L434: status EmployeeStatus @default(ACTIVE).
                // Let me check if `type` exists on Employee. 
                // L505 is `Job.type`.
                // Employee model does NOT have `type`.
                // So I remove `type`.
            },
            include: {
                department: { select: { id: true, name: true } },
                position: { select: { id: true, name: true } },
            },
        });

        return NextResponse.json(employee, { status: 201 });
    } catch (error) {
        console.error('POST /api/employees error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
