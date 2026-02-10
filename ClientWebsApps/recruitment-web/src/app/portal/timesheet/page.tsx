'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, Calendar as CalendarIcon, Clock, DollarSign } from 'lucide-react';

// Mock data for timesheet
const mockTimesheet = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2026, 5, i + 1); // June 2026
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isPresent = !isWeekend && Math.random() > 0.1;

    return {
        date: date.toISOString(),
        checkIn: isPresent ? '08:00' : isWeekend ? '-' : '08:15',
        checkOut: isPresent ? '17:30' : isWeekend ? '-' : '17:30',
        totalHours: isPresent ? 8.5 : isWeekend ? 0 : 8.25,
        status: isWeekend ? 'WEEKEND' : isPresent ? 'PRESENT' : 'LATE',
    };
});

export default function TimesheetPage() {
    const [month, setMonth] = useState('6');
    const [year, setYear] = useState('2026');

    // Stats
    const totalWorkingDays = mockTimesheet.filter(t => t.status !== 'WEEKEND').length;
    const presentDays = mockTimesheet.filter(t => t.status === 'PRESENT').length;
    const lateDays = mockTimesheet.filter(t => t.status === 'LATE').length;
    const leaveDays = 0; // Mock

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bảng công & Lương</h1>
                    <p className="text-muted-foreground">Theo dõi ngày công và thu nhập hàng tháng</p>
                </div>
                <div className="flex gap-2">
                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Tháng" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>Tháng {i + 1}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Năm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                </div>
            </div>

            {/* Salary Summary Card */}
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Phiếu lương tạm tính (Tháng {month}/{year})</CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-primary">28,450,000 VNĐ</div>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                        <span>Lương CB: 30,000,000</span>
                        <span>•</span>
                        <span>Khấu trừ: 1,550,000</span>
                        <span>•</span>
                        <span>Thưởng: 0</span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Công chuẩn</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalWorkingDays}</div>
                        <p className="text-xs text-muted-foreground">ngày</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thực tế đi làm</CardTitle>
                        <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{presentDays}</div>
                        <p className="text-xs text-muted-foreground">ngày</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đi muộn / Về sớm</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lateDays}</div>
                        <p className="text-xs text-muted-foreground">lần</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nghỉ phép</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leaveDays}</div>
                        <p className="text-xs text-muted-foreground">ngày</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Chi tiết chấm công</CardTitle>
                    <CardDescription>Dữ liệu chấm công hàng ngày từ máy chấm công</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Thứ</TableHead>
                                <TableHead>Giờ vào</TableHead>
                                <TableHead>Giờ ra</TableHead>
                                <TableHead>Tổng giờ</TableHead>
                                <TableHead>Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockTimesheet.map((row, index) => {
                                const date = new Date(row.date);
                                const dayName = date.toLocaleDateString('vi-VN', { weekday: 'long' });

                                return (
                                    <TableRow key={index}>
                                        <TableCell>{date.toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell className="capitalize">{dayName}</TableCell>
                                        <TableCell>{row.checkIn}</TableCell>
                                        <TableCell>{row.checkOut}</TableCell>
                                        <TableCell>{row.totalHours}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                row.status === 'PRESENT' ? 'default' :
                                                    row.status === 'WEEKEND' ? 'secondary' :
                                                        row.status === 'LATE' ? 'destructive' : 'outline'
                                            }>
                                                {row.status === 'PRESENT' ? 'Đúng giờ' :
                                                    row.status === 'WEEKEND' ? 'Cuối tuần' :
                                                        row.status === 'LATE' ? 'Đi muộn' : row.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function CheckCircle2Icon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
