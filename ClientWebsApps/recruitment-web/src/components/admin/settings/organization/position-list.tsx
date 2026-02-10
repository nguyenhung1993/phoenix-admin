'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, MoreHorizontal } from 'lucide-react';
import { mockPositions, levelLabels, formatCurrency, Position } from '@/lib/mocks/hrm';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { PositionDialog } from './position-dialog';
import { toast } from 'sonner';

export function PositionList() {
    const [positions, setPositions] = useState<Position[]>(mockPositions);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

    const handleCreate = () => {
        setSelectedPosition(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (pos: Position) => {
        setSelectedPosition(pos);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa chức danh này? Hành động này không thể hoàn tác.")) {
            setPositions(prev => prev.filter(p => p.id !== id));
            toast.success("Đã xóa chức danh thành công");
        }
    };

    const handleSubmit = (values: any, id?: string) => {
        if (id) {
            // Update
            setPositions(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
            toast.success("Cập nhật chức danh thành công");
        } else {
            // Create
            const newPos: Position = {
                id: Math.random().toString(36).substr(2, 9),
                ...values
            };
            setPositions(prev => [...prev, newPos]);
            toast.success("Tạo chức danh thành công");
        }
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Chức danh & Vị trí</h3>
                    <p className="text-sm text-muted-foreground">Quản lý hệ thống chức danh và khung lương (Job Grades).</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm chức danh
                </Button>
            </div>
            <Separator />

            <Card>
                <CardHeader className="px-6 py-4 pb-3">
                    <CardTitle className="text-base">Danh sách chức danh ({positions.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table className="[&_tr>th]:px-6 [&_tr>td]:px-6">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Mã</TableHead>
                                <TableHead className="min-w-[200px]">Tên chức danh</TableHead>
                                <TableHead>Cấp bậc (Level)</TableHead>
                                <TableHead>Khung lương (VND/tháng)</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {positions.map((pos) => {
                                const level = levelLabels[pos.level] || { label: pos.level, color: 'bg-gray-100' };
                                return (
                                    <TableRow key={pos.id}>
                                        <TableCell className="font-mono text-xs font-medium">{pos.code}</TableCell>
                                        <TableCell className="font-medium">{pos.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("font-normal", level.color)}>
                                                {level.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {formatCurrency(pos.minSalary)} - {formatCurrency(pos.maxSalary)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={pos.isActive ? "outline" : "destructive"} className={pos.isActive ? "bg-green-50 text-green-700 border-green-200" : ""}>
                                                {pos.isActive ? "Kích hoạt" : "Ngừng dùng"}
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
                                                    <DropdownMenuItem onClick={() => handleEdit(pos)}>Chỉnh sửa</DropdownMenuItem>
                                                    <DropdownMenuItem>Xem mô tả công việc (JD)</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(pos.id)} className="text-red-600">Xóa</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <PositionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedPosition}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
