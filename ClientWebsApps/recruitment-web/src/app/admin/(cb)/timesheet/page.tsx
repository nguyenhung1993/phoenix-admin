'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    mockTimesheetEntries,
    mockEmployees,
    timesheetStatusLabels,
    TimesheetEntry,
} from '@/lib/mocks';
import {
    Clock,
    Users,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

export default function TimesheetPage() {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear] = useState(today.getFullYear());
    const [selectedEmployee, setSelectedEmployee] = useState('ALL');

    // Filter entries by month and employee
    const filteredEntries = useMemo(() => {
        return mockTimesheetEntries.filter((entry) => {
            const entryDate = new Date(entry.date);
            const matchesMonth = entryDate.getMonth() + 1 === selectedMonth;
            const matchesEmployee = selectedEmployee === 'ALL' || entry.employeeId === selectedEmployee;
            return matchesMonth && matchesEmployee;
        });
    }, [selectedMonth, selectedEmployee]);

    // Calculate summary stats
    const stats = useMemo(() => {
        const workDays = filteredEntries.filter(e => e.status !== 'WEEKEND' && e.status !== 'HOLIDAY');
        return {
            totalEntries: filteredEntries.length,
            presentDays: filteredEntries.filter(e => e.status === 'PRESENT').length,
            lateDays: filteredEntries.filter(e => e.status === 'LATE').length,
            absentDays: filteredEntries.filter(e => e.status === 'ABSENT').length,
            totalWorkHours: workDays.reduce((sum, e) => sum + e.workHours, 0),
            totalOvertimeHours: filteredEntries.reduce((sum, e) => sum + e.overtimeHours, 0),
        };
    }, [filteredEntries]);

    // Group by employee for summary view
    const employeeSummaries = useMemo(() => {
        const grouped = new Map<string, { name: string; present: number; late: number; absent: number; hours: number }>();

        filteredEntries.forEach((entry) => {
            const existing = grouped.get(entry.employeeId) || {
                name: entry.employeeName,
                present: 0,
                late: 0,
                absent: 0,
                hours: 0,
            };

            if (entry.status === 'PRESENT') existing.present++;
            if (entry.status === 'LATE') existing.late++;
            if (entry.status === 'ABSENT') existing.absent++;
            existing.hours += entry.workHours;

            grouped.set(entry.employeeId, existing);
        });

        return Array.from(grouped.entries()).map(([id, data]) => ({ id, ...data }));
    }, [filteredEntries]);

    const months = [
        { value: 1, label: 'Tháng 1' },
        { value: 2, label: 'Tháng 2' },
        { value: 3, label: 'Tháng 3' },
        { value: 4, label: 'Tháng 4' },
        { value: 5, label: 'Tháng 5' },
        { value: 6, label: 'Tháng 6' },
        { value: 7, label: 'Tháng 7' },
        { value: 8, label: 'Tháng 8' },
        { value: 9, label: 'Tháng 9' },
        { value: 10, label: 'Tháng 10' },
        { value: 11, label: 'Tháng 11' },
        { value: 12, label: 'Tháng 12' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Bảng chấm công</h1>
                <p className="text-muted-foreground">Quản lý dữ liệu chấm công nhân viên</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Chọn tháng" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((m) => (
                            <SelectItem key={m.value} value={m.value.toString()}>
                                {m.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả nhân viên</SelectItem>
                        {mockEmployees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                                {emp.fullName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Có mặt</p>
                                <p className="text-2xl font-bold text-green-600">{stats.presentDays}</p>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đi muộn</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.lateDays}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Vắng mặt</p>
                                <p className="text-2xl font-bold text-red-600">{stats.absentDays}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng giờ làm</p>
                                <p className="text-2xl font-bold">{stats.totalWorkHours}h</p>
                            </div>
                            <Clock className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Employee Summary Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Tổng hợp theo nhân viên - Tháng {selectedMonth}/{selectedYear}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead className="text-center">Có mặt</TableHead>
                                <TableHead className="text-center">Đi muộn</TableHead>
                                <TableHead className="text-center">Vắng</TableHead>
                                <TableHead className="text-right">Tổng giờ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employeeSummaries.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="font-medium">{emp.name}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="default">{emp.present}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{emp.late}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="destructive">{emp.absent}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{emp.hours}h</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detailed Entries (when specific employee selected) */}
            {selectedEmployee !== 'ALL' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Chi tiết chấm công
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ngày</TableHead>
                                    <TableHead>Giờ vào</TableHead>
                                    <TableHead>Giờ ra</TableHead>
                                    <TableHead>Số giờ</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEntries.map((entry) => {
                                    const statusStyle = timesheetStatusLabels[entry.status];
                                    return (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                {new Date(entry.date).toLocaleDateString('vi-VN', {
                                                    weekday: 'short',
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                })}
                                            </TableCell>
                                            <TableCell className="font-mono">{entry.checkIn || '-'}</TableCell>
                                            <TableCell className="font-mono">{entry.checkOut || '-'}</TableCell>
                                            <TableCell className="font-mono">{entry.workHours}h</TableCell>
                                            <TableCell>
                                                <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
