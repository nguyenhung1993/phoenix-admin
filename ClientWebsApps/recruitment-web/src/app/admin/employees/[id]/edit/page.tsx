import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EmployeeForm } from '@/components/employees/employee-form';
import prisma from '@/lib/prisma';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditEmployeePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditEmployeePage({ params }: EditEmployeePageProps) {
    const { id } = await params;

    const [employee, departments, positions] = await Promise.all([
        prisma.employee.findUnique({
            where: { id },
        }),
        prisma.department.findMany({ orderBy: { name: 'asc' } }),
        prisma.position.findMany({ orderBy: { name: 'asc' } }),
    ]);

    if (!employee) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/employees">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa nhân viên</h1>
                    <p className="text-muted-foreground">
                        Cập nhật thông tin hồ sơ nhân viên
                    </p>
                </div>
            </div>

            <div className="rounded-md border p-6 bg-card">
                <EmployeeForm
                    initialData={employee}
                    departments={departments}
                    positions={positions}
                />
            </div>
        </div>
    );
}
