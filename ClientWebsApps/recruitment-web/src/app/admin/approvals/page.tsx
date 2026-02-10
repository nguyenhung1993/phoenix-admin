"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockApprovalRequests } from '@/lib/mocks/approvals';
import { ApprovalRequest, ApprovalStatus } from '@/lib/types/approval';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Calendar,
    Monitor,
    MoreHorizontal,
    ArrowRight
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNotifications } from '@/lib/contexts/notification-context';

export default function ApprovalsPage() {
    const [requests, setRequests] = useState<ApprovalRequest[]>(mockApprovalRequests);
    const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
    const [comment, setComment] = useState('');
    const [action, setAction] = useState<'APPROVE' | 'REJECT' | null>(null);

    // Mock "My Role" - In a real app, this comes from the user session
    const MY_CURRENT_ROLE = 'MANAGER';

    const pendingRequests = requests.filter(r =>
        r.status === 'PENDING' &&
        r.steps.find(s => s.order === r.currentStepOrder)?.role === MY_CURRENT_ROLE
    );

    const fileTypeIcons: Record<string, any> = {
        'LEAVE': Calendar,
        'ASSET_REQUEST': Monitor,
        'OVERTIME': Clock,
        'PROMOTION': FileText
    };

    const handleAction = (request: ApprovalRequest, type: 'APPROVE' | 'REJECT') => {
        setSelectedRequest(request);
        setAction(type);
        setComment('');
    };

    const { addNotification } = useNotifications();

    const confirmAction = () => {
        if (!selectedRequest || !action) return;

        const updatedRequests = requests.map(req => {
            if (req.id !== selectedRequest.id) return req;

            const currentStepIndex = req.steps.findIndex(s => s.order === req.currentStepOrder);
            const newSteps = [...req.steps];

            // Update current step
            newSteps[currentStepIndex] = {
                ...newSteps[currentStepIndex],
                status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
                approvedBy: 'Tôi (Admin)', // Mock user
                approvedAt: new Date().toISOString(),
                comment: comment
            };

            let newStatus: ApprovalStatus = req.status;
            let newStepOrder = req.currentStepOrder;

            if (action === 'REJECT') {
                newStatus = 'REJECTED';
            } else {
                // Check if there is next step
                if (currentStepIndex < req.steps.length - 1) {
                    newStepOrder = req.steps[currentStepIndex + 1].order;
                    // Next step remains pending
                } else {
                    newStatus = 'APPROVED'; // All steps done
                }
            }

            return {
                ...req,
                status: newStatus,
                currentStepOrder: newStepOrder,
                steps: newSteps
            };
        });

        setRequests(updatedRequests);

        // SIMULATE NOTIFICATION
        if (action === 'APPROVE') {
            addNotification({
                title: 'Yêu cầu được phê duyệt',
                message: `Yêu cầu ${selectedRequest.code} của ${selectedRequest.requesterName} đã được phê duyệt bước ${selectedRequest.currentStepOrder}.`,
                type: 'LEAVE_REQUEST', // Mocking generic type or derived from request
                priority: 'HIGH'
            });
        } else {
            addNotification({
                title: 'Yêu cầu bị từ chối',
                message: `Yêu cầu ${selectedRequest.code} của ${selectedRequest.requesterName} đã bị từ chối.`,
                type: 'SYSTEM_ALERT',
                priority: 'HIGH'
            });
        }

        setSelectedRequest(null);
        // Toast is already handled by addNotification for the current user, but for specific action feedback we might keep toast or remove it if redundant.
        // specific toast for action completion
        // toast.success(action === 'APPROVE' ? 'Đã phê duyệt yêu cầu' : 'Đã từ chối yêu cầu');
    };

    const getStatusColor = (status: ApprovalStatus) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25';
            case 'REJECTED': return 'bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25';
            case 'PENDING': return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/25';
            default: return 'bg-gray-500/15 text-gray-700 dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Duyệt yêu cầu</h2>
                <p className="text-muted-foreground">Quản lý và xử lý các yêu cầu cần phê duyệt của bạn.</p>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList>
                    <TabsTrigger value="pending">Cần xử lý ({pendingRequests.length})</TabsTrigger>
                    <TabsTrigger value="history">Lịch sử</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-4 space-y-4">
                    {pendingRequests.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg bg-muted/10">
                            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                            <h3 className="text-lg font-medium">Không có yêu cầu nào</h3>
                            <p className="text-muted-foreground">Bạn đã xử lý hết các công việc cần duyệt.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pendingRequests.map(req => {
                                const Icon = fileTypeIcons[req.type] || FileText;
                                return (
                                    <Card key={req.id} className="flex flex-col">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <Badge variant="outline" className="font-normal">
                                                    {req.code}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg leading-tight">{req.title}</CardTitle>
                                            <CardDescription>
                                                từ <span className="font-medium text-foreground">{req.requesterName}</span> • {req.department}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1 pb-3">
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                {req.description}
                                            </p>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {format(new Date(req.createdAt), 'dd/MM/yyyy HH:mm')}
                                            </div>
                                        </CardContent>
                                        <div className="p-4 pt-0 mt-auto flex gap-2">
                                            <Button
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                onClick={() => handleAction(req, 'APPROVE')}
                                            >
                                                Phê duyệt
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                                                onClick={() => handleAction(req, 'REJECT')}
                                            >
                                                Từ chối
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history">
                    <div className="border rounded-lg">
                        {requests.filter(r => r.status !== 'PENDING').map(req => (
                            <div key={req.id} className="p-4 border-b last:border-0 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2 rounded-full", req.status === 'APPROVED' ? 'bg-green-100' : 'bg-red-100')}>
                                        {req.status === 'APPROVED' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{req.title}</h4>
                                        <p className="text-sm text-muted-foreground">{req.code} • {req.requesterName}</p>
                                    </div>
                                </div>
                                <Badge className={getStatusColor(req.status)} variant="secondary">
                                    {req.status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
                                </Badge>
                            </div>
                        ))}
                        {requests.filter(r => r.status !== 'PENDING').length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">Chưa có lịch sử phê duyệt</div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {action === 'APPROVE' ? 'Xác nhận phê duyệt' : 'Từ chối yêu cầu'}
                        </DialogTitle>
                        <DialogDescription>
                            {action === 'APPROVE'
                                ? 'Bạn có chắc chắn muốn duyệt yêu cầu này? Hành động này sẽ chuyển tiếp yêu cầu đến bước tiếp theo (nếu có).'
                                : 'Vui lòng nhập lý do từ chối yêu cầu này.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">Ghi chú / Lý do:</label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={action === 'APPROVE' ? "Nhập ghi chú (tùy chọn)..." : "Nhập lý do từ chối..."}
                            className={cn(action === 'REJECT' && !comment && "border-red-500 focus-visible:ring-red-500")}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedRequest(null)}>Hủy</Button>
                        <Button
                            variant={action === 'REJECT' ? "destructive" : "default"}
                            onClick={confirmAction}
                            disabled={action === 'REJECT' && !comment}
                        >
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
