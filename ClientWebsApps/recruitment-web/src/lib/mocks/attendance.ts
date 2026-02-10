
import { ShiftType } from './settings-hr';
import { mockLeaveRequests } from './leave';

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'EARLY_LEAVE' | 'ABSENT' | 'LEAVE' | 'HOLIDAY';

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string; // YYYY-MM-DD

    // Shift Info
    shiftId?: string;
    shiftName?: string;
    shiftStart?: string; // HH:mm
    shiftEnd?: string; // HH:mm

    // Actual Time
    checkIn?: string; // HH:mm
    checkOut?: string; // HH:mm

    // Status
    status: AttendanceStatus;
    minutesLate?: number;
    minutesEarly?: number;
    workHours?: number;

    note?: string;
}

export const attendanceStatusLabels: Record<AttendanceStatus, { label: string; color: string; description: string }> = {
    PRESENT: { label: 'Đúng giờ', color: 'bg-green-100 text-green-800', description: 'Có mặt đúng giờ quy định' },
    LATE: { label: 'Đi muộn', color: 'bg-yellow-100 text-yellow-800', description: 'Check-in sau giờ bắt đầu ca' },
    EARLY_LEAVE: { label: 'Về sớm', color: 'bg-orange-100 text-orange-800', description: 'Check-out trước giờ kết thúc ca' },
    ABSENT: { label: 'Vắng mặt', color: 'bg-red-100 text-red-800', description: 'Không có dữ liệu check-in/out' },
    LEAVE: { label: 'Nghỉ phép', color: 'bg-purple-100 text-purple-800', description: 'Đã được duyệt đơn nghỉ phép' },
    HOLIDAY: { label: 'Ngày lễ', color: 'bg-blue-100 text-blue-800', description: 'Nghỉ theo lịch lễ tết' },
};

// Generate mock data for the current month
const generateMockAttendance = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const employeeId = '1'; // Mock user
    const employeeName = 'Nguyễn Văn Minh';

    const today = new Date();
    // Get start and end of current month
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Helper to format date as YYYY-MM-DD
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Loop through days of the month
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday

        // 1. Check for APPROVED Leave
        // mockLeaveRequests is array of { startDate: string, endDate: string, status: string, ... }
        const leave = mockLeaveRequests.find(req =>
            req.employeeId === employeeId &&
            req.status === 'APPROVED' &&
            dateStr >= req.startDate &&
            dateStr <= req.endDate
        );

        if (leave) {
            records.push({
                id: `att-${dateStr}`,
                employeeId,
                employeeName,
                date: dateStr,
                shiftId: 'SH_ADMIN', // Assume shift is assigned but overridden by leave
                shiftName: 'Ca Hành chính',
                shiftStart: '08:00',
                shiftEnd: '17:00',
                status: 'LEAVE',
                note: leave.reason
            });
            continue;
        }

        // 2. Skip Sundays (0) for generated attendance
        if (dayOfWeek === 0) {
            continue;
        }

        // 3. Skip Future dates (if not leave)
        if (d > today) {
            continue;
        }

        // 4. Generate Random Status for Past/Present Weekdays
        const rand = Math.random();

        const isSaturday = dayOfWeek === 6;
        const shiftName = isSaturday ? 'Sáng Thứ 7' : 'Ca Hành chính';
        const shiftStart = '08:00';
        const shiftEnd = isSaturday ? '12:00' : '17:00';

        let status: AttendanceStatus = 'PRESENT';
        let checkIn: string | undefined = '07:55';
        let checkOut: string | undefined = isSaturday ? '12:05' : '17:05';
        let minutesLate = 0;
        let minutesEarly = 0;
        let workHours = isSaturday ? 4 : 8;
        let note: string | undefined = undefined;

        if (rand < 0.05) {
            status = 'ABSENT';
            checkIn = undefined;
            checkOut = undefined;
            workHours = 0;
        } else if (rand < 0.15) {
            status = 'LATE';
            checkIn = '08:15';
            minutesLate = 15;
            workHours = isSaturday ? 3.75 : 7.75;
        } else if (rand < 0.2) {
            status = 'EARLY_LEAVE';
            checkOut = isSaturday ? '11:30' : '16:30';
            minutesEarly = 30;
            workHours = isSaturday ? 3.5 : 7.5;
        } else {
            // Randomize checkIn/Out slightly for PRESENT
            const inMin = 45 + Math.floor(Math.random() * 15); // 07:45 - 08:00
            const outMin = Math.floor(Math.random() * 30); // 17:00 - 17:30 or 12:00 - 12:30
            checkIn = `07:${inMin}`;
            checkOut = isSaturday
                ? `12:${String(Math.floor(Math.random() * 15)).padStart(2, '0')}`
                : `17:${String(outMin).padStart(2, '0')}`;
        }

        records.push({
            id: `att-${dateStr}`,
            employeeId,
            employeeName,
            date: dateStr,
            shiftId: isSaturday ? 'SH_SAT' : 'SH_ADMIN',
            shiftName,
            shiftStart,
            shiftEnd,
            checkIn,
            checkOut,
            status,
            minutesLate,
            minutesEarly,
            workHours,
            note
        });
    }

    return records;
};

export const mockAttendanceRecords = generateMockAttendance();
