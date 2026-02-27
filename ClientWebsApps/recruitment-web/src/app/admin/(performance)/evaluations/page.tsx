'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Users,
    Plus,
    Eye,
    Clock,
    CheckCircle,
    AlertCircle,
    MoreHorizontal,
    Filter,
    Loader2,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const evalStatusLabels: Record<string, { label: string; color: string }> = {
    DRAFT: { label: 'Nháp', color: 'gray' },
    SUBMITTED: { label: 'Đã gửi', color: 'blue' },
    REVIEWED: { label: 'Đã xem', color: 'orange' },
    APPROVED: { label: 'Hoàn thành', color: 'green' },
};

interface EvaluationItem {
    id: string;
    reviewCycleId: string;
    reviewCycleName: string;
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    departmentName: string;
    reviewerName: string | null;
    status: string;
    selfScore: number | null;
    managerScore: number | null;
    finalScore: number | null;
    kpiResults: any;
    strengths: string | null;
    weaknesses: string | null;
    developmentPlan: string | null;
    submittedAt: string | null;
    reviewedAt: string | null;
}

interface ReviewCycleOption {
    id: string;
    name: string;
}

export default function EvaluationsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
    const [selectedEval, setSelectedEval] = useState<EvaluationItem | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
    const [reviewCycles, setReviewCycles] = useState<ReviewCycleOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [evalRes, cycleRes] = await Promise.all([
                    fetch('/api/evaluations'),
                    fetch('/api/reviews'),
                ]);
                const evalJson = await evalRes.json();
                const cycleJson = await cycleRes.json();
                setEvaluations(evalJson.data || []);
                setReviewCycles((cycleJson.data || []).map((c: any) => ({ id: c.id, name: c.name })));
            } catch {
                setEvaluations([]);
                setReviewCycles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEvaluations = selectedPeriod === 'all'
        ? evaluations
        : evaluations.filter(e => e.reviewCycleId === selectedPeriod);

    const handleViewDetail = (ev: EvaluationItem) => {
        setSelectedEval(ev);
        setDetailOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
        );
    }

    const stats = {
        total: filteredEvaluations.length,
        draft: filteredEvaluations.filter(e => e.status === 'DRAFT').length,
        submitted: filteredEvaluations.filter(e => e.status === 'SUBMITTED').length,
        approved: filteredEvaluations.filter(e => e.status === 'APPROVED').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        Đánh giá nhân viên
                    </h1>
                    <p className="text-muted-foreground">Quản lý đánh giá năng lực nhân viên</p>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Lọc theo kỳ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả kỳ</SelectItem>
                            {reviewCycles.map(cycle => (
                                <SelectItem key={cycle.id} value={cycle.id}>
                                    {cycle.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo đánh giá mới
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng số</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang soạn</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.draft}</p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-500/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đã gửi</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.submitted}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-orange-500/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Evaluations Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách đánh giá</CardTitle>
                    <CardDescription>Theo dõi tiến độ đánh giá nhân viên</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Kỳ đánh giá</TableHead>
                                <TableHead>Người đánh giá</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Điểm</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvaluations.map((ev) => {
                                const statusInfo = evalStatusLabels[ev.status] || { label: ev.status, color: 'gray' };
                                return (
                                    <TableRow key={ev.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>
                                                        {ev.employeeName.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <span className="font-medium">{ev.employeeName}</span>
                                                    <div className="text-xs text-muted-foreground">{ev.departmentName}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{ev.reviewCycleName}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {ev.reviewerName || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-700`}
                                            >
                                                {statusInfo.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {ev.finalScore ? (
                                                <span className="font-bold text-lg">{ev.finalScore}</span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewDetail(ev)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    {filteredEvaluations.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">Không có đánh giá nào</div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl">
                    {selectedEval && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Đánh giá - {selectedEval.employeeName}</DialogTitle>
                                <DialogDescription>
                                    {selectedEval.reviewCycleName}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nhân viên</p>
                                        <p className="font-medium">{selectedEval.employeeName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phòng ban</p>
                                        <p className="font-medium">{selectedEval.departmentName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Người đánh giá</p>
                                        <p className="font-medium">{selectedEval.reviewerName || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                                        <Badge>{evalStatusLabels[selectedEval.status]?.label || selectedEval.status}</Badge>
                                    </div>
                                </div>
                                {selectedEval.finalScore !== null && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Điểm tổng kết</p>
                                        <p className="text-3xl font-bold">{selectedEval.finalScore}</p>
                                    </div>
                                )}
                                {selectedEval.strengths && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Điểm mạnh</p>
                                        <p className="font-medium">{selectedEval.strengths}</p>
                                    </div>
                                )}
                                {selectedEval.weaknesses && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Điểm cần cải thiện</p>
                                        <p className="font-medium">{selectedEval.weaknesses}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
