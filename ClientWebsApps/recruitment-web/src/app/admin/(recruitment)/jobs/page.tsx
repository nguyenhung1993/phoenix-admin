'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { mockJobs } from '@/lib/mocks';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    ACTIVE: { label: 'Đang tuyển', variant: 'default' },
    DRAFT: { label: 'Nháp', variant: 'secondary' },
    CLOSED: { label: 'Đã đóng', variant: 'outline' },
    EXPIRED: { label: 'Hết hạn', variant: 'destructive' },
};

const typeLabels: Record<string, string> = {
    FULLTIME: 'Toàn thời gian',
    PARTTIME: 'Bán thời gian',
    INTERNSHIP: 'Thực tập',
    CONTRACT: 'Hợp đồng',
};

export default function AdminJobsPage() {
    const [search, setSearch] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<string | null>(null);

    const filteredJobs = mockJobs.filter(
        (job) =>
            job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.department.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = () => {
        // In real app, call API to delete
        console.log('Deleting job:', selectedJob);
        setDeleteDialogOpen(false);
        setSelectedJob(null);
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
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vị trí</TableHead>
                                <TableHead>Phòng ban</TableHead>
                                <TableHead>Loại hình</TableHead>
                                <TableHead>Địa điểm</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredJobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium">{job.title}</TableCell>
                                    <TableCell>{job.department}</TableCell>
                                    <TableCell>{typeLabels[job.type]}</TableCell>
                                    <TableCell>{job.location}</TableCell>
                                    <TableCell>
                                        <Badge variant="default">Đang tuyển</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/careers/${job.id}`} target="_blank">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
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
                                                    setSelectedJob(job.id);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không có vị trí nào phù hợp
                        </div>
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
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
