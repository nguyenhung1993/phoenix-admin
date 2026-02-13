'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, LayoutGrid, List, Loader2, Mail, Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { KanbanBoard } from './kanban-board';
import {
    CandidateItem,
    CandidateStatus,
    CandidateStatusValues,
    candidateStatusLabels,
    candidateSourceLabels,
    type CandidateActivity,
    type CandidateSource,
} from '@/lib/schemas/recruitment';
import { formatDate } from '@/lib/utils';


export default function AdminCandidatesPage() {
    const [candidates, setCandidates] = useState<CandidateItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [viewMode, setViewMode] = useState<'LIST' | 'KANBAN'>('KANBAN');
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [candidateDetail, setCandidateDetail] = useState<CandidateItem | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchCandidates = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter !== 'ALL') params.set('status', statusFilter);
            params.set('limit', '200');

            const res = await fetch(`/api/candidates?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch candidates');
            const data = await res.json();
            setCandidates(data.data || data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            toast.error('Không thể tải danh sách ứng viên');
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    useEffect(() => {
        const debounce = setTimeout(fetchCandidates, 300);
        return () => clearTimeout(debounce);
    }, [fetchCandidates]);

    const handleStatusChange = async (candidateId: string, newStatus: CandidateStatus) => {
        try {
            const res = await fetch(`/api/candidates/${candidateId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error('Failed to update status');

            // Optimistic update
            setCandidates(prev =>
                prev.map(c =>
                    c.id === candidateId ? { ...c, status: newStatus } : c
                )
            );

            const statusLabel = candidateStatusLabels[newStatus]?.label || newStatus;
            toast.success(`Đã chuyển sang "${statusLabel}"`);
        } catch {
            toast.error('Không thể cập nhật trạng thái');
            // Revert by refetching
            fetchCandidates();
        }
    };

    const handleCandidateClick = async (candidate: CandidateItem) => {
        setSelectedCandidate(candidate);
        setDetailDialogOpen(true);
        setCandidateDetail(null);

        // Fetch full detail with activities
        try {
            setLoadingDetail(true);
            const res = await fetch(`/api/candidates/${candidate.id}`);
            if (res.ok) {
                const data = await res.json();
                setCandidateDetail(data);
            }
        } catch {
            // Silent fail, detail dialog still shows basic info
        } finally {
            setLoadingDetail(false);
        }
    };

    const filteredCandidates = candidates;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý ứng viên</h1>
                    <p className="text-muted-foreground">Theo dõi và quản lý quy trình tuyển dụng</p>
                </div>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'LIST' | 'KANBAN')}>
                    <TabsList>
                        <TabsTrigger value="KANBAN">
                            <LayoutGrid className="h-4 w-4 mr-2" />
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger value="LIST">
                            <List className="h-4 w-4 mr-2" />
                            Danh sách
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm ứng viên..."
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
                        {CandidateStatusValues.map(status => (
                            <SelectItem key={status} value={status}>
                                {candidateStatusLabels[status].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : viewMode === 'KANBAN' ? (
                <KanbanBoard
                    candidates={filteredCandidates}
                    onStatusChange={handleStatusChange}
                    onCandidateClick={handleCandidateClick}
                />
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ứng viên</TableHead>
                                    <TableHead>Vị trí</TableHead>
                                    <TableHead>Nguồn</TableHead>
                                    <TableHead>Ngày nộp</TableHead>
                                    <TableHead>Đánh giá</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCandidates.map((candidate) => {
                                    const statusInfo = candidateStatusLabels[candidate.status] || candidateStatusLabels.NEW;
                                    return (
                                        <TableRow
                                            key={candidate.id}
                                            className="cursor-pointer"
                                            onClick={() => handleCandidateClick(candidate)}
                                        >
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{candidate.name}</p>
                                                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{candidate.job?.title || '—'}</TableCell>
                                            <TableCell>
                                                {candidateSourceLabels[candidate.source as CandidateSource] || candidate.source}
                                            </TableCell>
                                            <TableCell>{formatDate(candidate.appliedAt)}</TableCell>
                                            <TableCell>
                                                {candidate.rating ? (
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div key={i} className={`h-1.5 w-4 rounded-full ${i < candidate.rating! ? 'bg-yellow-400' : 'bg-muted'}`} />
                                                        ))}
                                                    </div>
                                                ) : '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        {filteredCandidates.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                Không có ứng viên nào
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Candidate Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedCandidate?.name || 'Chi tiết ứng viên'}</DialogTitle>
                    </DialogHeader>

                    {selectedCandidate && (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Email</p>
                                    <p className="flex items-center gap-1">
                                        <Mail className="h-3.5 w-3.5" />
                                        {selectedCandidate.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Điện thoại</p>
                                    <p>{selectedCandidate.phone || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Vị trí ứng tuyển</p>
                                    <p>{selectedCandidate.job?.title || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Ngày ứng tuyển</p>
                                    <p className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatDate(selectedCandidate.appliedAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Nguồn</p>
                                    <p>{candidateSourceLabels[selectedCandidate.source as CandidateSource] || selectedCandidate.source}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Trạng thái</p>
                                    <Badge variant={candidateStatusLabels[selectedCandidate.status]?.variant || 'default'}>
                                        {candidateStatusLabels[selectedCandidate.status]?.label || selectedCandidate.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Rating */}
                            {selectedCandidate.rating && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Đánh giá</p>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`h-2 w-6 rounded-full ${i < selectedCandidate.rating! ? 'bg-yellow-400' : 'bg-muted'}`} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CV Link */}
                            {selectedCandidate.cvUrl && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">CV</p>
                                    <a href={selectedCandidate.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Xem CV
                                    </a>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedCandidate.notes && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                                    <p className="text-sm bg-muted/50 p-3 rounded-md">{selectedCandidate.notes}</p>
                                </div>
                            )}

                            {/* Activity Timeline */}
                            <div>
                                <p className="font-medium mb-3">Lịch sử hoạt động</p>
                                {loadingDetail ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                ) : candidateDetail?.activities && candidateDetail.activities.length > 0 ? (
                                    <div className="space-y-3">
                                        {candidateDetail.activities.map((activity: CandidateActivity) => (
                                            <div key={activity.id} className="flex gap-3 text-sm">
                                                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{activity.title}</p>
                                                    <p className="text-muted-foreground">{activity.content}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatDate(activity.createdAt)}
                                                        {activity.createdBy && ` • ${activity.createdBy}`}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Chưa có hoạt động nào</p>
                                )}
                            </div>

                            {/* Status Change Actions */}
                            <div>
                                <p className="font-medium mb-2">Chuyển trạng thái</p>
                                <div className="flex flex-wrap gap-2">
                                    {CandidateStatusValues.filter(s => s !== selectedCandidate.status).map(status => (
                                        <Button
                                            key={status}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                handleStatusChange(selectedCandidate.id, status);
                                                setSelectedCandidate(prev => prev ? { ...prev, status } : null);
                                            }}
                                        >
                                            {candidateStatusLabels[status].label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
