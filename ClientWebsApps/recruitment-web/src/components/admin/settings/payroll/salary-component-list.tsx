'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, MoreHorizontal, Banknote, Coins } from 'lucide-react';
interface SalaryComponent { id: string; code: string; name: string; type: string; method?: string; formula?: string; isSystem: boolean; isActive: boolean; isTaxable?: boolean; description?: string; order?: number; }
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SalaryComponentDialog } from './salary-component-dialog';
import { toast } from 'sonner';

export function SalaryComponentList() {
    const [components, setComponents] = useState<SalaryComponent[]>([]);

    useEffect(() => {
        fetch('/api/salary-components').then(r => r.json()).then(setComponents).catch(console.error);
    }, []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<SalaryComponent | null>(null);

    const handleCreate = () => {
        setSelectedComponent(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (component: SalaryComponent) => {
        setSelectedComponent(component);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thành phần lương này?")) {
            await fetch(`/api/salary-components?id=${id}`, { method: 'DELETE' });
            setComponents(prev => prev.filter(c => c.id !== id));
            toast.success("Đã xóa thành phần lương thành công");
        }
    };

    const handleSubmit = async (values: any, id?: string) => {
        if (id) {
            const res = await fetch('/api/salary-components', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...values }) });
            const updated = await res.json();
            setComponents(prev => prev.map(c => c.id === id ? updated : c));
            toast.success("Cập nhật thành phần lương thành công");
        } else {
            const res = await fetch('/api/salary-components', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
            const newComp = await res.json();
            setComponents(prev => [...prev, newComp]);
            toast.success("Tạo thành phần lương thành công");
        }
        setIsDialogOpen(false);
    };

    return (
        <Card>
            <CardHeader className="px-6 py-4 pb-3 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base">Thành phần lương</CardTitle>
                    <CardDescription>Các khoản thu nhập và khấu trừ trong bảng lương</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm khoản lương
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table className="[&_tr>th]:px-6 [&_tr>td]:px-6">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Mã</TableHead>
                            <TableHead className="min-w-[200px]">Tên khoản lương</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead className="text-center">Tính thuế</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {components.map((comp) => (
                            <TableRow key={comp.id}>
                                <TableCell className="font-mono text-xs font-medium">{comp.code}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {comp.type === 'EARNING' ? (
                                            <Banknote className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Coins className="h-4 w-4 text-orange-600" />
                                        )}
                                        <span className="font-medium">{comp.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={comp.type === 'EARNING' ? 'default' : 'outline'} className={comp.type === 'DEDUCTION' ? 'text-orange-600 border-orange-200 bg-orange-50' : 'bg-green-600 hover:bg-green-700'}>
                                        {comp.type === 'EARNING' ? 'Thu nhập' : 'Khấu trừ'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {comp.isTaxable ? (
                                        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">Có</Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{comp.description}</TableCell>
                                <TableCell>
                                    <Badge variant={comp.isActive ? "secondary" : "destructive"} className="font-normal">
                                        {comp.isActive ? "Áp dụng" : "Ngừng dùng"}
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
                                            <DropdownMenuItem>Cấu hình công thức</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEdit(comp)}>Chỉnh sửa</DropdownMenuItem>
                                            {!comp.isSystem && (
                                                <DropdownMenuItem onClick={() => handleDelete(comp.id)} className="text-red-600">
                                                    Xóa
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            <SalaryComponentDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedComponent}
                onSubmit={handleSubmit}
            />
        </Card>
    );
}
