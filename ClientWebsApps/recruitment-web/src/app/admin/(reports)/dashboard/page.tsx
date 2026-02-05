'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

// Mock data for dashboard
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

const trendData = [
    { month: 'T1', hired: 8, resigned: 2 },
    { month: 'T2', hired: 5, resigned: 1 },
    { month: 'T3', hired: 10, resigned: 3 },
    { month: 'T4', hired: 7, resigned: 2 },
    { month: 'T5', hired: 12, resigned: 4 },
    { month: 'T6', hired: 9, resigned: 2 },
    { month: 'T7', hired: 6, resigned: 1 },
    { month: 'T8', hired: 11, resigned: 3 },
    { month: 'T9', hired: 8, resigned: 2 },
    { month: 'T10', hired: 14, resigned: 5 },
    { month: 'T11', hired: 10, resigned: 3 },
    { month: 'T12', hired: 12, resigned: 3 },
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

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Dashboard Quản trị
                </h1>
                <p className="text-muted-foreground">Tổng quan nhân sự và hiệu suất</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng nhân viên</p>
                                <p className="text-3xl font-bold">{stats.totalEmployees}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tuyển mới tháng này</p>
                                <p className="text-3xl font-bold text-green-600">{stats.newHires}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +20% so với tháng trước
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Nghỉ việc</p>
                                <p className="text-3xl font-bold text-red-600">{stats.resignations}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <UserMinus className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            -25% so với tháng trước
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang thử việc</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.onProbation}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Nhân sự theo phòng ban
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="employees" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Performance Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Phân bố xếp loại KPI
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={performanceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ value }) => `${value}`}
                                >
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Hiring Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Xu hướng tuyển dụng 12 tháng</CardTitle>
                    <CardDescription>So sánh số lượng tuyển mới và nghỉ việc</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="hired"
                                name="Tuyển mới"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={{ fill: '#22c55e' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="resigned"
                                name="Nghỉ việc"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ fill: '#ef4444' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Top & Bottom Performers */}
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
