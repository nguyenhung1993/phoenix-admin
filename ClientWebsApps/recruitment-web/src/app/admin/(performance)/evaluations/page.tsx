'use client';

import { useState } from 'react';
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
    mockEvaluation360s,
    mockKPIPeriods,
    evaluation360StatusLabels,
    reviewerTypeLabels,
    Evaluation360,
} from '@/lib/mocks';
import {
    Users,
    Plus,
    Eye,
    Send,
    Clock,
    CheckCircle,
    AlertCircle,
    Mail,
    MoreHorizontal,
    Filter,
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

export default function EvaluationsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
    const [selectedEval, setSelectedEval] = useState<Evaluation360 | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    // Filter evaluations by period
    const filteredEvaluations = selectedPeriod === 'all'
        ? mockEvaluation360s
        : mockEvaluation360s.filter(e => e.periodId === selectedPeriod);

    // Calculate review progress
    const getReviewProgress = (eval360: Evaluation360) => {
        const submitted = eval360.reviews.filter(r => r.status === 'SUBMITTED').length;
        const total = eval360.reviews.length;
        return { submitted, total, percent: total > 0 ? Math.round((submitted / total) * 100) : 0 };
    };

    const handleViewDetail = (eval360: Evaluation360) => {
        setSelectedEval(eval360);
        setDetailOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        Đánh giá 360°
                    </h1>
                    <p className="text-muted-foreground">Quản lý đánh giá đa chiều từ nhiều nguồn</p>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Lọc theo kỳ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả kỳ</SelectItem>
                            {mockKPIPeriods.map(period => (
                                <SelectItem key={period.id} value={period.id}>
                                    {period.name}
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
                                <p className="text-2xl font-bold">{filteredEvaluations.length}</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang thực hiện</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {filteredEvaluations.filter(e => e.status === 'IN_PROGRESS').length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-500/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {filteredEvaluations.filter(e => e.status === 'COMPLETED').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Chờ xử lý</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {filteredEvaluations.filter(e => e.status === 'PENDING').length}
                                </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-orange-500/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Evaluations Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách đánh giá</CardTitle>
                    <CardDescription>
                        Theo dõi tiến độ đánh giá 360° của từng nhân viên
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Kỳ đánh giá</TableHead>
                                <TableHead>Mẫu phiếu</TableHead>
                                <TableHead>Tiến độ</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Điểm</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvaluations.map((eval360) => {
                                const statusInfo = evaluation360StatusLabels[eval360.status];
                                const progress = getReviewProgress(eval360);

                                return (
                                    <TableRow key={eval360.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>
                                                        {eval360.targetEmployeeName.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{eval360.targetEmployeeName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{eval360.periodName}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{eval360.templateName}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="w-32 space-y-1">
                                                <Progress value={progress.percent} className="h-2" />
                                                <span className="text-xs text-muted-foreground">
                                                    {progress.submitted}/{progress.total} đánh giá
                                                </span>
                                            </div>
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
                                            {eval360.finalScore ? (
                                                <span className="font-bold text-lg">{eval360.finalScore}</span>
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
                                                    <DropdownMenuItem onClick={() => handleViewDetail(eval360)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Mail className="h-4 w-4 mr-2" />
                                                        Gửi nhắc nhở
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Send className="h-4 w-4 mr-2" />
                                                        Hoàn tất đánh giá
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl">
                    {selectedEval && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Đánh giá 360° - {selectedEval.targetEmployeeName}</DialogTitle>
                                <DialogDescription>
                                    {selectedEval.periodName} • {selectedEval.templateName}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <h4 className="font-semibold">Danh sách người đánh giá</h4>
                                <div className="space-y-2">
                                    {selectedEval.reviews.map((review) => {
                                        const typeInfo = reviewerTypeLabels[review.reviewerType];
                                        return (
                                            <div
                                                key={review.id}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{review.reviewerName}</div>
                                                        <Badge variant="outline" className={`text-${typeInfo.color}-700`}>
                                                            {typeInfo.label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {review.status === 'SUBMITTED' ? (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                            <span className="text-sm text-green-600">Đã nộp</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button size="sm" asChild>
                                                                <a href={`/admin/evaluations/review/${review.id}`}>
                                                                    Đánh giá
                                                                </a>
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
