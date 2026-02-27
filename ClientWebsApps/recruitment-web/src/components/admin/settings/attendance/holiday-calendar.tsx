'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, MoreHorizontal, CalendarDays } from 'lucide-react';
interface PublicHoliday { id: string; name: string; date: string; daysOff: number; description?: string; }
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HolidayDialog } from './holiday-dialog';
import { toast } from 'sonner';

export function HolidayCalendar() {
    const [holidays, setHolidays] = useState<PublicHoliday[]>([]);

    useEffect(() => {
        fetch('/api/public-holidays').then(r => r.json()).then(setHolidays).catch(console.error);
    }, []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState<PublicHoliday | null>(null);

    const handleCreate = () => {
        setSelectedHoliday(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (holiday: PublicHoliday) => {
        setSelectedHoliday(holiday);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa ngày lễ này?")) {
            await fetch(`/api/public-holidays?id=${id}`, { method: 'DELETE' });
            setHolidays(prev => prev.filter(h => h.id !== id));
            toast.success("Đã xóa ngày lễ thành công");
        }
    };

    const handleSubmit = async (values: any, id?: string) => {
        if (id) {
            const res = await fetch('/api/public-holidays', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...values }) });
            const updated = await res.json();
            setHolidays(prev => prev.map(h => h.id === id ? updated : h));
            toast.success("Cập nhật ngày lễ thành công");
        } else {
            const res = await fetch('/api/public-holidays', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
            const newHoliday = await res.json();
            setHolidays(prev => [...prev, newHoliday]);
            toast.success("Tạo ngày lễ thành công");
        }
        setIsDialogOpen(false);
    };

    return (
        <Card>
            <CardHeader className="px-6 py-4 pb-3 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base">Lịch nghỉ lễ 2026</CardTitle>
                    <CardDescription>Danh sách các ngày nghỉ lễ được hưởng lương theo quy định</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm ngày lễ
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table className="[&_tr>th]:px-6 [&_tr>td]:px-6">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[200px]">Tên ngày lễ</TableHead>
                            <TableHead>Ngày diễn ra</TableHead>
                            <TableHead className="text-center">Số ngày nghỉ</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holidays.map((holiday) => (
                            <TableRow key={holiday.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-red-500" />
                                        <span className="font-medium">{holiday.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {new Date(holiday.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                        {holiday.daysOff} ngày
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{holiday.description}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(holiday)}>Chỉnh sửa</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(holiday.id)} className="text-red-600">Xóa</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            <HolidayDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedHoliday}
                onSubmit={handleSubmit}
            />
        </Card>
    );
}
