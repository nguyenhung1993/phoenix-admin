'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockAttendanceRecords, attendanceStatusLabels, AttendanceRecord } from '@/lib/mocks';
import { LeaveDialog } from '@/components/admin/cb/leave/leave-dialog';
import { FileDown, ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    isToday
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function TimesheetPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const currentUserId = '1'; // Mock user

    const [isCheckedIn, setIsCheckedIn] = useState(true); // Demo state, user is checked in today
    // Force rebuild verification
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>();

    const handleCheckInOut = (e: React.MouseEvent) => {
        e.stopPropagation();
        const action = isCheckedIn ? "Check Out" : "Check In";
        const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        // In real app, call API here
        toast.success(`${action} thành công lúc ${time}`);
        setIsCheckedIn(!isCheckedIn);
    };

    const handleDayClick = (day: Date) => {
        // Only allow clicking on future dates or today for leave request, 
        // or past dates for viewing details (future enhancement)
        setSelectedDate(day);
        setLeaveDialogOpen(true);
    };

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const jumpToToday = () => setCurrentDate(new Date());

    // Calendar Data
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Filter Records
    const monthRecords = mockAttendanceRecords.filter(record =>
        record.employeeId === currentUserId &&
        isSameMonth(new Date(record.date), currentDate)
    );

    const getRecordForDay = (day: Date) => {
        return mockAttendanceRecords.find(r =>
            r.employeeId === currentUserId &&
            isSameDay(new Date(r.date), day)
        );
    };

    // Statistics
    const stats = {
        present: monthRecords.filter(r => r.status === 'PRESENT').length,
        late: monthRecords.filter(r => r.status === 'LATE').length,
        early: monthRecords.filter(r => r.status === 'EARLY_LEAVE').length,
        leave: monthRecords.filter(r => r.status === 'LEAVE').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Bảng chấm công</h1>
                    <p className="text-muted-foreground">Theo dõi ngày công và ca làm việc tháng {format(currentDate, 'MM/yyyy')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        className={cn(
                            "min-w-[120px]",
                            isCheckedIn ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"
                        )}
                        onClick={handleCheckInOut}
                    >
                        <Clock className="mr-2 h-4 w-4" />
                        {isCheckedIn ? "Check Out" : "Check In"}
                    </Button>
                    <Button variant="outline" onClick={jumpToToday}>Hôm nay</Button>
                    <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                        <span className="px-4 font-medium">{format(currentDate, "'Tháng' MM, yyyy", { locale: vi })}</span>
                        <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                    <Button variant="outline">
                        <FileDown className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="py-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Công chuẩn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                        <p className="text-xs text-muted-foreground">ngày</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Đi muộn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                        <p className="text-xs text-muted-foreground">lần</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Về sớm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.early}</div>
                        <p className="text-xs text-muted-foreground">lần</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Nghỉ phép</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats.leave}</div>
                        <p className="text-xs text-muted-foreground">ngày</p>
                    </CardContent>
                </Card>
            </div>

            {/* Calendar Grid */}
            <Card className="overflow-hidden">
                <div className="grid grid-cols-7 border-b bg-muted/40">
                    {['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'CN'].map((day, i) => (
                        <div key={day} className={cn("py-3 text-center text-sm font-semibold text-muted-foreground border-r last:border-r-0", i >= 5 && "text-destructive/70")}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
                    {calendarDays.map((day, dayIdx) => {
                        const record = getRecordForDay(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isSunday = day.getDay() === 0;

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => handleDayClick(day)}
                                className={cn(
                                    "relative border-r border-b p-2 transition-colors hover:bg-muted/30 flex flex-col gap-1 cursor-pointer group",
                                    !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                                    isSunday && isCurrentMonth && "bg-slate-50/50",
                                    isToday(day) && "bg-blue-50/30"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={cn(
                                        "text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center",
                                        isToday(day) && "bg-primary text-primary-foreground",
                                        !isCurrentMonth && "text-muted-foreground/50",
                                        isSunday && "text-destructive"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                    {record && (
                                        <Badge variant="outline" className={cn("text-[10px] h-5 px-1", attendanceStatusLabels[record.status].color)}>
                                            {attendanceStatusLabels[record.status].label}
                                        </Badge>
                                    )}
                                </div>

                                {record ? (
                                    <div className="mt-1 flex-1 flex flex-col gap-1 text-xs">
                                        <div className="flex items-center gap-1 text-muted-foreground" title="Ca làm việc">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span className="truncate">{record.shiftName}</span>
                                        </div>

                                        {record.status !== 'LEAVE' && record.status !== 'ABSENT' && (
                                            <div className="mt-auto space-y-1 bg-background/50 p-1 rounded border border-border/50">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">In:</span>
                                                    <span className={cn("font-medium", record.status === 'LATE' && "text-red-500")}>
                                                        {record.checkIn || '--:--'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Out:</span>
                                                    <span className={cn("font-medium", record.status === 'EARLY_LEAVE' && "text-orange-500")}>
                                                        {record.checkOut || '--:--'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {record.status === 'LEAVE' && (
                                            <div className="mt-auto p-1 bg-purple-50 text-purple-700 rounded text-[11px] italic">
                                                {record.note || 'Nghỉ phép'}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    isCurrentMonth && !isSunday && day < new Date() && (
                                        <div className="mt-auto flex justify-center group-hover:opacity-100 opacity-0 transition-opacity">
                                            <Badge variant="outline" className="text-[10px] bg-white hover:bg-purple-50 hover:text-purple-600 border-dashed cursor-pointer">+ Đơn nghỉ</Badge>
                                        </div>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <LeaveDialog
                open={leaveDialogOpen}
                onOpenChange={setLeaveDialogOpen}
                checkInDate={selectedDate}
            />
        </div>
    );
}
