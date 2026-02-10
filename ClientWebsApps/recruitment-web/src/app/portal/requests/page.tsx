'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { mockApprovalRequests } from '@/lib/mocks/approvals';
import { useNotifications } from '@/lib/contexts/notification-context';
import { ApprovalWorkflow, ApprovalStatus } from '@/lib/types/approval';

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

export default function MyRequestsPage() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newRequestType, setNewRequestType] = useState<ApprovalWorkflow['type']>('LEAVE');
    const { addNotification } = useNotifications();

    // Mock filtering - assume all mock requests belong to the logged-in user for this demo
    const myRequests = mockApprovalRequests;

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Yêu cầu của tôi</h1>
                    <p className="text-muted-foreground">Quản lý các yêu cầu nghỉ phép, tăng ca, và các đề xuất khác</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo yêu cầu mới
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Danh sách yêu cầu</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Lọc
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Ngày gửi</TableHead>
                                <TableHead>Chi tiết</TableHead>
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
                                        <div className="text-xs space-y-1">
                                            <div>{req.steps.find(s => s.status === 'APPROVED' || s.status === 'REJECTED')?.comment ? 'Có phản hồi' : 'Chưa có phản hồi'}</div>
                                            <div className="text-muted-foreground">Bước hiện tại: {req.currentStepOrder}</div>
                                        </div>
                                    </TableCell>
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
        </div>
    );
}
