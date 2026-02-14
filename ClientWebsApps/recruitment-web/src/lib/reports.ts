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
        return {
            department: dept.name,
            count: found?._count.id || 0,
        };
    });

    const statusData = byStatus.map(s => ({
        status: s.status,
        count: s._count.id,
    }));

    return {
        byDepartment: departmentData,
        byStatus: statusData,
    };
}
