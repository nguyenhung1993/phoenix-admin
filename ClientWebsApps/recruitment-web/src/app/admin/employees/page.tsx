import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmployeeToolbar } from '@/components/employees/employee-toolbar';
import { MoreHorizontal, Pencil, Trash, FileText, User } from 'lucide-react';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmployeeListPage({ searchParams }: PageProps) {
    // Await searchParams before access
    const params = await searchParams;

    // Parse params
    const q = typeof params.q === 'string' ? params.q : undefined;
    const deptId = typeof params.dept === 'string' ? params.dept : undefined;
    const posId = typeof params.pos === 'string' ? params.pos : undefined;
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Filter conditions
    const where = {
        AND: [
            q
                ? {
                    OR: [
                        { fullName: { contains: q, mode: 'insensitive' as const } },
                        { email: { contains: q, mode: 'insensitive' as const } },
                        { employeeCode: { contains: q, mode: 'insensitive' as const } },
                    ],
                }
                : {},
            deptId ? { departmentId: deptId } : {},
            posId ? { positionId: posId } : {},
        ],
    };

    // Parallel fetch
    const [employees, total, departments, positions] = await Promise.all([
        prisma.employee.findMany({
            where,
            include: {
                department: true,
                position: true,
            },
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.employee.count({ where }),
        prisma.department.findMany({ orderBy: { name: 'asc' } }),
        prisma.position.findMany({ orderBy: { name: 'asc' } }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Quản lý nhân viên</h1>
                <p className="text-muted-foreground">
                    Danh sách nhân sự và quản lý thông tin
                </p>
            </div>

            <EmployeeToolbar departments={departments} positions={positions} />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Mã NV</TableHead>
                            <TableHead>Họ tên</TableHead>
                            <TableHead>Phòng ban / Chức vụ</TableHead>
                            <TableHead>Liên hệ</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Không tìm thấy nhân viên nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={employee.avatar || undefined} alt={employee.fullName} />
                                            <AvatarFallback>
                                                {employee.fullName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{employee.employeeCode}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {employee.fullName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(employee.hireDate), 'dd/MM/yyyy')}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{employee.department?.name || '-'}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {employee.position?.name || '-'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{employee.email}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {employee.phone}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={employee.status === 'ACTIVE' ? 'default' : 'secondary'}
                                            className={
                                                employee.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                    : employee.status === 'RESIGNED'
                                                        ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                            }
                                        >
                                            {employee.status === 'ACTIVE' ? 'Đang làm việc' :
                                                employee.status === 'RESIGNED' ? 'Đã nghỉ việc' :
                                                    employee.status === 'ON_LEAVE' ? 'Nghỉ phép' :
                                                        employee.status === 'PROBATION' ? 'Thử việc' : employee.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/employees/${employee.id}`}>
                                                        <User className="mr-2 h-4 w-4" />
                                                        Xem hồ sơ
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/employees/${employee.id}/edit`}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Xóa nhân viên
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Simple Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    asChild={page > 1}
                >
                    {page > 1 ? (
                        <Link
                            href={{
                                query: { ...params, page: page - 1 },
                            }}
                        >
                            Trước
                        </Link>
                    ) : (
                        <span>Trước</span>
                    )}
                </Button>
                <div className="text-sm font-medium">
                    Trang {page} / {totalPages || 1}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    asChild={page < totalPages}
                >
                    {page < totalPages ? (
                        <Link
                            href={{
                                query: { ...params, page: page + 1 },
                            }}
                        >
                            Sau
                        </Link>
                    ) : (
                        <span>Sau</span>
                    )}
                </Button>
            </div>
        </div>
    );
}
