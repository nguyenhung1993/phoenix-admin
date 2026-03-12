import prisma from '@/lib/prisma';
import { CandidateStatusValues, candidateStatusLabels, CandidateSourceValues, candidateSourceLabels } from '@/lib/schemas/recruitment';

export async function getRecruitmentFunnelStats() {
    const stats = await prisma.candidate.groupBy({
        by: ['status'],
        _count: { status: true },
    });

    return CandidateStatusValues.map(status => {
        const found = stats.find(s => s.status === status);
        const meta = candidateStatusLabels[status];

        let fill = '#94a3b8';
        if (status === 'NEW') fill = '#3b82f6';
        if (status === 'SCREENING') fill = '#8b5cf6';
        if (status === 'INTERVIEW') fill = '#eab308';
        if (status === 'OFFER') fill = '#f97316';
        if (status === 'HIRED') fill = '#22c55e';
        if (status === 'REJECTED') fill = '#ef4444';

        return {
            status,
            label: meta.label,
            count: found?._count.status || 0,
            fill,
        };
    });
}

export async function getRecruitmentSourceStats() {
    const stats = await prisma.candidate.groupBy({
        by: ['source'],
        _count: { source: true },
    });

    return CandidateSourceValues.map(source => {
        const found = stats.find(s => s.source === source);
        const label = candidateSourceLabels[source];

        let fill = '#94a3b8';
        if (source === 'LINKEDIN') fill = '#0a66c2';
        if (source === 'WEBSITE') fill = '#2563eb';
        if (source === 'JOB_BOARD') fill = '#ec4899';
        if (source === 'REFERRAL') fill = '#16a34a';
        if (source === 'OTHER') fill = '#64748b';

        return {
            source,
            label,
            count: found?._count.source || 0,
            fill,
        };
    });
}

export async function getHeadcountStats() {
    const [byDepartment, byStatus] = await Promise.all([
        prisma.employee.groupBy({
            by: ['departmentId'],
            _count: { id: true },
            where: { status: 'ACTIVE' }
        }),
        prisma.employee.groupBy({
            by: ['status'],
            _count: { id: true },
        }),
    ]);

    const departments = await prisma.department.findMany({
        select: { id: true, name: true }
    });

    const departmentData = departments.map(dept => {
        const found = byDepartment.find(d => d.departmentId === dept.id);
        const count = found?._count.id || 0;
        
        let shortName = dept.name;
        if (shortName.length > 20) {
            shortName = shortName.substring(0, 18) + '...';
        }

        return {
            department: shortName,
            fullDepartment: dept.name,
            count: count,
        };
    })
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count);

    const statusData = byStatus.map(s => ({
        status: s.status,
        count: s._count.id,
    }));

    return {
        byDepartment: departmentData,
        byStatus: statusData,
    };
}

export async function getTimeToHireStats() {
    // Get candidates who were hired with their applied and hired dates
    const hiredCandidates = await prisma.candidate.findMany({
        where: { status: 'HIRED' },
        select: {
            appliedDate: true,
            updatedAt: true, // updatedAt reflects when status was changed to HIRED
        },
    });

    if (hiredCandidates.length === 0) {
        return { averageDays: 0, totalHired: 0 };
    }

    const totalDays = hiredCandidates.reduce((sum, c) => {
        const applied = new Date(c.appliedDate).getTime();
        const hired = new Date(c.updatedAt).getTime();
        const diffDays = Math.max(1, Math.ceil((hired - applied) / (1000 * 60 * 60 * 24)));
        return sum + diffDays;
    }, 0);

    return {
        averageDays: Math.round(totalDays / hiredCandidates.length),
        totalHired: hiredCandidates.length,
    };
}

export async function getOfferConversionStats() {
    const offers = await prisma.offer.groupBy({
        by: ['status'],
        _count: { status: true },
    });

    const total = offers.reduce((sum, o) => sum + o._count.status, 0);
    const accepted = offers.find(o => o.status === 'ACCEPTED')?._count.status || 0;
    const rejected = offers.find(o => o.status === 'REJECTED')?._count.status || 0;
    const pending = offers.find(o => o.status === 'SENT')?._count.status || 0;

    return {
        total,
        accepted,
        rejected,
        pending,
        acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
    };
}

