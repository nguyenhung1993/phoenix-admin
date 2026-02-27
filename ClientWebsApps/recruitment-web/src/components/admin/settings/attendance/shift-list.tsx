'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, MoreHorizontal, Clock } from 'lucide-react';
interface ShiftType { id: string; code: string; name: string; startTime: string; endTime: string; breakStartTime?: string; breakEndTime?: string; workDays: string[]; isActive: boolean; isDefault: boolean; }
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ShiftDialog } from './shift-dialog';
import { toast } from 'sonner';

export function ShiftList() {
    const [shifts, setShifts] = useState<ShiftType[]>([]);

    useEffect(() => {
        fetch('/api/shift-types').then(r => r.json()).then(setShifts).catch(console.error);
    }, []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState<ShiftType | null>(null);

    const handleCreate = () => {
        setSelectedShift(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (shift: ShiftType) => {
        setSelectedShift(shift);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa ca làm việc này?")) {
            await fetch(`/api/shift-types?id=${id}`, { method: 'DELETE' });
            setShifts(prev => prev.filter(s => s.id !== id));
            toast.success("Đã xóa ca làm việc thành công");
        }
    };

    const handleSubmit = async (values: any, id?: string) => {
        if (id) {
            const res = await fetch('/api/shift-types', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...values }) });
            const updated = await res.json();
            setShifts(prev => prev.map(s => s.id === id ? updated : s));
            toast.success("Cập nhật ca làm việc thành công");
        } else {
            const res = await fetch('/api/shift-types', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
            const newShift = await res.json();
            setShifts(prev => [...prev, newShift]);
            toast.success("Tạo ca làm việc thành công");
        }
        setIsDialogOpen(false);
    };

    return (
        <Card>
            <CardHeader className="px-6 py-4 pb-3 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base">Ca làm việc</CardTitle>
                    <CardDescription>Danh sách các ca làm việc trong hệ thống</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm ca
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table className="[&_tr>th]:px-6 [&_tr>td]:px-6">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Mã ca</TableHead>
                            <TableHead className="min-w-[200px]">Tên ca</TableHead>
                            <TableHead>Giờ làm việc</TableHead>
                            <TableHead>Giờ nghỉ</TableHead>
                            <TableHead>Ngày làm việc</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shifts.map((shift) => (
                            <TableRow key={shift.id}>
                                <TableCell className="font-mono text-xs font-medium">{shift.code}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">{shift.name}</div>
                                            {shift.isDefault && <span className="text-[10px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded">Mặc định</span>}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{shift.startTime} - {shift.endTime}</TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">
                                    {shift.breakStartTime} - {shift.breakEndTime}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {shift.workDays.map(day => (
                                            <span key={day} className="text-[10px] border rounded px-1 min-w-[30px] text-center bg-slate-50">{day}</span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={shift.isActive ? "secondary" : "destructive"} className="font-normal">
                                        {shift.isActive ? "Hoạt động" : "Tạm ngưng"}
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
                                            <DropdownMenuItem onClick={() => handleEdit(shift)}>Chỉnh sửa</DropdownMenuItem>
                                            <DropdownMenuItem>Phân ca cho nhân viên</DropdownMenuItem>
                                            {!shift.isDefault && (
                                                <DropdownMenuItem onClick={() => handleDelete(shift.id)} className="text-red-600">
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

            <ShiftDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedShift}
                onSubmit={handleSubmit}
            />
        </Card>
    );
}
