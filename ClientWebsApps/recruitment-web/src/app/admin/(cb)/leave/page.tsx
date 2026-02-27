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
import { LeaveDialog } from '@/components/admin/cb/leave/leave-dialog';
import {
    Calendar,
    Clock,
    Plus,
    Eye,
    Check,
    X,
    CalendarDays,
    Users,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const leaveTypeLabels: Record<string, { label: string; color: string }> = {
    ANNUAL: { label: 'Phép năm', color: 'bg-blue-100 text-blue-700' },
    SICK: { label: 'Nghỉ ốm', color: 'bg-red-100 text-red-700' },
    MATERNITY: { label: 'Thai sản', color: 'bg-pink-100 text-pink-700' },
    UNPAID: { label: 'Không lương', color: 'bg-gray-100 text-gray-700' },
    WEDDING: { label: 'Kết hôn', color: 'bg-yellow-100 text-yellow-700' },
    BEREAVEMENT: { label: 'Tang sự', color: 'bg-purple-100 text-purple-700' },
    OTHER: { label: 'Khác', color: 'bg-slate-100 text-slate-700' },
};

const leaveStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PENDING: { label: 'Chờ duyệt', variant: 'secondary' },
    APPROVED: { label: 'Đã duyệt', variant: 'default' },
    REJECTED: { label: 'Từ chối', variant: 'destructive' },
};

type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    approverName: string | null;
    rejectionReason: string | null;
}

interface LeaveBalance {
    employeeId: string;
    employeeName: string;
    annualTotal: number;
    annualUsed: number;
    annualRemaining: number;
    sickTotal: number;
    sickUsed: number;
}

export default function LeavePage() {
    const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'ALL'>('ALL');
    const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [balances, setBalances] = useState<LeaveBalance[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leave-requests?balances=true');
            const json = await res.json();
            setRequests(json.data || []);
            setBalances(json.balances || []);
        } catch {
            setRequests([]);
            setBalances([]);
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

    const handleApprove = async () => {
        if (!selectedRequest) return;
        try {
            const res = await fetch('/api/leave-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedRequest.id, status: 'APPROVED' }),
            });
            if (res.ok) {
                toast.success('Đã phê duyệt đơn nghỉ phép', {
                    description: `Nhân viên: ${selectedRequest.employeeName}`
                });
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
            const res = await fetch('/api/leave-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedRequest.id, status: 'REJECTED' }),
            });
            if (res.ok) {
                toast.error('Đã từ chối đơn nghỉ phép', {
                    description: `Nhân viên: ${selectedRequest.employeeName}`
                });
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
                    <h1 className="text-2xl font-bold">Quản lý nghỉ phép</h1>
                    <p className="text-muted-foreground">Xem và duyệt đơn xin nghỉ phép</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo đơn nghỉ phép
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
                            <CalendarDays className="h-8 w-8 text-muted-foreground" />
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
                                <p className="text-sm text-muted-foreground">Từ chối</p>
                                <p className="text-2xl font-bold text-red-600">{requestsByStatus.REJECTED}</p>
                            </div>
                            <X className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Tabs */}
            <Tabs defaultValue="ALL" onValueChange={(v) => setStatusFilter(v as LeaveStatus | 'ALL')}>
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

            {/* Leave Requests Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách đơn nghỉ phép</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Loại nghỉ</TableHead>
                                <TableHead>Từ ngày</TableHead>
                                <TableHead>Đến ngày</TableHead>
                                <TableHead className="text-center">Số ngày</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.map((request) => {
                                const typeStyle = leaveTypeLabels[request.leaveType] || { label: request.leaveType, color: 'bg-gray-100' };
                                const statusStyle = leaveStatusLabels[request.status] || { label: request.status, variant: 'secondary' as const };

                                return (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">{request.employeeName}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${typeStyle.color}`}>
                                                {typeStyle.label}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(request.startDate).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell>{new Date(request.endDate).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell className="text-center font-mono">{request.totalDays}</TableCell>
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
                            Không có đơn nghỉ phép nào
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Leave Balance Table */}
            {balances.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Số ngày phép còn lại - Năm {new Date().getFullYear()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nhân viên</TableHead>
                                    <TableHead className="text-center">Phép năm (Tổng)</TableHead>
                                    <TableHead className="text-center">Đã dùng</TableHead>
                                    <TableHead className="text-center">Còn lại</TableHead>
                                    <TableHead className="text-center">Nghỉ ốm (Đã dùng)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {balances.map((balance) => (
                                    <TableRow key={balance.employeeId}>
                                        <TableCell className="font-medium">{balance.employeeName}</TableCell>
                                        <TableCell className="text-center">{balance.annualTotal}</TableCell>
                                        <TableCell className="text-center">{balance.annualUsed}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={balance.annualRemaining > 5 ? 'default' : 'secondary'}>
                                                {balance.annualRemaining}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">{balance.sickUsed}/{balance.sickTotal}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-lg">
                    {selectedRequest && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Chi tiết đơn nghỉ phép</DialogTitle>
                                <DialogDescription>
                                    {selectedRequest.employeeName} - {leaveTypeLabels[selectedRequest.leaveType]?.label || selectedRequest.leaveType}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Từ ngày</p>
                                        <p className="font-medium">{new Date(selectedRequest.startDate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Đến ngày</p>
                                        <p className="font-medium">{new Date(selectedRequest.endDate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Số ngày</p>
                                        <p className="font-medium">{selectedRequest.totalDays} ngày</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                                        <Badge variant={leaveStatusLabels[selectedRequest.status]?.variant as any}>
                                            {leaveStatusLabels[selectedRequest.status]?.label}
                                        </Badge>
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

                                {selectedRequest.rejectionReason && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Lý do từ chối</p>
                                        <p className="font-medium text-red-600">{selectedRequest.rejectionReason}</p>
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

            <LeaveDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </div>
    );
}
