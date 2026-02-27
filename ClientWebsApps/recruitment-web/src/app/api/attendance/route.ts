import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/attendance - Get attendance data for calendar view
// Combines approved leave requests to show on timesheet calendar
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
        const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

        // Get date range for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get approved leave requests that overlap with this month
        const leaveRequests = await prisma.leaveRequest.findMany({
            where: {
                status: 'APPROVED',
                startDate: { lte: endDate },
                endDate: { gte: startDate },
            },
            include: {
                employee: {
                    select: { id: true, fullName: true },
                },
            },
        });

        // Build attendance records from leave requests
        const records: any[] = [];

        leaveRequests.forEach(leave => {
            const leaveStart = new Date(leave.startDate);
            const leaveEnd = new Date(leave.endDate);

            // Generate one record per day of leave within this month
            const current = new Date(Math.max(leaveStart.getTime(), startDate.getTime()));
            const end = new Date(Math.min(leaveEnd.getTime(), endDate.getTime()));

            while (current <= end) {
                if (current.getDay() !== 0) { // Skip Sundays
                    records.push({
                        employeeId: leave.employeeId,
                        employeeName: leave.employee.fullName,
                        date: current.toISOString().split('T')[0],
                        status: 'LEAVE',
                        shiftName: 'Nghỉ phép',
                        checkIn: null,
                        checkOut: null,
                        note: leave.reason || 'Nghỉ phép',
                    });
                }
                current.setDate(current.getDate() + 1);
            }
        });

        return NextResponse.json({ data: records });
    } catch (error) {
        console.error('GET /api/attendance error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
