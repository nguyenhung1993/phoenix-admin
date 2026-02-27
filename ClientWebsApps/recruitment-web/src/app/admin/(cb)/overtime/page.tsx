'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Clock,
    Plus,
    Eye,
    Check,
    X,
    Timer,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

type OvertimeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const overtimeStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PENDING: { label: 'Chờ duyệt', variant: 'secondary' },
    APPROVED: { label: 'Đã duyệt', variant: 'default' },
    REJECTED: { label: 'Từ chối', variant: 'destructive' },
};

interface OvertimeRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    startTime: string;
    endTime: string;
    hours: number;
    reason: string;
    status: OvertimeStatus;
    approverName: string | null;
    createdAt: string;
}

export default function OvertimePage() {
    const [statusFilter, setStatusFilter] = useState<OvertimeStatus | 'ALL'>('ALL');
    const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [requests, setRequests] = useState<OvertimeRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/overtime-requests');
            const json = await res.json();
            setRequests(json.data || []);
        } catch {
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredRequests = requests.filter((req) => {
        return statusFilter === 'ALL' || req.status === statusFilter;
    });

    const requestsByStatus = {
        ALL: requests.length,
        PENDING: requests.filter((r) => r.status === 'PENDING').length,
        APPROVED: requests.filter((r) => r.status === 'APPROVED').length,
        REJECTED: requests.filter((r) => r.status === 'REJECTED').length,
    };

    const totalApprovedHours = requests
        .filter((r) => r.status === 'APPROVED')
        .reduce((sum, r) => sum + r.hours, 0);

    const handleApprove = async () => {
        if (!selectedRequest) return;
        try {
            const res = await fetch('/api/overtime-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedRequest.id, status: 'APPROVED' }),
            });
            if (res.ok) {
                toast.success('Đã phê duyệt đơn tăng ca');
                setDetailDialogOpen(false);
                fetchData();
            }
        } catch {
            toast.error('Lỗi kết nối server');
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        try {
            const res = await fetch('/api/overtime-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedRequest.id, status: 'REJECTED' }),
            });
            if (res.ok) {
                toast.error('Đã từ chối đơn tăng ca');
                setDetailDialogOpen(false);
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý tăng ca</h1>
                    <p className="text-muted-foreground">Xem và duyệt đơn đăng ký tăng ca</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Đăng ký tăng ca
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng đơn</p>
                                <p className="text-2xl font-bold">{requestsByStatus.ALL}</p>
                            </div>
                            <Timer className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-yellow-600">{requestsByStatus.PENDING}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đã duyệt</p>
                                <p className="text-2xl font-bold text-green-600">{requestsByStatus.APPROVED}</p>
                            </div>
                            <Check className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng giờ OT</p>
                                <p className="text-2xl font-bold text-blue-600">{totalApprovedHours}h</p>
                            </div>
                            <Timer className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Tabs */}
            <Tabs defaultValue="ALL" onValueChange={(v) => setStatusFilter(v as OvertimeStatus | 'ALL')}>
                <TabsList className="flex-wrap h-auto gap-2">
                    <TabsTrigger value="ALL" className="gap-2">
                        Tất cả <Badge variant="secondary">{requestsByStatus.ALL}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="PENDING" className="gap-2">
                        Chờ duyệt <Badge variant="secondary">{requestsByStatus.PENDING}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="APPROVED" className="gap-2">
                        Đã duyệt <Badge variant="secondary">{requestsByStatus.APPROVED}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="REJECTED" className="gap-2">
                        Từ chối <Badge variant="secondary">{requestsByStatus.REJECTED}</Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Overtime Requests Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách đơn tăng ca</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead className="text-center">Số giờ</TableHead>
                                <TableHead>Lý do</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.map((request) => {
                                const statusStyle = overtimeStatusLabels[request.status] || { label: request.status, variant: 'secondary' as const };

                                return (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">{request.employeeName}</TableCell>
                                        <TableCell>{new Date(request.date).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell className="font-mono">
                                            {request.startTime} - {request.endTime}
                                        </TableCell>
                                        <TableCell className="text-center font-mono">{request.hours}h</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setDetailDialogOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {request.status === 'PENDING' && (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="text-green-600" onClick={() => {
                                                            setSelectedRequest(request);
                                                            handleApprove();
                                                        }}>
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => {
                                                            setSelectedRequest(request);
                                                            handleReject();
                                                        }}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredRequests.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không có đơn tăng ca nào
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-lg">
                    {selectedRequest && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Chi tiết đơn tăng ca</DialogTitle>
                                <DialogDescription>
                                    {selectedRequest.employeeName} - {new Date(selectedRequest.date).toLocaleDateString('vi-VN')}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Thời gian</p>
                                        <p className="font-medium font-mono">
                                            {selectedRequest.startTime} - {selectedRequest.endTime}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Số giờ</p>
                                        <p className="font-medium">{selectedRequest.hours} giờ</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                                        <Badge variant={overtimeStatusLabels[selectedRequest.status]?.variant as any}>
                                            {overtimeStatusLabels[selectedRequest.status]?.label}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ngày tạo</p>
                                        <p className="font-medium">{new Date(selectedRequest.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">Lý do</p>
                                    <p className="font-medium">{selectedRequest.reason}</p>
                                </div>

                                {selectedRequest.approverName && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Người duyệt</p>
                                        <p className="font-medium">{selectedRequest.approverName}</p>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                                    Đóng
                                </Button>
                                {selectedRequest.status === 'PENDING' && (
                                    <>
                                        <Button variant="destructive" onClick={handleReject}>Từ chối</Button>
                                        <Button onClick={handleApprove}>Phê duyệt</Button>
                                    </>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
