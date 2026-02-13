import Link from 'next/link';
import { EmployeeForm } from '@/components/employees/employee-form';
import prisma from '@/lib/prisma';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function NewEmployeePage() {
    const departments = await prisma.department.findMany({ orderBy: { name: 'asc' } });
    const positions = await prisma.position.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/employees">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Thêm nhân viên mới</h1>
                    <p className="text-muted-foreground">
                        Nhập thông tin nhân viên để tạo hồ sơ mới
                    </p>
                </div>
            </div>

            <div className="rounded-md border p-6 bg-card">
                <EmployeeForm departments={departments} positions={positions} />
            </div>
        </div>
    );
}