export async function getMonthlyRecruitmentTrend() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const candidates = await prisma.candidate.findMany({
        where: {
            appliedDate: { gte: sixMonthsAgo },
        },
        select: {
            appliedDate: true,
            status: true,
        },
    });

    // Build monthly buckets
    const months: { month: string; applied: number; interviewed: number; hired: number }[] = [];
    for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = `T${d.getMonth() + 1}/${d.getFullYear()}`;

        const monthCandidates = candidates.filter(c => {
            const cd = new Date(c.appliedDate);
            return `${cd.getFullYear()}-${String(cd.getMonth() + 1).padStart(2, '0')}` === key;
        });

        months.push({
            month: label,
            applied: monthCandidates.length,
            interviewed: monthCandidates.filter(c => ['INTERVIEW', 'OFFER', 'HIRED'].includes(c.status)).length,
            hired: monthCandidates.filter(c => c.status === 'HIRED').length,
        });
    }

    return months;
}

// ==================== HR REPORTS DASHBOARD ====================

export async function getEmployeeStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalActive, probation, newHiresThisMonth, resignationsThisMonth] = await Promise.all([
        prisma.employee.count({ where: { status: { in: ['ACTIVE', 'PROBATION', 'ON_LEAVE'] } } }),
        prisma.employee.count({ where: { status: 'PROBATION' } }),
        prisma.employee.count({
            where: {
                hireDate: { gte: startOfMonth },
                status: { in: ['ACTIVE', 'PROBATION'] },
            },
        }),
        prisma.resignationRequest.count({
            where: {
                createdAt: { gte: startOfMonth },
                status: { in: ['APPROVED', 'COMPLETED'] },
            },
        }),
    ]);

    return { totalActive, probation, newHiresThisMonth, resignationsThisMonth };
}

export async function getDepartmentDistribution() {
    const departments = await prisma.department.findMany({
        select: {
            name: true,
            _count: {
                select: {
                    employees: { where: { status: { in: ['ACTIVE', 'PROBATION'] } } },
                },
            },
        },
        orderBy: { name: 'asc' },
    });

    return departments
        .map(d => ({ name: d.name, employees: d._count.employees }))
        .filter(d => d.employees > 0);
}

export async function getTurnoverTrend() {
    const months: { month: string; hired: number; resigned: number }[] = [];

    for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
        const label = `T${d.getMonth() + 1}`;

        const [hired, resigned] = await Promise.all([
            prisma.employee.count({
                where: { hireDate: { gte: start, lte: end } },
            }),
            prisma.resignationRequest.count({
                where: {
                    lastWorkingDate: { gte: start, lte: end },
                    status: { in: ['APPROVED', 'COMPLETED'] },
                },
            }),
        ]);

        months.push({ month: label, hired, resigned });
    }

    return months;
}

export async function getContractDistribution() {
    const contractTypes = await prisma.contractType.findMany({
        where: { isActive: true },
        select: {
            name: true,
            _count: {
                select: {
                    employees: { where: { status: { in: ['ACTIVE', 'PROBATION'] } } },
                },
            },
        },
    });

    return contractTypes
        .map(ct => ({ name: ct.name, value: ct._count.employees }))
        .filter(ct => ct.value > 0);
}

export async function getUpcomingEvents() {
    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    // Contracts expiring in the next 30 days
    const expiringContracts = await prisma.contract.findMany({
        where: {
            status: 'ACTIVE',
            endDate: { gte: now, lte: thirtyDaysLater },
        },
        include: {
            employee: { select: { fullName: true } },
        },
        orderBy: { endDate: 'asc' },
        take: 5,
    });

    // Active onboarding
    const activeOnboarding = await prisma.onboarding.findMany({
        where: { status: 'IN_PROGRESS' },
        include: {
            candidate: { select: { name: true } },
        },
        orderBy: { startDate: 'desc' },
        take: 3,
    });

    const events: { id: string; title: string; date: string; type: string }[] = [];

    expiringContracts.forEach(c => {
        events.push({
            id: c.id,
            title: `Hết hạn HĐ: ${c.employee.fullName}`,
            date: c.endDate!.toISOString().split('T')[0],
            type: 'CONTRACT',
        });
    });

    activeOnboarding.forEach(o => {
        events.push({
            id: o.id,
            title: `Onboarding: ${o.candidate.name}`,
            date: o.startDate.toISOString().split('T')[0],
            type: 'ONBOARDING',
        });
    });

    // Sort by date ascending
    events.sort((a, b) => a.date.localeCompare(b.date));

    return events.slice(0, 5);
}

