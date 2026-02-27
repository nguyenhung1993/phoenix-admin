import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    UserPlus,
    UserMinus,
    Clock,
} from 'lucide-react';
import {
    getEmployeeStats,
    getDepartmentDistribution,
    getTurnoverTrend,
    getContractDistribution,
    getUpcomingEvents,
} from '@/lib/reports';
import { DynamicBarChart, DynamicLineChart, DynamicPieChart } from '@/components/admin/reports/chart-wrappers';


export default async function DashboardPage() {
    const [stats, departmentData, turnoverData, contractData, upcomingEvents] = await Promise.all([
        getEmployeeStats(),
        getDepartmentDistribution(),
        getTurnoverTrend(),
        getContractDistribution(),
        getUpcomingEvents(),
    ]);

    const currentMonth = new Date().toLocaleString('vi-VN', { month: 'long' });

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
                        <div className="text-2xl font-bold">{stats.totalActive}</div>
                        <p className="text-xs text-muted-foreground">Đang hoạt động</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tuyển mới ({currentMonth})</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.newHiresThisMonth}</div>
                        <p className="text-xs text-muted-foreground">Trong tháng này</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nghỉ việc ({currentMonth})</CardTitle>
                        <UserMinus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resignationsThisMonth}</div>
                        <p className="text-xs text-muted-foreground">
                            Turnover: {stats.totalActive > 0 ? ((stats.resignationsThisMonth / stats.totalActive) * 100).toFixed(1) : 0}%
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang thử việc</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.probation}</div>
                        <p className="text-xs text-muted-foreground">Nhân viên thử việc</p>
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
                            {departmentData.length > 0 ? (
                                <DynamicBarChart data={departmentData} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    Chưa có dữ liệu phòng ban
                                </div>
                            )}
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
                            {contractData.length > 0 ? (
                                <DynamicPieChart data={contractData} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    Chưa có dữ liệu hợp đồng
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Sự kiện sắp tới</CardTitle>
                        <CardDescription>Hợp đồng hết hạn & Onboarding (30 ngày tới)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {upcomingEvents.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{event.title}</p>
                                            <p className="text-sm text-muted-foreground">{event.date}</p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            {event.type === 'ONBOARDING' && <Badge variant="outline" className="text-blue-500 border-blue-500">Onboarding</Badge>}
                                            {event.type === 'CONTRACT' && <Badge variant="destructive">Hết hạn HĐ</Badge>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                                Không có sự kiện nào trong 30 ngày tới
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
