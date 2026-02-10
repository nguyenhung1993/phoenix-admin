'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { mockApprovalRequests } from '@/lib/mocks/approvals';
import { ApprovalRequest, ApprovalWorkflow, ApprovalStatus } from '@/lib/types/approval';
import { useNotifications } from '@/lib/contexts/notification-context';

const requestTypeLabels: Record<string, { label: string; color: string }> = {
    'LEAVE': { label: 'Xin nghỉ phép', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    'OVERTIME': { label: 'Đăng ký tăng ca', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    'ASSET_REQUEST': { label: 'Yêu cầu tài sản', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    'PROMOTION': { label: 'Đề xuất thăng chức', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    'RESIGNATION': { label: 'Xin thôi việc', color: 'text-red-600 bg-red-50 border-red-200' },
};

const requestStatusLabels: Record<ApprovalStatus, { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
    'PENDING': { label: 'Chờ duyệt', variant: 'outline' },
    'APPROVED': { label: 'Đã duyệt', variant: 'default' },
    'REJECTED': { label: 'Từ chối', variant: 'destructive' },
    'CANCELLED': { label: 'Đã hủy', variant: 'secondary' },
};

export default function RequestsPage() {
    const [activeTab, setActiveTab] = useState('my-requests');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
    const [newRequestType, setNewRequestType] = useState<ApprovalWorkflow['type']>('LEAVE');

    // Mock filtering
    const myRequests = mockApprovalRequests; // Show all for demo
    const pendingApprovals = mockApprovalRequests.filter(r => r.status === 'PENDING');

    const { addNotification } = useNotifications();

    const handleCreate = () => {
        setCreateDialogOpen(false);
        addNotification({
            title: 'Gửi yêu cầu thành công',
            message: 'Yêu cầu của bạn đã được gửi đến người duyệt.',
            type: 'SYSTEM_ALERT',
            priority: 'MEDIUM'
        });
        toast.success('Đã gửi yêu cầu thành công!');
    };

    const handleApprove = () => {
        setApproveDialogOpen(false);
        addNotification({
            title: 'Phê duyệt thành công',
            message: 'Bạn đã phê duyệt yêu cầu này.',
            type: 'SYSTEM_ALERT',
            priority: 'MEDIUM'
        });
        toast.success('Đã phê duyệt yêu cầu.');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quy trình & Phê duyệt</h1>
                    <p className="text-muted-foreground">Quản lý các yêu cầu Nghỉ phép, Tăng ca, Công tác...</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo yêu cầu
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="my-requests">Tôi gửi đi</TabsTrigger>
                    <TabsTrigger value="approvals" className="relative gap-2">
                        Cần xử lý
                        {pendingApprovals.length > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                {pendingApprovals.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* MY REQUESTS */}
                <TabsContent value="my-requests" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách yêu cầu của tôi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã</TableHead>
                                        <TableHead>Loại</TableHead>
                                        <TableHead>Tiêu đề</TableHead>
                                        <TableHead>Ngày gửi</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {myRequests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-medium">{req.code}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={requestTypeLabels[req.type]?.color}>
                                                    {requestTypeLabels[req.type]?.label || req.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{req.title}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{req.description}</div>
                                            </TableCell>
                                            <TableCell>{new Date(req.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                            <TableCell>
                                                <Badge variant={requestStatusLabels[req.status]?.variant || 'outline'}>
                                                    {requestStatusLabels[req.status]?.label || req.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* APPROVALS */}
                <TabsContent value="approvals" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Yêu cầu cần duyệt</CardTitle>
                            <CardDescription>Các yêu cầu đang chờ bạn phê duyệt</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Người gửi</TableHead>
                                        <TableHead>Loại</TableHead>
                                        <TableHead>Nội dung</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingApprovals.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell>
                                                <div className="font-medium">{req.requesterName}</div>
                                                <div className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={requestTypeLabels[req.type]?.color}>
                                                    {requestTypeLabels[req.type]?.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <div className="font-medium text-sm">{req.title}</div>
                                                <div className="text-xs text-muted-foreground line-clamp-2">{req.description}</div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" onClick={() => {
                                                    setSelectedRequest(req);
                                                    setApproveDialogOpen(true);
                                                }}>
                                                    Xem & Duyệt
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* CREATE DIALOG */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tạo yêu cầu mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Loại yêu cầu</Label>
                            <Select value={newRequestType} onValueChange={(v) => setNewRequestType(v as ApprovalWorkflow['type'])}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LEAVE">Xin nghỉ phép</SelectItem>
                                    <SelectItem value="OVERTIME">Đăng ký tăng ca</SelectItem>
                                    <SelectItem value="ASSET_REQUEST">Yêu cầu tài sản</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Tiêu đề</Label>
                            <Input placeholder="Vd: Xin nghỉ phép đi du lịch..." />
                        </div>

                        {newRequestType === 'LEAVE' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Từ ngày</Label>
                                    <Input type="date" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Đến ngày</Label>
                                    <Input type="date" />
                                </div>
                            </div>
                        ) : newRequestType === 'OVERTIME' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Ngày tăng ca</Label>
                                    <Input type="date" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Số giờ</Label>
                                    <Input type="number" placeholder="4" />
                                </div>
                            </div>
                        ) : null}

                        <div className="grid gap-2">
                            <Label>Lý do / Mô tả chi tiết</Label>
                            <Textarea placeholder="Nhập lý do chi tiết..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleCreate}>Gửi yêu cầu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* APPROVE DIALOG */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Phê duyệt yêu cầu</DialogTitle>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                                <div className="flex justify-between font-medium">
                                    <span>{selectedRequest.requesterName}</span>
                                    <Badge variant="outline">{requestTypeLabels[selectedRequest.type]?.label}</Badge>
                                </div>
                                <div className="text-lg font-semibold">{selectedRequest.title}</div>
                                <div className="border-t pt-2 mt-2 space-y-1">
                                    <div><strong>Mô tả:</strong> {selectedRequest.description}</div>
                                    <div><strong>Mã phiếu:</strong> {selectedRequest.code}</div>
                                    {selectedRequest.metadata && (
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            {/* Render metadata safely if needed */}
                                            <pre>{JSON.stringify(selectedRequest.metadata, null, 2)}</pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Ghi chú duyệt</Label>
                                <Textarea placeholder="Đồng ý / Từ chối vì..." />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="destructive" onClick={() => setApproveDialogOpen(false)} className="gap-2">
                            <XCircle className="h-4 w-4" /> Từ chối
                        </Button>
                        <Button onClick={handleApprove} className="gap-2 bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="h-4 w-4" /> Duyệt
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
