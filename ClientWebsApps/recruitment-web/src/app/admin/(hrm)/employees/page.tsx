'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    mockEmployees,
    mockDepartments,
    employeeStatusLabels,
    formatDate,
    Employee,
} from '@/lib/mocks';
import {
    Search,
    Plus,
    Eye,
    Pencil,
    User,
    Mail,
    Phone,
    Building,
    Briefcase,
    Calendar,
    Users,
} from 'lucide-react';

// Wrapper component for Suspense boundary
export default function AdminEmployeesPage() {
    return (
        <Suspense fallback={<EmployeesPageSkeleton />}>
            <EmployeesPageContent />
        </Suspense>
    );
}

function EmployeesPageSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
        </div>
    );
}

function EmployeesPageContent() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [departmentFilter, setDepartmentFilter] = useState('ALL');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const searchParams = useSearchParams();

    // Auto-open create dialog if action=create is present in URL
    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            setCreateDialogOpen(true);
        }
    }, [searchParams]);

    // Initial values from URL params
    const initialData = {
        name: searchParams.get('name') || '',
        email: searchParams.get('email') || '',
        position: searchParams.get('position') || '',
        department: searchParams.get('department') || '', // Note: This needs to match ID if strict, but for mock select it might need logic
        startDate: searchParams.get('start_date') || '',
    };

    const filteredEmployees = mockEmployees.filter((employee) => {
        const matchesSearch =
            employee.fullName.toLowerCase().includes(search.toLowerCase()) ||
            employee.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
            employee.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || employee.status === statusFilter;
        const matchesDepartment = departmentFilter === 'ALL' || employee.departmentId === departmentFilter;
        return matchesSearch && matchesStatus && matchesDepartment;
    });

    const employeesByStatus = {
        ALL: mockEmployees.length,
        ACTIVE: mockEmployees.filter((e) => e.status === 'ACTIVE').length,
        PROBATION: mockEmployees.filter((e) => e.status === 'PROBATION').length,
        RESIGNED: mockEmployees.filter((e) => e.status === 'RESIGNED').length,
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
                    <p className="text-muted-foreground">Xem và quản lý thông tin nhân viên</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm nhân viên
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng nhân viên</p>
                                <p className="text-2xl font-bold">{employeesByStatus.ALL}</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang làm việc</p>
                                <p className="text-2xl font-bold text-green-600">{employeesByStatus.ACTIVE}</p>
                            </div>
                            <User className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Thử việc</p>
                                <p className="text-2xl font-bold text-yellow-600">{employeesByStatus.PROBATION}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Phòng ban</p>
                                <p className="text-2xl font-bold">{mockDepartments.length}</p>
                            </div>
                            <Building className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Tabs */}
            <Tabs defaultValue="ALL" onValueChange={setStatusFilter}>
                <TabsList className="flex-wrap h-auto gap-2">
                    <TabsTrigger value="ALL" className="gap-2">
                        Tất cả <Badge variant="secondary">{employeesByStatus.ALL}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="ACTIVE" className="gap-2">
                        Đang làm việc <Badge variant="secondary">{employeesByStatus.ACTIVE}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="PROBATION" className="gap-2">
                        Thử việc <Badge variant="secondary">{employeesByStatus.PROBATION}</Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm nhân viên..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Phòng ban" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả phòng ban</SelectItem>
                                {mockDepartments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Mã NV</TableHead>
                                <TableHead>Phòng ban</TableHead>
                                <TableHead>Chức vụ</TableHead>
                                <TableHead>Ngày vào</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEmployees.map((employee) => {
                                const statusStyle = employeeStatusLabels[employee.status];

                                return (
                                    <TableRow key={employee.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback>{getInitials(employee.fullName)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{employee.fullName}</p>
                                                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono">{employee.employeeCode}</TableCell>
                                        <TableCell>{employee.departmentName}</TableCell>
                                        <TableCell>{employee.positionName}</TableCell>
                                        <TableCell>{formatDate(employee.hireDate)}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedEmployee(employee);
                                                        setDetailDialogOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredEmployees.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không có nhân viên nào phù hợp
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-lg">
                    {selectedEmployee && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarFallback className="text-lg">
                                            {getInitials(selectedEmployee.fullName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <DialogTitle>{selectedEmployee.fullName}</DialogTitle>
                                        <DialogDescription>
                                            {selectedEmployee.employeeCode} • {selectedEmployee.positionName}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{selectedEmployee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{selectedEmployee.phone}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phòng ban</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Building className="h-4 w-4" />
                                            {selectedEmployee.departmentName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Chức vụ</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Briefcase className="h-4 w-4" />
                                            {selectedEmployee.positionName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ngày vào làm</p>
                                        <p className="font-medium">{formatDate(selectedEmployee.hireDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                                        <Badge variant={employeeStatusLabels[selectedEmployee.status].variant}>
                                            {employeeStatusLabels[selectedEmployee.status].label}
                                        </Badge>
                                    </div>
                                </div>

                                {selectedEmployee.managerName && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Quản lý trực tiếp</p>
                                            <p className="font-medium">{selectedEmployee.managerName}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
                                <Button>Chỉnh sửa</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Thêm nhân viên mới</DialogTitle>
                        <DialogDescription>Nhập thông tin nhân viên</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Họ tên</Label>
                                <Input defaultValue={initialData.name} placeholder="Nguyễn Văn A" />
                            </div>
                            <div>
                                <Label>Mã nhân viên</Label>
                                <Input placeholder="EMP009" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Email</Label>
                                <Input type="email" defaultValue={initialData.email} placeholder="email@company.com" />
                            </div>
                            <div>
                                <Label>Số điện thoại</Label>
                                <Input placeholder="0901234567" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Phòng ban</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phòng ban" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockDepartments.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Chức vụ</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn chức vụ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">Chuyên viên</SelectItem>
                                        <SelectItem value="4">Chuyên viên cao cấp</SelectItem>
                                        <SelectItem value="3">Team Lead</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>Ngày vào làm</Label>
                            <Input type="date" defaultValue={initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : ''} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={() => setCreateDialogOpen(false)}>Tạo nhân viên</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
