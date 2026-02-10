
'use client';

import { useState } from 'react';
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
import { mockResignations, ResignationRequest, resignationStatusLabels } from '@/lib/mocks';
import { mockEmployees } from '@/lib/mocks';
import {
    Plus,
    Calendar,
    CheckCircle2,
    XCircle,
    User,
    FileText,
} from 'lucide-react';

export default function ResignationPage() {
    // Mock current user (In real app, get from session)
    const currentUser = mockEmployees[0]; // Nguyen Van Minh (Director) - can see approves
    // const currentUser = mockEmployees[5]; // Vo Thi Lan (Staff) - can see My Requests

    const [activeTab, setActiveTab] = useState('my-requests');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ResignationRequest | null>(null);

    // Filter Logic
    const myRequests = mockResignations.filter(r => r.employeeId === currentUser.id);
    const pendingApprovals = mockResignations.filter(r => r.managerId === currentUser.id && r.status === 'PENDING');
    const allRequests = mockResignations; // For HR View

    const handleCreate = () => {
        setCreateDialogOpen(false);
        toast.success('Đã gửi đơn xin nghỉ việc. Chờ quản lý duyệt.');
    };

    const handleApprove = () => {
        setApproveDialogOpen(false);
        toast.success('Đã duyệt đơn xin nghỉ việc.');
    };

    const handleReject = () => {
        setApproveDialogOpen(false);
        toast.error('Đã từ chối đơn xin nghỉ việc.');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quyết định nghỉ việc</h1>
                    <p className="text-muted-foreground">Quản lý quy trình Offboarding</p>
                </div>
                {/* Only Employee show Create Button */}
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo đơn nghỉ việc
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="my-requests">Đơn của tôi</TabsTrigger>
                    <TabsTrigger value="approvals" className="relative">
                        Cần duyệt
                        {pendingApprovals.length > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                                {pendingApprovals.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="all">Tất cả (HR)</TabsTrigger>
                </TabsList>

                {/* MY REQUESTS */}
                <TabsContent value="my-requests" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử gửi đơn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ngày tạo</TableHead>
                                        <TableHead>Lý do</TableHead>
                                        <TableHead>Ngày nghỉ dự kiến</TableHead>
                                        <TableHead>Người duyệt</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {myRequests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Bạn chưa có đơn xin nghỉ việc nào.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        myRequests.map((req) => (
                                            <TableRow key={req.id}>
                                                <TableCell>{req.createdAt}</TableCell>
                                                <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                                                <TableCell>{req.lastWorkingDate}</TableCell>
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
                                                <TableCell>{req.lastWorkingDate}</TableCell>
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
                                    {allRequests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-medium">{req.employeeName}</TableCell>
                                            <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                                            <TableCell>{req.lastWorkingDate}</TableCell>
                                            <TableCell>{req.managerName}</TableCell>
                                            <TableCell>
                                                <Badge variant={resignationStatusLabels[req.status]?.variant as any}>
                                                    {resignationStatusLabels[req.status]?.label}
                                                </Badge>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tạo đơn xin nghỉ việc</DialogTitle>
                        <DialogDescription>
                            Đơn sẽ được gửi đến quản lý trực tiếp của bạn để phê duyệt.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Ngày làm việc cuối cùng (Dự kiến)</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="date" className="pl-9" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Lý do nghỉ việc</Label>
                            <Textarea placeholder="Vui lòng chia sẻ lý do..." rows={4} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleCreate}>Gửi đơn</Button>
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
                                        <span>{selectedRequest.createdAt}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Ngày cuối dự kiến:</span>
                                        <span className="font-medium">{selectedRequest.lastWorkingDate}</span>
                                    </div>
                                    <div className="pt-2 border-t mt-2">
                                        <span className="text-muted-foreground block mb-1">Lý do:</span>
                                        <p className="italic text-foreground">{selectedRequest.reason}</p>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Phản hồi từ quản lý (Optional)</Label>
                                    <Textarea placeholder="Nhập ghi chú hoặc dặn dò..." />
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
