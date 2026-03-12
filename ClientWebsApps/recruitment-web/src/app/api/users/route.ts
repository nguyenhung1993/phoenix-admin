import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { hash } from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET /api/users - List all users with employee info
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    employee: {
                        select: {
                            fullName: true,
                            department: { select: { name: true } },
                            position: { select: { name: true } },
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        const data = users.map((u) => ({
            id: u.id,
            name: u.name || u.employee?.fullName || null,
            email: u.email,
            image: u.image,
            role: u.role,
            status: u.status === 'ACTIVE' ? 'active' : 'inactive',
            department: u.employee?.department?.name || '',
            position: u.employee?.position?.name || '',
        }));

        return NextResponse.json({
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('GET /api/users error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, role, status, password, department, position } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Tên và email là bắt buộc' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 409 });
        }

        // Hash password if provided, default to '123456' if not
        const rawPassword = password || '123456';
        const hashedPassword = await hash(rawPassword, 12);

        let departmentId = null;
        let positionId = null;

        if (department) {
            const dept = await prisma.department.findFirst({ where: { name: department } });
            if (dept) departmentId = dept.id;
        }

        if (position) {
            const pos = await prisma.position.findFirst({ where: { name: position } });
            if (pos) positionId = pos.id;
        }

        // Create user and linked employee in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    role: role || 'EMPLOYEE',
                    status: status === 'inactive' ? 'INACTIVE' : 'ACTIVE',
                },
            });

            const newEmployee = await tx.employee.create({
                data: {
                    employeeCode: `EMP${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
                    fullName: name || '',
                    email: email.toLowerCase(),
                    userId: newUser.id,
                    departmentId,
                    positionId,
                    hireDate: new Date(),
                    status: 'ACTIVE',
                },
                include: {
                    department: true,
                    position: true
                }
            });
            
            return { newUser, newEmployee };
        });

        return NextResponse.json({
            id: result.newUser.id,
            name: result.newUser.name,
            email: result.newUser.email,
            image: result.newUser.image,
            role: result.newUser.role,
            status: result.newUser.status === 'ACTIVE' ? 'active' : 'inactive',
            department: result.newEmployee.department?.name || '',
            position: result.newEmployee.position?.name || '',
        }, { status: 201 });
    } catch (error) {
        console.error('POST /api/users error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// PATCH /api/users - Update a user
export async function PATCH(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, role, status, department, position } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID người dùng là bắt buộc' }, { status: 400 });
        }

        let departmentId = undefined;
        let positionId = undefined;

        if (department !== undefined) {
            if (department === '') {
                departmentId = null;
            } else {
                const dept = await prisma.department.findFirst({ where: { name: department } });
                if (dept) departmentId = dept.id;
            }
        }

        if (position !== undefined) {
             if (position === '') {
                 positionId = null;
             } else {
                 const pos = await prisma.position.findFirst({ where: { name: position } });
                 if (pos) positionId = pos.id;
             }
        }

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id },
                data: {
                    ...(name !== undefined && { name }),
                    ...(role !== undefined && { role }),
                    ...(status !== undefined && { status: status === 'inactive' ? 'INACTIVE' : 'ACTIVE' }),
                },
            });

            // Update associated employee if exists, otherwise create it
            let employee = await tx.employee.findUnique({ where: { userId: id }, include: { department: true, position: true } });
            
            if (employee && (departmentId !== undefined || positionId !== undefined || name !== undefined || status !== undefined)) {
                // If departmentId is null explicitly, we want to remove the department. If it's undefined, we ignore.
                employee = await tx.employee.update({
                    where: { id: employee.id },
                    data: {
                        ...(departmentId !== undefined && { departmentId }),
                        ...(positionId !== undefined && { positionId }),
                        ...(name !== undefined && { fullName: name }),
                        ...(status !== undefined && { status: status === 'inactive' ? 'RESIGNED' : 'ACTIVE' }),
                    },
                    include: { department: true, position: true }
                });
            } else if (!employee && (departmentId || positionId || name)) {
                 employee = await tx.employee.create({
                    data: {
                        employeeCode: `EMP${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
                        fullName: name || user.name || '',
                        email: user.email,
                        userId: user.id,
                        departmentId: departmentId || null,
                        positionId: positionId || null,
                        hireDate: new Date(),
                        status: status === 'inactive' ? 'RESIGNED' : 'ACTIVE',
                    },
                    include: { department: true, position: true }
                });
            }

            return { user, employee };
        });

        return NextResponse.json({
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            image: result.user.image,
            role: result.user.role,
            status: result.user.status === 'ACTIVE' ? 'active' : 'inactive',
            department: result.employee?.department?.name || '',
            position: result.employee?.position?.name || '',
        });
    } catch (error) {
        console.error('PATCH /api/users error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// DELETE /api/users?id=xxx
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID người dùng là bắt buộc' }, { status: 400 });
        }

        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/users error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}
