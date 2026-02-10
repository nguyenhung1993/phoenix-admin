'use client';

import { useState } from 'react';
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
import { Plus, Search, Edit, ArrowRight, Calendar, Users } from 'lucide-react';
import { mockReviewCycles, ReviewCycle, reviewStatusLabels } from '@/lib/mocks/performance';
import { ReviewCycleDialog } from '@/components/admin/performance/review-cycle-dialog';
import Link from 'next/link';

export default function ReviewsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cycleToEdit, setCycleToEdit] = useState<ReviewCycle | null>(null);

    const filteredCycles = mockReviewCycles.filter(cycle => {
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
                        {filteredCycles.map((cycle) => (
                            <TableRow key={cycle.id}>
                                <TableCell className="font-medium">{cycle.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="mr-2 h-3 w-3" />
                                        {cycle.startDate} - {cycle.endDate}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{cycle.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Users className="mr-2 h-3 w-3 text-muted-foreground" />
                                        {cycle.participants}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={reviewStatusLabels[cycle.status].variant}>
                                        {reviewStatusLabels[cycle.status].label}
                                    </Badge>
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
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ReviewCycleDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                cycleToEdit={cycleToEdit}
            />
        </div>
    );
}
