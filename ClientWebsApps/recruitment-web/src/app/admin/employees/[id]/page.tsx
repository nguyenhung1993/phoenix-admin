import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ChevronLeft, Edit, Mail, Phone, MapPin, Building, Briefcase, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface EmployeeDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
    const { id } = await params;

    const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
            department: true,
            position: true,
            manager: true,
        },
    });

    if (!employee) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/employees">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{employee.fullName}</h1>
                        <p className="text-muted-foreground">{employee.employeeCode}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/admin/employees/${employee.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={employee.avatar || undefined} alt={employee.fullName} />
                            <AvatarFallback className="text-2xl">
                                {employee.fullName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="mt-4 text-xl font-semibold">{employee.fullName}</h2>
                        <p className="text-sm text-muted-foreground">{employee.position?.name || 'Chưa có chức vụ'}</p>
                        <Badge className="mt-2" variant={employee.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {employee.status}
                        </Badge>
                    </div>

                    <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold">Liên hệ</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{employee.phone || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{employee.address || 'Chưa cập nhật'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Thông tin công việc</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Phòng ban</span>
                                <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <span>{employee.department?.name || '-'}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Chức vụ</span>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span>{employee.position?.name || '-'}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Ngày vào làm</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{format(new Date(employee.hireDate), 'PPP')}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Quản lý trực tiếp</span>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-5 w-5">
                                        <AvatarFallback className="text-[10px]">M</AvatarFallback>
                                    </Avatar>
                                    <span>{employee.manager?.fullName || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Ngày sinh</span>
                                <div>
                                    {employee.dob ? format(new Date(employee.dob), 'PPP') : '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Giới tính</span>
                                <div>
                                    {employee.gender === 'MALE' ? 'Nam' : employee.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">CMND/CCCD</span>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span>{employee.identityCard || '-'}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Mã số thuế</span>
                                <div>{employee.taxCode || '-'}</div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Thông tin tài khoản ngân hàng</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Số tài khoản</span>
                                <div>{employee.bankAccount || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Ngân hàng</span>
                                <div>{employee.bankName || '-'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
