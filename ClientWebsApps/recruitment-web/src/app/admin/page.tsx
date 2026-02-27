import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, UserCheck, Clock, Timer, TrendingUp } from 'lucide-react';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getRecruitmentFunnelStats, getRecruitmentSourceStats, getHeadcountStats, getTimeToHireStats, getOfferConversionStats, getMonthlyRecruitmentTrend } from '@/lib/reports';
import { RecruitmentFunnelChart } from '@/components/charts/funnel-chart';
import { SimplePieChart } from '@/components/charts/pie-chart';
import { SimpleBarChart } from '@/components/charts/bar-chart';
import { TrendChart } from '@/components/charts/trend-chart';

export const dynamic = 'force-dynamic'; // Ensure real-time data

async function getDashboardStats() {
    const [
        activeJobs,
        totalCandidates,
        newCandidates,
        interviewCandidates,
        recentCandidates,
        funnelStats,
        sourceStats,
        headcountStats,
        timeToHireStats,
        offerConversionStats,
        monthlyTrend,
    ] = await Promise.all([
        prisma.job.count({ where: { status: 'PUBLISHED' } }),
        prisma.candidate.count(),
        prisma.candidate.count({ where: { status: 'NEW' } }),
        prisma.candidate.count({ where: { status: 'INTERVIEW' } }),
        prisma.candidate.findMany({
            take: 5,
            orderBy: { appliedDate: 'desc' },
            include: { job: true },
        }),
        getRecruitmentFunnelStats(),
        getRecruitmentSourceStats(),
        getHeadcountStats(),
        getTimeToHireStats(),
        getOfferConversionStats(),
        getMonthlyRecruitmentTrend(),
    ]);

    return {
        activeJobs,
        totalCandidates,
        newCandidates,
        interviewCandidates,
        recentCandidates,
        funnelStats,
        sourceStats,
        headcountStats,
        timeToHireStats,
        offerConversionStats,
        monthlyTrend,
    };
}

export default async function AdminDashboard() {
    const {
        activeJobs,
        totalCandidates,
        newCandidates,
        interviewCandidates,
        recentCandidates,
        funnelStats,
        sourceStats,
        headcountStats,
        timeToHireStats,
        offerConversionStats,
        monthlyTrend,
    } = await getDashboardStats();

    const stats = [
        {
            title: 'Vị trí đang tuyển',
            value: activeJobs,
            icon: Briefcase,
            color: 'text-blue-600 bg-blue-100',
        },
        {
            title: 'Tổng ứng viên',
            value: totalCandidates,
            icon: Users,
            color: 'text-purple-600 bg-purple-100',
        },
        {
            title: 'Ứng viên mới',
            value: newCandidates,
            icon: Clock,
            color: 'text-yellow-600 bg-yellow-100',
        },
        {
            title: 'Đợi phỏng vấn',
            value: interviewCandidates,
            icon: UserCheck,
            color: 'text-green-600 bg-green-100',
        },
        {
            title: 'TG tuyển TB',
            value: `${timeToHireStats.averageDays} ngày`,
            icon: Timer,
            color: 'text-orange-600 bg-orange-100',
            description: `${timeToHireStats.totalHired} người đã tuyển`,
        },
        {
            title: 'Tỷ lệ offer thành công',
            value: `${offerConversionStats.acceptanceRate}%`,
            icon: TrendingUp,
            color: 'text-emerald-600 bg-emerald-100',
            description: `${offerConversionStats.accepted}/${offerConversionStats.total} offers`,
        },
    ];

    // Transform source stats for Pie Chart
    const sourceChartData = sourceStats.map(s => ({
        name: s.label,
        value: s.count,
        fill: s.fill,
    }));

    // Transform headcount stats for Bar Chart
    const deptChartData = headcountStats.byDepartment.map(d => ({
        name: d.department,
        value: d.count,
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Tổng quan hệ thống HRM & Tuyển dụng</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    {'description' in stat && stat.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recruitment Funnel */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phễu Tuyển Dụng</CardTitle>
                        <CardDescription>Số lượng ứng viên qua từng giai đoạn</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecruitmentFunnelChart data={funnelStats} />
                    </CardContent>
                </Card>

                {/* Candidate Source */}
                <Card>
                    <CardHeader>
                        <CardTitle>Nguồn Ứng Viên</CardTitle>
                        <CardDescription>Hiệu quả các kênh tuyển dụng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SimplePieChart data={sourceChartData} />
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Recruitment Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Xu hướng Tuyển dụng theo tháng</CardTitle>
                    <CardDescription>Số lượng ứng viên, phỏng vấn và tuyển dụng trong 6 tháng gần nhất</CardDescription>
                </CardHeader>
                <CardContent>
                    <TrendChart data={monthlyTrend} />
                </CardContent>
            </Card>

            {/* HRM Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Headcount by Department */}
                <Card>
                    <CardHeader>
                        <CardTitle>Nhân sự theo Phòng ban</CardTitle>
                        <CardDescription>Phân bổ nhân sự hiện tại</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SimpleBarChart data={deptChartData} />
                    </CardContent>
                </Card>

                {/* Recent Candidates */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ứng viên gần đây</CardTitle>
                        <CardDescription>5 ứng viên nộp hồ sơ mới nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentCandidates.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">Chưa có ứng viên nào.</p>
                            ) : (
                                recentCandidates.map((candidate) => (
                                    <div key={candidate.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{candidate.name}</p>
                                            <p className="text-sm text-muted-foreground">{candidate.job?.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${candidate.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                                candidate.status === 'INTERVIEW' ? 'bg-purple-100 text-purple-800' :
                                                    candidate.status === 'OFFER' ? 'bg-green-100 text-green-800' :
                                                        candidate.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {candidate.status}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {format(new Date(candidate.appliedDate), 'dd/MM/yyyy', { locale: vi })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
