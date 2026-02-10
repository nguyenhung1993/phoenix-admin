'use client';

import { useState } from 'react';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockCandidates, candidateStatusLabels, Candidate, CandidateStatus, formatDate } from '@/lib/mocks';
import { Search, Download, Eye, Mail, Phone, Star, UserPlus, History as HistoryIcon } from 'lucide-react';

import { KanbanBoard } from './kanban-board';
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import { toast } from 'sonner';

import { EmailComposeDialog } from '@/components/admin/recruitment/email-compose-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminCandidatesPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [viewMode, setViewMode] = useState<'LIST' | 'KANBAN'>('KANBAN');
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);

    // Simulating local state mutation for drag and drop
    const [localCandidates, setLocalCandidates] = useState<Candidate[]>(mockCandidates);

    const filteredCandidates = localCandidates.filter((candidate) => {
        const matchesSearch =
            candidate.name.toLowerCase().includes(search.toLowerCase()) ||
            candidate.email.toLowerCase().includes(search.toLowerCase()) ||
            candidate.jobTitle.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || candidate.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const candidatesByStatus = {
        ALL: localCandidates.length,
        NEW: localCandidates.filter((c) => c.status === 'NEW').length,
        SCREENING: localCandidates.filter((c) => c.status === 'SCREENING').length,
        INTERVIEW: localCandidates.filter((c) => c.status === 'INTERVIEW').length,
        OFFER: localCandidates.filter((c) => c.status === 'OFFER').length,
        HIRED: localCandidates.filter((c) => c.status === 'HIRED').length,
        REJECTED: localCandidates.filter((c) => c.status === 'REJECTED').length,
    };

    const handleStatusChange = (candidateId: string, newStatus: string) => {
        // Optimistic update
        setLocalCandidates(prev => prev.map(c =>
            c.id === candidateId ?
                {
                    ...c,
                    status: newStatus as any,
                    activities: [
                        ...(c.activities || []),
                        {
                            id: Math.random().toString(),
                            type: 'STATUS_CHANGE',
                            title: 'Thay đổi trạng thái',
                            content: `Trạng thái chuyển sang: ${candidateStatusLabels[newStatus as CandidateStatus].label}`,
                            createdAt: new Date().toISOString(),
                            createdBy: 'Admin'
                        }
                    ]
                } : c
        ));
        toast.success(`Đã cập nhật trạng thái: ${candidateStatusLabels[newStatus as CandidateStatus].label}`);
    };

    const handleSendEmail = (subject: string, content: string) => {
        if (!selectedCandidate) return;

        setLocalCandidates(prev => prev.map(c =>
            c.id === selectedCandidate.id ?
                {
                    ...c,
                    activities: [
                        ...(c.activities || []),
                        {
                            id: Math.random().toString(),
                            type: 'EMAIL',
                            title: `Gửi email: ${subject}`,
                            content: content,
                            createdAt: new Date().toISOString(),
                            createdBy: 'Admin'
                        }
                    ]
                } : c
        ));
    };

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý ứng viên</h1>
                    <p className="text-muted-foreground">Xem và quản lý hồ sơ ứng viên</p>
                </div>
                <div className="flex gap-2 bg-muted p-1 rounded-lg">
                    <Button
                        variant={viewMode === 'LIST' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('LIST')}
                        className="h-8 w-8 p-0"
                    >
                        <ListIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'KANBAN' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('KANBAN')}
                        className="h-8 w-8 p-0"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Status Tabs - Only for List View */}
            {viewMode === 'LIST' && (
                <Tabs defaultValue="ALL" onValueChange={setStatusFilter}>
                    <TabsList className="flex-wrap h-auto gap-2">
                        {(Object.keys(candidateStatusLabels) as CandidateStatus[]).map((status) => (
                            <TabsTrigger key={status} value={status} className="gap-2">
                                {candidateStatusLabels[status].label}
                                <Badge variant="secondary">
                                    {localCandidates.filter(c => c.status === status).length}
                                </Badge>
                            </TabsTrigger>
                        ))}
                        <TabsTrigger value="ALL" className="gap-2">
                            Tất cả <Badge variant="secondary">{candidatesByStatus.ALL}</Badge>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            )}

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
            </div>

            {viewMode === 'LIST' ? (
                <Card className="flex-1 overflow-auto">
                    <CardHeader className="py-4">
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ứng viên</TableHead>
                                    <TableHead>Vị trí ứng tuyển</TableHead>
                                    <TableHead>Nguồn</TableHead>
                                    <TableHead>Ngày nộp</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCandidates.map((candidate) => {
                                    const statusStyle = candidateStatusLabels[candidate.status];
                                    return (
                                        <TableRow key={candidate.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{candidate.name}</p>
                                                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{candidate.jobTitle}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{candidate.source}</Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(candidate.appliedDate)}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelectedCandidate(candidate);
                                                            setDetailDialogOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {filteredCandidates.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                Không có ứng viên nào phù hợp
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : null}
            {/* Kanban View */}
            {viewMode === 'KANBAN' && (
                <div className="flex-1 relative min-h-0 rounded-lg border bg-muted/20">
                    <div className="absolute inset-0 p-4">
                        <KanbanBoard
                            candidates={filteredCandidates}
                            onStatusChange={handleStatusChange}
                            onCandidateClick={(candidate) => {
                                setSelectedCandidate(candidate);
                                setDetailDialogOpen(true);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Candidate Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-[1200px] h-[90vh] flex flex-col p-0 gap-0">
                    {selectedCandidate && (
                        <>
                            <DialogHeader className="p-6 pb-4 border-b shrink-0">
                                <div className="flex flex-col gap-1 pr-8">
                                    <DialogTitle className="text-2xl">{selectedCandidate.name}</DialogTitle>
                                    <DialogDescription>
                                        Ứng tuyển: <span className="font-medium text-foreground">{selectedCandidate.jobTitle}</span>
                                    </DialogDescription>
                                </div>
                            </DialogHeader>

                            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                                {/* Sidebar Info */}
                                <div className="w-full md:w-[300px] bg-muted/20 p-6 border-r space-y-6 overflow-y-auto shrink-0">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Mail className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs text-muted-foreground">Email</p>
                                                <a href={`mailto:${selectedCandidate.email}`} className="text-sm font-medium hover:underline truncate block" title={selectedCandidate.email}>
                                                    {selectedCandidate.email}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Phone className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Điện thoại</p>
                                                <a href={`tel:${selectedCandidate.phone}`} className="text-sm font-medium hover:underline">
                                                    {selectedCandidate.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Trạng thái</p>
                                            <Badge variant={candidateStatusLabels[selectedCandidate.status].variant} className="px-3 py-1">
                                                {candidateStatusLabels[selectedCandidate.status].label}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Ngày nộp</p>
                                            <p className="font-medium text-sm">{formatDate(selectedCandidate.appliedDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Nguồn</p>
                                            <p className="font-medium text-sm">{selectedCandidate.source}</p>
                                        </div>
                                        {selectedCandidate.rating && (
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Đánh giá</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < selectedCandidate.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button variant="outline" className="w-full" asChild>
                                            <a href={selectedCandidate.cvUrl} target="_blank" rel="noopener noreferrer">
                                                <Download className="mr-2 h-4 w-4" />
                                                Tải CV / Hồ sơ
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                {/* Main Content Tabs */}
                                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                                    <Tabs defaultValue="history" className="flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <TabsList>
                                                <TabsTrigger value="history">Lịch sử hoạt động</TabsTrigger>
                                                <TabsTrigger value="notes">Ghi chú & Đánh giá</TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="history" className="flex-1 overflow-hidden mt-0">
                                            <ScrollArea className="h-full pr-4">
                                                {selectedCandidate.activities && selectedCandidate.activities.length > 0 ? (
                                                    <div className="space-y-6 pl-2">
                                                        {[...selectedCandidate.activities].reverse().map((activity, index) => (
                                                            <div key={activity.id} className="relative pl-6 pb-6 border-l last:border-0 last:pb-0">
                                                                {/* Timeline dot */}
                                                                <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-background 
                                                                    ${activity.type === 'EMAIL' ? 'bg-blue-500' :
                                                                        activity.type === 'STATUS_CHANGE' ? 'bg-orange-500' : 'bg-gray-400'}`}
                                                                />

                                                                <div className="flex flex-col gap-1 -mt-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-semibold text-sm">{activity.title}</span>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {new Date(activity.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-sm text-foreground/90 bg-muted/30 p-3 rounded-md mt-1">
                                                                        {activity.content}
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        Thực hiện bởi: <span className="font-medium">{activity.createdBy}</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                                                        <HistoryIcon className="h-12 w-12 mb-2 opacity-20" />
                                                        <p>Chưa có lịch sử hoạt động</p>
                                                    </div>
                                                )}
                                            </ScrollArea>
                                        </TabsContent>

                                        <TabsContent value="notes" className="mt-0 h-full">
                                            <div className="bg-muted/30 p-4 rounded-lg h-full border">
                                                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                                    {selectedCandidate.notes || 'Chưa có ghi chú nào cho ứng viên này.'}
                                                </p>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>

                            <DialogFooter className="p-4 border-t bg-muted/10 shrink-0 gap-2 sm:gap-2">
                                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
                                <div className="flex gap-2 ml-auto">
                                    <Button
                                        variant="outline"
                                        onClick={() => setEmailDialogOpen(true)}
                                        className="gap-2"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Gửi Email
                                    </Button>
                                    {(selectedCandidate.status === 'OFFER' || selectedCandidate.status === 'HIRED') && (
                                        <Button
                                            onClick={() => {
                                                setDetailDialogOpen(false);
                                                window.location.href = `/admin/employees?action=create&candidateId=${selectedCandidate.id}`;
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            Chuyển Staff
                                        </Button>
                                    )}
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <EmailComposeDialog
                open={emailDialogOpen}
                onOpenChange={setEmailDialogOpen}
                candidate={selectedCandidate}
                onSend={handleSendEmail}
            />
        </div>
    );
}
