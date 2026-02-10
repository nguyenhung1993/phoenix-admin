'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, MoreHorizontal, FileText } from 'lucide-react';
import { mockContractTypes, ContractType } from '@/lib/mocks/settings-hr';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ContractTypeDialog } from './contract-type-dialog';
import { toast } from 'sonner';

export function ContractTypeList() {
    const [contractTypes, setContractTypes] = useState<ContractType[]>(mockContractTypes);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedContractType, setSelectedContractType] = useState<ContractType | null>(null);

    const handleCreate = () => {
        setSelectedContractType(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (type: ContractType) => {
        setSelectedContractType(type);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa loại hợp đồng này?")) {
            setContractTypes(prev => prev.filter(t => t.id !== id));
            toast.success("Đã xóa loại hợp đồng thành công");
        }
    };

    const handleSubmit = (values: any, id?: string) => {
        if (id) {
            // Update
            setContractTypes(prev => prev.map(t => t.id === id ? { ...t, ...values } : t));
            toast.success("Cập nhật loại hợp đồng thành công");
        } else {
            // Create
            const newType: ContractType = {
                id: Math.random().toString(36).substr(2, 9),
                isSystem: false,
                ...values
            };
            setContractTypes(prev => [...prev, newType]);
            toast.success("Tạo loại hợp đồng thành công");
        }
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Cấu hình Hợp đồng</h3>
                    <p className="text-sm text-muted-foreground">Quản lý các loại hợp đồng lao động và phụ lục.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm loại hợp đồng
                </Button>
            </div>
            <Separator />

            <Card>
                <CardHeader className="px-6 py-4 pb-3">
                    <CardTitle className="text-base">Danh sách loại hợp đồng ({contractTypes.length})</CardTitle>
                    <CardDescription>Các loại hợp đồng áp dụng trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table className="[&_tr>th]:px-6 [&_tr>td]:px-6">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Mã loại</TableHead>
                                <TableHead className="min-w-[250px]">Tên loại hợp đồng</TableHead>
                                <TableHead>Thời hạn</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contractTypes.map((type) => (
                                <TableRow key={type.id}>
                                    <TableCell className="font-mono text-xs font-medium">{type.code}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{type.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {type.durationMonths === 0 ? (
                                            <Badge variant="outline">Không thời hạn</Badge>
                                        ) : (
                                            <span>{type.durationMonths} tháng</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{type.description}</TableCell>
                                    <TableCell>
                                        <Badge variant={type.isActive ? "secondary" : "destructive"} className="font-normal">
                                            {type.isActive ? "Áp dụng" : "Ngừng áp dụng"}
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
                                                <DropdownMenuItem onClick={() => handleEdit(type)}>Chỉnh sửa</DropdownMenuItem>
                                                {!type.isSystem && (
                                                    <DropdownMenuItem onClick={() => handleDelete(type.id)} className="text-red-600">
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
            </Card>

            <ContractTypeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedContractType}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
