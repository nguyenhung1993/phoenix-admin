'use client';

import { useState, useEffect } from 'react';
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
    Target,
    Plus,
    Calendar,
    Users,
    Eye,
    Edit,
    Copy,
    MoreHorizontal,
    Loader2,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const reviewCycleStatusLabels: Record<string, { label: string; color: string }> = {
    PLANNING: { label: 'Lên kế hoạch', color: 'gray' },
    IN_PROGRESS: { label: 'Đang diễn ra', color: 'blue' },
    COMPLETED: { label: 'Hoàn thành', color: 'green' },
    LOCKED: { label: 'Đã khóa', color: 'red' },
};

const reviewCycleTypeLabels: Record<string, string> = {
    ANNUAL: 'Hàng năm',
    BI_ANNUAL: 'Nửa năm',
    QUARTERLY: 'Hàng quý',
    PROBATION: 'Thử việc',
};

interface ReviewCycleSummary {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    type: string;
    participants: number;
}

interface EvaluationItem {
    id: string;
    reviewCycleId: string;
    employeeId: string;
    employeeName: string;
    departmentName: string;
    finalScore: number | null;
    status: string;
    kpiResults: any[];
}

export default function GoalsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<ReviewCycleSummary | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [cycles, setCycles] = useState<ReviewCycleSummary[]>([]);
    const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [cycleRes, evalRes] = await Promise.all([
                    fetch('/api/reviews'),
                    fetch('/api/evaluations'),
                ]);
                const cycleJson = await cycleRes.json();
                const evalJson = await evalRes.json();
                setCycles(cycleJson.data || []);
                setEvaluations(evalJson.data || []);
            } catch {
                setCycles([]);
                setEvaluations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Evaluations for selected period
    const periodEvaluations = selectedPeriod
        ? evaluations.filter(e => e.reviewCycleId === selectedPeriod.id)
        : [];

    // Group evaluations by employee
    const evalByEmployee = periodEvaluations.reduce((acc, ev) => {
        if (!acc[ev.employeeId]) {
            acc[ev.employeeId] = {
                employeeName: ev.employeeName,
                departmentName: ev.departmentName,
                evaluations: [],
            };
        }
        acc[ev.employeeId].evaluations.push(ev);
        return acc;
    }, {} as Record<string, { employeeName: string; departmentName: string; evaluations: EvaluationItem[] }>);

    // Period stats
    const getPeriodStats = (periodId: string) => {
        const evals = evaluations.filter(e => e.reviewCycleId === periodId);
        const employees = new Set(evals.map(e => e.employeeId)).size;
        const scores = evals.filter(e => e.finalScore !== null).map(e => e.finalScore as number);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
        const completedCount = evals.filter(e => e.status === 'APPROVED').length;
        return { totalEvals: evals.length, employees, avgScore, completedCount };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
        );
    }

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
                                        <SelectItem value="BI_ANNUAL">Nửa năm</SelectItem>
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
                {cycles.map((period) => {
                    const stats = getPeriodStats(period.id);
                    const statusInfo = reviewCycleStatusLabels[period.status] || { label: period.status, color: 'gray' };
                    const isSelected = selectedPeriod?.id === period.id;

                    return (
                        <Card
                            key={period.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setSelectedPeriod(isSelected ? null : period)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-700`}
                                    >
                                        {statusInfo.label}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Xem chi tiết</DropdownMenuItem>
                                            <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Chỉnh sửa</DropdownMenuItem>
                                            <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Nhân bản</DropdownMenuItem>
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
                                        {stats.totalEvals} đánh giá
                                    </div>
                                </div>
                                {stats.totalEvals > 0 && (
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
                                <CardDescription>Danh sách đánh giá theo nhân viên</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(evalByEmployee).length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Chưa có đánh giá nào trong kỳ này</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(evalByEmployee).map(([employeeId, data]) => (
                                    <div key={employeeId} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold">{data.employeeName}</h3>
                                                <p className="text-sm text-muted-foreground">{data.departmentName}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">
                                                    {data.evaluations[0]?.finalScore || '-'}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Điểm tổng hợp</div>
                                            </div>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Trạng thái</TableHead>
                                                    <TableHead>Người đánh giá</TableHead>
                                                    <TableHead>Điểm</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.evaluations.map(ev => (
                                                    <TableRow key={ev.id}>
                                                        <TableCell><Badge variant="outline">{ev.status}</Badge></TableCell>
                                                        <TableCell className="text-sm">{(ev as any).reviewerName || '-'}</TableCell>
                                                        <TableCell className="font-bold">{ev.finalScore || '-'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Empty state */}
            {!selectedPeriod && (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold mb-2">Chọn một kỳ đánh giá</h3>
                        <p className="text-muted-foreground">
                            Click vào một kỳ đánh giá ở trên để xem chi tiết
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
