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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    mockEmployees,
    mockDepartments,
    employeeStatusLabels,
    formatDate,
    Employee,
    mockContractTypes,
    mockCandidates
} from '@/lib/mocks';
import {
    Search,
    Plus,
    User,
    Building,
    Calendar,
    Users,
    Filter,
} from 'lucide-react';
import { EmployeeDialog } from '@/components/admin/hrm/employees/employee-dialog';
import { toast } from 'sonner';

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
    const [contractFilter, setContractFilter] = useState('ALL');

    // State for data and dialogs
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const searchParams = useSearchParams();

    // Auto-open create dialog if action=create is present in URL
    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            const candidateId = searchParams.get('candidateId');
            if (candidateId) {
                // Pre-fill from candidate
                const candidate = mockCandidates.find(c => c.id === candidateId);
                if (candidate) {
                    // Create a partial employee object for pre-filling
                    // We cast to Employee for the state, but the dialog should handle partials if we typed it loosely,
                    // but here we can just mock the missing required fields with defaults or let the user fill them.
                    // Actually, let's create a partial object that satisfies the form defaults where possible.
                    const prefilledData: any = {
                        fullName: candidate.name,
                        email: candidate.email,
                        phone: candidate.phone,
                        status: 'PROBATION', // Default for new hires
                        // Map other fields if possible, e.g. jobTitle -> positionName (display only)
                        positionName: candidate.jobTitle,
                        hireDate: new Date().toISOString().split('T')[0],
                    };
                    setSelectedEmployee(prefilledData);
                } else {
                    setSelectedEmployee(null);
                }
            } else {
                setSelectedEmployee(null);
            }
            setIsDialogOpen(true);
        }
    }, [searchParams]);

    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch =
            employee.fullName.toLowerCase().includes(search.toLowerCase()) ||
            employee.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
            employee.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || employee.status === statusFilter;
        const matchesDepartment = departmentFilter === 'ALL' || employee.departmentId === departmentFilter;
        const matchesContract = contractFilter === 'ALL' || employee.contractTypeId === contractFilter;

        return matchesSearch && matchesStatus && matchesDepartment && matchesContract;
    });

    const employeesByStatus = {
        ALL: employees.length,
        ACTIVE: employees.filter((e) => e.status === 'ACTIVE').length,
        PROBATION: employees.filter((e) => e.status === 'PROBATION').length,
        RESIGNED: employees.filter((e) => e.status === 'RESIGNED').length,
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase();
    };

    const handleCreate = () => {
        setSelectedEmployee(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsDialogOpen(true);
    };

    const handleSubmit = (values: any, id?: string) => {
        if (id) {
            // Update
            setEmployees(prev => prev.map(emp => {
                if (emp.id === id) {
                    // Look up relation names for display
                    const deptName = mockDepartments.find(d => d.id === values.departmentId)?.name || emp.departmentName;
                    // Note: In real app, position name would be fetched from API

                    return { ...emp, ...values, departmentName: deptName };
                }
                return emp;
            }));
            toast.success("Cập nhật hồ sơ nhân viên thành công");
        } else {
            // Create
            const newEmployee: Employee = {
                id: Math.random().toString(36).substr(2, 9),
                departmentName: mockDepartments.find(d => d.id === values.departmentId)?.name || 'Unknown',
                positionName: 'N/A', // In mock we simplified this
                createdAt: new Date().toISOString(),
                ...values
            };
            setEmployees(prev => [...prev, newEmployee]);
            toast.success("Tạo nhân viên mới thành công");
        }
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
                    <p className="text-muted-foreground">Xem và quản lý thông tin nhân viên</p>
                </div>
                <Button onClick={handleCreate}>
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
                    <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm nhân viên..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Phòng ban" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Tất cả phòng ban</SelectItem>
                                    {mockDepartments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={contractFilter} onValueChange={setContractFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Loại hợp đồng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Tất cả hợp đồng</SelectItem>
                                    {mockContractTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md border border-x-0 sm:border-x">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Nhân viên</TableHead>
                                    <TableHead className="hidden md:table-cell">Mã NV</TableHead>
                                    <TableHead className="hidden sm:table-cell">Phòng ban</TableHead>
                                    <TableHead className="hidden md:table-cell">Hợp đồng</TableHead>
                                    <TableHead className="hidden lg:table-cell">Ngày vào</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.map((employee) => {
                                    const statusStyle = employeeStatusLabels[employee.status];

                                    return (
                                        <TableRow
                                            key={employee.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleEdit(employee)}
                                        >
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback>{getInitials(employee.fullName)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm">{employee.fullName}</p>
                                                        <p className="text-xs text-muted-foreground">{employee.positionName}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell font-mono text-xs">{employee.employeeCode}</TableCell>
                                            <TableCell className="hidden sm:table-cell text-sm">{employee.departmentName}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {employee.contractTypeName ? (
                                                    <Badge variant="outline" className="font-normal text-xs">{employee.contractTypeName}</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-sm">{formatDate(employee.hireDate)}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusStyle.variant} className="font-normal text-xs">{statusStyle.label}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredEmployees.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            Không có nhân viên nào phù hợp với bộ lọc
                        </div>
                    )}
                </CardContent>
            </Card>

            <EmployeeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedEmployee}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
