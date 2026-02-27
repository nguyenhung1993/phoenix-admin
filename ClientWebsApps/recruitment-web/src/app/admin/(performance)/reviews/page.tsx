'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Edit, ArrowRight, Calendar, Users, Loader2 } from 'lucide-react';
import { ReviewCycleDialog } from '@/components/admin/performance/review-cycle-dialog';
import Link from 'next/link';

const reviewStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PLANNING: { label: 'Lên kế hoạch', variant: 'secondary' },
    IN_PROGRESS: { label: 'Đang diễn ra', variant: 'default' },
    COMPLETED: { label: 'Đã hoàn thành', variant: 'outline' },
    LOCKED: { label: 'Đã khóa', variant: 'destructive' },
};

const reviewTypeLabels: Record<string, string> = {
    ANNUAL: 'Hàng năm',
    BI_ANNUAL: 'Nửa năm',
    QUARTERLY: 'Hàng quý',
    PROBATION: 'Thử việc',
};

interface ReviewCycle {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    type: string;
    participants: number;
}

export default function ReviewsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cycleToEdit, setCycleToEdit] = useState<ReviewCycle | null>(null);
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCycles = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reviews');
            const json = await res.json();
            setCycles(json.data || []);
        } catch {
            setCycles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCycles(); }, []);

    const filteredCycles = cycles.filter(cycle => {
        const matchesSearch = cycle.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || cycle.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEdit = (cycle: ReviewCycle) => {
        setCycleToEdit(cycle);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setCycleToEdit(null);
        setDialogOpen(true);
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
                    <h1 className="text-2xl font-bold">Quản lý Đánh giá</h1>
                    <p className="text-muted-foreground">Tổ chức các đợt đánh giá năng lực định kỳ</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo kỳ đánh giá
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm kỳ đánh giá..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                        <SelectItem value="PLANNING">Lên kế hoạch</SelectItem>
                        <SelectItem value="IN_PROGRESS">Đang diễn ra</SelectItem>
                        <SelectItem value="COMPLETED">Đã hoàn thành</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên kỳ đánh giá</TableHead>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Loại hình</TableHead>
                            <TableHead>Số nhân sự</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCycles.map((cycle) => {
                            const statusStyle = reviewStatusLabels[cycle.status] || { label: cycle.status, variant: 'secondary' as const };
                            return (
                                <TableRow key={cycle.id}>
                                    <TableCell className="font-medium">{cycle.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="mr-2 h-3 w-3" />
                                            {new Date(cycle.startDate).toLocaleDateString('vi-VN')} - {new Date(cycle.endDate).toLocaleDateString('vi-VN')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{reviewTypeLabels[cycle.type] || cycle.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Users className="mr-2 h-3 w-3 text-muted-foreground" />
                                            {cycle.participants}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(cycle)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Link href={`/admin/reviews/${cycle.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {filteredCycles.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">Không có kỳ đánh giá nào</div>
                )}
            </div>

            <ReviewCycleDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                cycleToEdit={cycleToEdit as any}
            />
        </div>
    );
}
