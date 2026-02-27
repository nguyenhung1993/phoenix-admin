
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Calendar,
    CheckCircle2,
    XCircle,
    User,
    Loader2,
} from 'lucide-react';

const resignationStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PENDING: { label: 'Chờ duyệt', variant: 'secondary' },
    APPROVED: { label: 'Đã duyệt', variant: 'default' },
    REJECTED: { label: 'Từ chối', variant: 'destructive' },
    COMPLETED: { label: 'Hoàn thành', variant: 'outline' },
};

interface ResignationRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    managerId: string;
    managerName: string;
    reason: string;
    lastWorkingDate: string;
    status: string;
    handoverStatus: string;
    feedback: string | null;
    createdAt: string;
}

function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('vi-VN');
}

export default function ResignationPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ResignationRequest | null>(null);
    const [resignations, setResignations] = useState<ResignationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');

    // Create form
    const [newReason, setNewReason] = useState('');
    const [newLastDate, setNewLastDate] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/resignations');
            const json = await res.json();
            setResignations(json.data || []);
        } catch {
            setResignations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const pendingApprovals = resignations.filter(r => r.status === 'PENDING');
    const allRequests = resignations;

    const handleApprove = async () => {
        if (!selectedRequest) return;
        try {
            const res = await fetch('/api/resignations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedRequest.id,
                    status: 'APPROVED',
                    feedback: feedback || null,
                }),
            });
            if (res.ok) {
                setApproveDialogOpen(false);
                setFeedback('');
                toast.success('Đã duyệt đơn xin nghỉ việc.');
                fetchData();
            }
        } catch {
            toast.error('Lỗi kết nối server');
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        try {
            const res = await fetch('/api/resignations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedRequest.id,
                    status: 'REJECTED',
                    feedback: feedback || null,
                }),
            });
            if (res.ok) {
                setApproveDialogOpen(false);
                setFeedback('');
                toast.error('Đã từ chối đơn xin nghỉ việc.');
                fetchData();
            }
        } catch {
            toast.error('Lỗi kết nối server');
        }
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quyết định nghỉ việc</h1>
                    <p className="text-muted-foreground">Quản lý quy trình Offboarding</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo đơn nghỉ việc
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="all">Tất cả (HR)</TabsTrigger>
                    <TabsTrigger value="approvals" className="relative">
                        Cần duyệt
                        {pendingApprovals.length > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                                {pendingApprovals.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* ALL - HR VIEW */}
                <TabsContent value="all" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Toàn bộ đơn nghỉ việc</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nhân viên</TableHead>
                                        <TableHead>Lý do</TableHead>
                                        <TableHead>Ngày nghỉ dự kiến</TableHead>
                                        <TableHead>Người duyệt</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allRequests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Chưa có đơn xin nghỉ việc nào.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        allRequests.map((req) => (
                                            <TableRow key={req.id}>
                                                <TableCell className="font-medium">{req.employeeName}</TableCell>
                                                <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                                                <TableCell>{formatDate(req.lastWorkingDate)}</TableCell>
                                                <TableCell>{req.managerName}</TableCell>
                                                <TableCell>
                                                    <Badge variant={resignationStatusLabels[req.status]?.variant as any}>
                                                        {resignationStatusLabels[req.status]?.label}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* APPROVALS */}
                <TabsContent value="approvals" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách cần duyệt</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nhân viên</TableHead>
                                        <TableHead>Lý do</TableHead>
                                        <TableHead>Ngày nghỉ dự kiến</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingApprovals.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Không có đơn nào cần duyệt.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pendingApprovals.map((req) => (
                                            <TableRow key={req.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        {req.employeeName}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                                                <TableCell>{formatDate(req.lastWorkingDate)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">Chờ duyệt</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm" onClick={() => {
                                                        setSelectedRequest(req);
                                                        setApproveDialogOpen(true);
                                                    }}>
                                                        Xem chi tiết
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* CREATE DIALOG */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tạo đơn xin nghỉ việc</DialogTitle>
                        <DialogDescription>
                            Đơn sẽ được gửi đến quản lý trực tiếp để phê duyệt.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Ngày làm việc cuối cùng (Dự kiến)</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="date"
                                    className="pl-9"
                                    value={newLastDate}
                                    onChange={(e) => setNewLastDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Lý do nghỉ việc</Label>
                            <Textarea
                                placeholder="Vui lòng chia sẻ lý do..."
                                rows={4}
                                value={newReason}
                                onChange={(e) => setNewReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={() => {
                            setCreateDialogOpen(false);
                            setNewReason('');
                            setNewLastDate('');
                            toast.success('Đã gửi đơn xin nghỉ việc. Chờ quản lý duyệt.');
                        }}>Gửi đơn</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* APPROVE DIALOG */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent className="max-w-md">
                    {selectedRequest && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Duyệt đơn nghỉ việc</DialogTitle>
                                <DialogDescription>
                                    Nhân viên: <strong className="text-foreground">{selectedRequest.employeeName}</strong>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="p-4 bg-muted/30 rounded-lg space-y-2 text-sm border">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Ngày gửi:</span>
                                        <span>{formatDate(selectedRequest.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Ngày cuối dự kiến:</span>
                                        <span className="font-medium">{formatDate(selectedRequest.lastWorkingDate)}</span>
                                    </div>
                                    <div className="pt-2 border-t mt-2">
                                        <span className="text-muted-foreground block mb-1">Lý do:</span>
                                        <p className="italic text-foreground">{selectedRequest.reason}</p>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Phản hồi từ quản lý (Optional)</Label>
                                    <Textarea
                                        placeholder="Nhập ghi chú hoặc dặn dò..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <div className="flex gap-2 w-full justify-end">
                                    <Button variant="destructive" onClick={handleReject} className="gap-2">
                                        <XCircle className="h-4 w-4" />
                                        Từ chối
                                    </Button>
                                    <Button onClick={handleApprove} className="gap-2 bg-green-600 hover:bg-green-700">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Đồng ý
                                    </Button>
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
