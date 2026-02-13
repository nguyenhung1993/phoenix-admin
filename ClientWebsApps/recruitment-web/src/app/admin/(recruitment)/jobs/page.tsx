'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    JobItem,
    jobTypeLabels,
    jobStatusLabels,
    JobStatusValues,
    type JobStatus,
} from '@/lib/schemas/recruitment';

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<JobItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter !== 'ALL') params.set('status', statusFilter);
            params.set('limit', '100');

            const res = await fetch(`/api/jobs?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch jobs');
            const data = await res.json();
            setJobs(data.data || data.jobs || data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Không thể tải danh sách vị trí tuyển dụng');
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    useEffect(() => {
        const debounce = setTimeout(fetchJobs, 300);
        return () => clearTimeout(debounce);
    }, [fetchJobs]);

    const handleDelete = async () => {
        if (!selectedJobId) return;
        try {
            setDeleting(true);
            const res = await fetch(`/api/jobs/${selectedJobId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success('Đã xóa vị trí tuyển dụng');
            setJobs(prev => prev.filter(j => j.id !== selectedJobId));
        } catch {
            toast.error('Không thể xóa vị trí tuyển dụng');
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setSelectedJobId(null);
        }
    };

    const formatSalary = (min: number | null, max: number | null) => {
        if (!min && !max) return '—';
        const fmt = (n: number) => (n / 1000000).toFixed(0) + 'M';
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `Từ ${fmt(min)}`;
        return `Đến ${fmt(max!)}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý tuyển dụng</h1>
                    <p className="text-muted-foreground">Tạo và quản lý các vị trí tuyển dụng</p>
                </div>
                <Button asChild>
                    <Link href="/admin/jobs/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm vị trí mới
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm vị trí..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả</SelectItem>
                                {JobStatusValues.map(status => (
                                    <SelectItem key={status} value={status}>
                                        {jobStatusLabels[status].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vị trí</TableHead>
                                        <TableHead>Phòng ban</TableHead>
                                        <TableHead>Loại hình</TableHead>
                                        <TableHead>Mức lương</TableHead>
                                        <TableHead>Ứng viên</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jobs.map((job) => {
                                        const statusInfo = jobStatusLabels[job.status as JobStatus] || jobStatusLabels.DRAFT;
                                        return (
                                            <TableRow key={job.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{job.title}</p>
                                                        {job.location && (
                                                            <p className="text-sm text-muted-foreground">{job.location}</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{job.department?.name || '—'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {jobTypeLabels[job.type] || job.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatSalary(job.salaryMin, job.salaryMax)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span>{job._count?.candidates ?? job.applicants}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/admin/jobs/${job.id}`}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => {
                                                                setSelectedJobId(job.id);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            {jobs.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    Không có vị trí nào phù hợp
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa vị trí này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
