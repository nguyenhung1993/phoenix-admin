'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Users, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
interface Department { id: string; code: string; name: string; parentId?: string; managerId?: string; managerName?: string; employeeCount?: number; isActive: boolean; createdAt?: string;[key: string]: unknown; }
import { DepartmentDialog } from './department-dialog';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function DepartmentList() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    useEffect(() => {
        fetch('/api/departments').then(r => r.json()).then(setDepartments).catch(console.error);
    }, []);

    const handleCreate = () => {
        setSelectedDepartment(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (dept: Department) => {
        setSelectedDepartment(dept);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phòng ban này? Hành động này không thể hoàn tác.")) {
            await fetch(`/api/departments?id=${id}`, { method: 'DELETE' });
            setDepartments(prev => prev.filter(d => d.id !== id));
            toast.success("Đã xóa phòng ban thành công");
        }
    };

    const handleSubmit = async (values: any, id?: string) => {
        if (id) {
            const res = await fetch('/api/departments', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...values }) });
            const updated = await res.json();
            setDepartments(prev => prev.map(d => d.id === id ? updated : d));
            toast.success("Cập nhật phòng ban thành công");
        } else {
            const res = await fetch('/api/departments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
            const newDept = await res.json();
            setDepartments(prev => [...prev, newDept]);
            toast.success("Tạo phòng ban thành công");
        }
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Cơ cấu tổ chức</h3>
                    <p className="text-sm text-muted-foreground">Quản lý danh sách phòng ban và cây sơ đồ tổ chức.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm phòng ban
                </Button>
            </div>
            <Separator />

            <Card>
                <CardHeader className="px-6 py-4 pb-3">
                    <CardTitle className="text-base">Danh sách phòng ban ({departments.length})</CardTitle>
                    <CardDescription>Các đơn vị trực thuộc công ty</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table className="[&_tr>th]:px-6 [&_tr>td]:px-6">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Mã</TableHead>
                                <TableHead className="min-w-[200px]">Tên phòng ban</TableHead>
                                <TableHead className="w-[250px]">Trưởng phòng</TableHead>
                                <TableHead className="text-center w-[100px]">Nhân sự</TableHead>
                                <TableHead className="w-[150px]">Trạng thái</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.map((dept) => (
                                <TableRow key={dept.id}>
                                    <TableCell className="font-mono text-xs font-medium">{dept.code}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{dept.name}</div>
                                        {dept.parentId && dept.parentId !== 'root' && <div className="text-xs text-muted-foreground">Trực thuộc: {departments.find(d => d.id === dept.parentId)?.name || 'N/A'}</div>}
                                    </TableCell>
                                    <TableCell>
                                        {dept.managerName ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                                                        {dept.managerName.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{dept.managerName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">Chưa bổ nhiệm</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="font-normal">
                                            <Users className="mr-1 h-3 w-3" /> {dept.employeeCount}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={dept.isActive ? "outline" : "destructive"} className={dept.isActive ? "bg-green-50 text-green-700 border-green-200" : ""}>
                                            {dept.isActive ? "Hoạt động" : "Tạm ngưng"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(dept)}>Chỉnh sửa</DropdownMenuItem>
                                                <DropdownMenuItem>Bổ nhiệm trưởng phòng</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(dept.id)} className="text-red-600">Xóa</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <DepartmentDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedDepartment}
                departments={departments}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
