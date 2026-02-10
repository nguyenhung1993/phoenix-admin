'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Users,
    UserPlus,
    UserMinus,
    Clock,
    TrendingUp,
    TrendingDown,
    Building2,
    Award,
    AlertTriangle,
} from 'lucide-react';

// Dynamically import charts with loading skeletons
// We use the wrapper components which re-export Recharts components with ResponsiveContainer
const DynamicBarChart = dynamic(() => import('@/components/admin/reports/charts').then(mod => mod.DynamicBarChart), {
    loading: () => <Skeleton className="w-full h-[300px]" />,
    ssr: false
});

const DynamicLineChart = dynamic(() => import('@/components/admin/reports/charts').then(mod => mod.DynamicLineChart), {
    loading: () => <Skeleton className="w-full h-[300px]" />,
    ssr: false
});

const DynamicPieChart = dynamic(() => import('@/components/admin/reports/charts').then(mod => mod.DynamicPieChart), {
    loading: () => <Skeleton className="w-full h-[300px]" />,
    ssr: false
});

// Mock data
const stats = {
    totalEmployees: 156,
    newHires: 12,
    resignations: 3,
    onProbation: 8,
};

const departmentData = [
    { name: 'Kinh doanh', employees: 45 },
    { name: 'Kỹ thuật', employees: 38 },
    { name: 'Nhân sự', employees: 12 },
    { name: 'Tài chính', employees: 18 },
    { name: 'Marketing', employees: 22 },
    { name: 'Vận hành', employees: 21 },
];

const turnoverData = [
    { month: 'T1', hired: 4, resigned: 0 },
    { month: 'T2', hired: 3, resigned: 1 },
    { month: 'T3', hired: 5, resigned: 0 },
    { month: 'T4', hired: 8, resigned: 2 },
    { month: 'T5', hired: 6, resigned: 1 },
    { month: 'T6', hired: 12, resigned: 3 },
];

const contractData = [
    { name: 'Chính thức', value: 120 },
    { name: 'Thử việc', value: 15 },
    { name: 'Thực tập', value: 10 },
    { name: 'Freelance', value: 11 },
];

const performanceData = [
    { name: 'Xuất sắc (A)', value: 25, color: '#22c55e' },
    { name: 'Tốt (B)', value: 68, color: '#3b82f6' },
    { name: 'Đạt (C)', value: 45, color: '#eab308' },
    { name: 'Cần cải thiện (D)', value: 18, color: '#ef4444' },
];

const topPerformers = [
    { name: 'Trần Thị B', department: 'Nhân sự', score: 95, ranking: 'A' },
    { name: 'Nguyễn Văn H', department: 'Kỹ thuật', score: 93, ranking: 'A' },
    { name: 'Lê Thị M', department: 'Kinh doanh', score: 92, ranking: 'A' },
];

const needsImprovement = [
    { name: 'Phạm Văn K', department: 'Vận hành', score: 52, ranking: 'D' },
    { name: 'Hoàng Thị L', department: 'Marketing', score: 55, ranking: 'D' },
];

const upcomingEvents = [
    { id: 1, title: 'Đánh giá năng lực Q1', date: '2024-03-15', type: 'PERFORMANCE' },
    { id: 2, title: 'Onboarding 5 nhân viên mới', date: '2024-03-20', type: 'ONBOARDING' },
    { id: 3, title: 'Hết hạn hợp đồng: Nguyễn Văn A', date: '2024-03-25', type: 'CONTRACT' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tổng quan nhân sự</h1>
                <p className="text-muted-foreground">Dashboard quản trị và báo cáo</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                        <p className="text-xs text-muted-foreground">+2.5% so với tháng trước</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tuyển mới (T6)</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.newHires}</div>
                        <p className="text-xs text-muted-foreground">Đạt 80% kế hoạch</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nghỉ việc (T6)</CardTitle>
                        <UserMinus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resignations}</div>
                        <p className="text-xs text-muted-foreground">Turnover: 1.9%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang thử việc</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.onProbation}</div>
                        <p className="text-xs text-muted-foreground">Sắp hết hạn: 3</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Nhân sự theo phòng ban</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px]">
                            <DynamicBarChart data={departmentData} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Biến động nhân sự (6 tháng)</CardTitle>
                        <CardDescription>Tuyển dụng vs Nghỉ việc</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <DynamicLineChart data={turnoverData} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Cơ cấu hợp đồng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <DynamicPieChart data={contractData} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Sự kiện sắp tới</CardTitle>
                        <CardDescription>Hoạt động nhân sự trong tuần</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="flex items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">{event.date}</p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {event.type === 'PERFORMANCE' && <Badge variant="default">Đánh giá</Badge>}
                                        {event.type === 'ONBOARDING' && <Badge variant="outline" className="text-blue-500 border-blue-500">Onboarding</Badge>}
                                        {event.type === 'CONTRACT' && <Badge variant="destructive">Hết hạn</Badge>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Award className="h-5 w-5" />
                            Top Performers
                        </CardTitle>
                        <CardDescription>Nhân viên có điểm KPI cao nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topPerformers.map((person, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{person.name}</div>
                                            <div className="text-sm text-muted-foreground">{person.department}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className="bg-green-500">{person.ranking}</Badge>
                                        <div className="text-sm font-medium mt-1">{person.score} điểm</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-5 w-5" />
                            Cần cải thiện
                        </CardTitle>
                        <CardDescription>Nhân viên cần kế hoạch phát triển</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {needsImprovement.map((person, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{person.name}</div>
                                            <div className="text-sm text-muted-foreground">{person.department}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="destructive">{person.ranking}</Badge>
                                        <div className="text-sm font-medium mt-1">{person.score} điểm</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