// ==================== ADVANCED ANALYTICS ====================

export async function getRecruitmentOverview() {
    const [totalJobs, openJobs, totalCandidates, pendingInterviews] = await Promise.all([
        prisma.job.count(),
        prisma.job.count({ where: { status: 'PUBLISHED' } }),
        prisma.candidate.count(),
        prisma.interview.count({ where: { status: 'SCHEDULED' } }),
    ]);

    return { totalJobs, openJobs, totalCandidates, pendingInterviews };
}

export async function getLeaveStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [pendingLeaves, approvedThisMonth, totalSickThisMonth] = await Promise.all([
        prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
        prisma.leaveRequest.count({
            where: { status: 'APPROVED', createdAt: { gte: startOfMonth } },
        }),
        prisma.leaveRequest.count({
            where: {
                status: 'APPROVED',
                leaveType: 'SICK',
                createdAt: { gte: startOfMonth },
            },
        }),
    ]);

    return { pendingLeaves, approvedThisMonth, totalSickThisMonth };
}

export async function getAIInsights() {
    const insights: { type: 'info' | 'warning' | 'success'; title: string; description: string }[] = [];

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // 1. Turnover spike detection
    const [resignationsThisMonth, resignationsLastMonth] = await Promise.all([
        prisma.resignationRequest.count({
            where: { createdAt: { gte: startOfMonth }, status: { in: ['APPROVED', 'COMPLETED'] } },
        }),
        prisma.resignationRequest.count({
            where: { createdAt: { gte: lastMonth, lte: endOfLastMonth }, status: { in: ['APPROVED', 'COMPLETED'] } },
        }),
    ]);

    if (resignationsThisMonth > resignationsLastMonth && resignationsThisMonth > 0) {
        insights.push({
            type: 'warning',
            title: '⚠️ Tỷ lệ nghỉ việc tăng',
            description: `Tháng này có ${resignationsThisMonth} đơn nghỉ việc (tháng trước: ${resignationsLastMonth}). Cần xem xét nguyên nhân.`,
        });
    }

    // 2. Hiring bottleneck
    const longPendingCandidates = await prisma.candidate.count({
        where: {
            status: { in: ['SCREENING', 'INTERVIEW'] },
            appliedDate: { lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
    });

    if (longPendingCandidates > 0) {
        insights.push({
            type: 'warning',
            title: '🔄 Bottleneck tuyển dụng',
            description: `${longPendingCandidates} ứng viên đang pending trên 30 ngày. Cân nhắc đẩy nhanh quy trình.`,
        });
    }

    // 3. Leave pattern
    const pendingLeaves = await prisma.leaveRequest.count({ where: { status: 'PENDING' } });
    if (pendingLeaves >= 5) {
        insights.push({
            type: 'info',
            title: '📋 Nhiều đơn nghỉ phép chờ duyệt',
            description: `Có ${pendingLeaves} đơn nghỉ phép đang chờ duyệt. Nhắc người phụ trách xử lý.`,
        });
    }

    // 4. Contracts expiring soon
    const expiringContracts = await prisma.contract.count({
        where: {
            status: 'ACTIVE',
            endDate: {
                gte: now,
                lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        },
    });

    if (expiringContracts > 0) {
        insights.push({
            type: 'warning',
            title: '📄 Hợp đồng sắp hết hạn',
            description: `${expiringContracts} hợp đồng sẽ hết hạn trong 30 ngày tới. Chuẩn bị gia hạn hoặc kết thúc.`,
        });
    }

    // 5. Positive: new hires
    const newHires = await prisma.employee.count({
        where: { hireDate: { gte: startOfMonth }, status: { in: ['ACTIVE', 'PROBATION'] } },
    });

    if (newHires > 0) {
        insights.push({
            type: 'success',
            title: '🎉 Tuyển dụng thành công',
            description: `${newHires} nhân viên mới tháng này. Đảm bảo quy trình onboarding diễn ra tốt.`,
        });
    }

    // Add a default if no insights
    if (insights.length === 0) {
        insights.push({
            type: 'success',
            title: '✅ Mọi thứ đang ổn',
            description: 'Không phát hiện vấn đề nào cần lưu ý. Tiếp tục theo dõi.',
        });
    }

    return insights;
}

