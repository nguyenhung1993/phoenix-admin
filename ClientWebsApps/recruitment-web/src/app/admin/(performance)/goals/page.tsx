'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    mockKPIPeriods,
    mockKPIObjectives,
    kpiPeriodTypeLabels,
    kpiPeriodStatusLabels,
    objectiveStatusLabels,
    KPIPeriod,
    KPIObjective,
} from '@/lib/mocks';
import {
    Target,
    Plus,
    Calendar,
    Users,
    TrendingUp,
    Eye,
    Edit,
    Copy,
    MoreHorizontal,
    CheckCircle,
    Clock,
    AlertCircle,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function GoalsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<KPIPeriod | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Get objectives for selected period
    const periodObjectives = selectedPeriod
        ? mockKPIObjectives.filter(obj => obj.periodId === selectedPeriod.id)
        : [];

    // Group objectives by employee
    const objectivesByEmployee = periodObjectives.reduce((acc, obj) => {
        if (!acc[obj.employeeId]) {
            acc[obj.employeeId] = {
                employeeName: obj.employeeName,
                departmentName: obj.departmentName,
                objectives: [],
            };
        }
        acc[obj.employeeId].objectives.push(obj);
        return acc;
    }, {} as Record<string, { employeeName: string; departmentName: string; objectives: KPIObjective[] }>);

    // Calculate stats for a period
    const getPeriodStats = (periodId: string) => {
        const objectives = mockKPIObjectives.filter(obj => obj.periodId === periodId);
        const employees = new Set(objectives.map(obj => obj.employeeId)).size;
        const avgScore = objectives.length > 0
            ? Math.round(objectives.reduce((sum, obj) => sum + obj.score, 0) / objectives.length)
            : 0;
        const completedCount = objectives.filter(obj => obj.status === 'COMPLETED').length;
        return { totalObjectives: objectives.length, employees, avgScore, completedCount };
    };

    // Calculate employee average score
    const getEmployeeAvgScore = (objectives: KPIObjective[]) => {
        if (objectives.length === 0) return 0;
        const weightedSum = objectives.reduce((sum, obj) => sum + (obj.score * obj.weight / 100), 0);
        return Math.round(weightedSum);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Target className="h-6 w-6 text-primary" />
                        Mục tiêu KPI
                    </h1>
                    <p className="text-muted-foreground">Quản lý kỳ đánh giá và mục tiêu KPI</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Tạo kỳ mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo kỳ đánh giá KPI mới</DialogTitle>
                            <DialogDescription>
                                Thiết lập thông tin cho kỳ đánh giá mới
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Tên kỳ</Label>
                                <Input placeholder="VD: Q4 2024" />
                            </div>
                            <div className="space-y-2">
                                <Label>Loại</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại kỳ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="QUARTERLY">Quý</SelectItem>
                                        <SelectItem value="SEMI_ANNUAL">Nửa năm</SelectItem>
                                        <SelectItem value="ANNUAL">Năm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ngày bắt đầu</Label>
                                    <Input type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ngày kết thúc</Label>
                                    <Input type="date" />
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => setIsCreateOpen(false)}>
                                Tạo kỳ đánh giá
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Period Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockKPIPeriods.map((period) => {
                    const stats = getPeriodStats(period.id);
                    const statusInfo = kpiPeriodStatusLabels[period.status];
                    const typeInfo = kpiPeriodTypeLabels[period.type];
                    const isSelected = selectedPeriod?.id === period.id;

                    return (
                        <Card
                            key={period.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''
                                }`}
                            onClick={() => setSelectedPeriod(isSelected ? null : period)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-700 border-${statusInfo.color}-200`}
                                    >
                                        {statusInfo.label}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Xem chi tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Chỉnh sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Copy className="h-4 w-4 mr-2" />
                                                Nhân bản
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="text-lg">{period.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(period.startDate).toLocaleDateString('vi-VN')} - {new Date(period.endDate).toLocaleDateString('vi-VN')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Users className="h-3 w-3" />
                                        {stats.employees} nhân viên
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Target className="h-3 w-3" />
                                        {stats.totalObjectives} mục tiêu
                                    </div>
                                </div>
                                {stats.totalObjectives > 0 && (
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Điểm TB</span>
                                            <span className="font-medium">{stats.avgScore}%</span>
                                        </div>
                                        <Progress value={stats.avgScore} className="h-2" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Selected Period Details */}
            {selectedPeriod && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Chi tiết: {selectedPeriod.name}</CardTitle>
                                <CardDescription>
                                    Danh sách mục tiêu KPI theo nhân viên
                                </CardDescription>
                            </div>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm mục tiêu
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(objectivesByEmployee).length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Chưa có mục tiêu nào trong kỳ này</p>
                                <Button variant="outline" className="mt-4">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm mục tiêu đầu tiên
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(objectivesByEmployee).map(([employeeId, data]) => {
                                    const avgScore = getEmployeeAvgScore(data.objectives);
                                    return (
                                        <div key={employeeId} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="font-semibold">{data.employeeName}</h3>
                                                    <p className="text-sm text-muted-foreground">{data.departmentName}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold">{avgScore}%</div>
                                                    <div className="text-xs text-muted-foreground">Điểm tổng hợp</div>
                                                </div>
                                            </div>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Mục tiêu</TableHead>
                                                        <TableHead className="w-[100px]">Trọng số</TableHead>
                                                        <TableHead className="w-[150px]">Tiến độ</TableHead>
                                                        <TableHead className="w-[100px]">Trạng thái</TableHead>
                                                        <TableHead className="w-[80px]">Điểm</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data.objectives.map((obj) => {
                                                        const statusInfo = objectiveStatusLabels[obj.status];
                                                        const progress = Math.round((obj.actualValue / obj.targetValue) * 100);
                                                        return (
                                                            <TableRow key={obj.id}>
                                                                <TableCell>
                                                                    <div>
                                                                        <div className="font-medium">{obj.title}</div>
                                                                        <div className="text-xs text-muted-foreground">
                                                                            {obj.actualValue.toLocaleString()} / {obj.targetValue.toLocaleString()} {obj.unit}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline">{obj.weight}%</Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="space-y-1">
                                                                        <Progress value={progress} className="h-2" />
                                                                        <span className="text-xs text-muted-foreground">{progress}%</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-700`}
                                                                    >
                                                                        {obj.status === 'COMPLETED' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                                        {obj.status === 'IN_PROGRESS' && <Clock className="h-3 w-3 mr-1" />}
                                                                        {obj.status === 'NOT_STARTED' && <AlertCircle className="h-3 w-3 mr-1" />}
                                                                        {statusInfo.label}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className={`font-bold ${obj.score >= 80 ? 'text-green-600' :
                                                                            obj.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                                        }`}>
                                                                        {obj.score}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Empty state when no period selected */}
            {!selectedPeriod && (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold mb-2">Chọn một kỳ đánh giá</h3>
                        <p className="text-muted-foreground">
                            Click vào một kỳ đánh giá ở trên để xem chi tiết các mục tiêu KPI
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
