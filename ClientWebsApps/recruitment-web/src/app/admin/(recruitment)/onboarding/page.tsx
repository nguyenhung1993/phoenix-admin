'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
    OnboardingItem,
    OnboardingStatus,
    TaskStatus,
    onboardingStatusLabels,
    taskStatusLabels,
    taskCategoryLabels,
    TaskCategory,
} from '@/lib/schemas/recruitment';
import { hrmService } from '@/services/hrm-service';
import {
    Search,
    User,
    Calendar,
    Building,
    CheckCircle2,
    Circle,
    ChevronRight,
    FileText,
    Monitor,
    GraduationCap,
    Users,
    ClipboardList,
    UserPlus,
    Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminOnboardingPage() {
    const router = useRouter();
    const [onboardings, setOnboardings] = useState<OnboardingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedOnboarding, setSelectedOnboarding] = useState<OnboardingItem | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);

    const fetchOnboardings = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter !== 'ALL') params.set('status', statusFilter);

            const res = await fetch(`/api/onboarding?${params}`);
            const data = await res.json();
            setOnboardings(data.data || []);
        } catch {
            toast.error('Không thể tải dữ liệu onboarding');
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    useEffect(() => {
        fetchOnboardings();
    }, [fetchOnboardings]);

    const handleTransfer = async () => {
        if (!selectedOnboarding) return;

        setIsTransferring(true);
        try {
            // Mock finding IDs - in real app would query DB or use centralized data
            // For now hardcode or use simple logic since HRM service is separate
            const payload = {
                fullName: selectedOnboarding.employeeName,
                email: selectedOnboarding.employeeEmail,
                departmentId: '2', // Default to HR for now
                positionId: '5',    // Default to Specialist
                hireDate: selectedOnboarding.startDate,
                status: 'ACTIVE',
            };

            await hrmService.createEmployee(payload);

            toast.success('Đã chuyển đổi thành công sang HRM Core!');
            setDetailDialogOpen(false);

            // Optionally mark onboarding as COMPLETED if not already
            if (selectedOnboarding.status !== 'COMPLETED') {
                await fetch(`/api/onboarding/${selectedOnboarding.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'COMPLETED' }),
                });
                fetchOnboardings();
            }
        } catch (error: any) {
            console.error('Transfer error:', error);
            toast.error('Có lỗi xảy ra: ' + error.message);
        } finally {
            setIsTransferring(false);
        }
    };

    const handleToggleTask = async (onboardingId: string, taskId: string, currentStatus: TaskStatus) => {
        const newStatus: TaskStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        try {
            const res = await fetch(`/api/onboarding/${onboardingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId, taskStatus: newStatus }),
            });

            if (!res.ok) throw new Error('Failed');

            // Optimistic update locally or refetch
            // For simplicity, refetch detailed view if open, or list
            const updatedData = await res.json();

            // Update list
            setOnboardings(prev => prev.map(o => o.id === onboardingId ? updatedData : o));

            // Update detail view if open matches
            if (selectedOnboarding?.id === onboardingId) {
                setSelectedOnboarding(updatedData);
            }
            toast.success('Đã cập nhật trạng thái công việc');
        } catch {
            toast.error('Không thể cập nhật trạng thái công việc');
        }
    };

    const onboardingsByStatus = {
        ALL: onboardings.length,
        NOT_STARTED: onboardings.filter((o) => o.status === 'NOT_STARTED').length,
        IN_PROGRESS: onboardings.filter((o) => o.status === 'IN_PROGRESS').length,
        COMPLETED: onboardings.filter((o) => o.status === 'COMPLETED').length,
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'IN_PROGRESS':
                return <Circle className="h-5 w-5 text-blue-500" />;
            default:
                return <Circle className="h-5 w-5 text-gray-300" />;
        }
    };

    const getCategoryIcon = (category: TaskCategory) => {
        switch (category) {
            case 'DOCUMENTS':
                return <FileText className="h-4 w-4" />;
            case 'IT_SETUP':
                return <Monitor className="h-4 w-4" />;
            case 'TRAINING':
                return <GraduationCap className="h-4 w-4" />;
            case 'INTRODUCTION':
                return <Users className="h-4 w-4" />;
            default:
                return <ClipboardList className="h-4 w-4" />;
        }
    };

    const getCompletionPercentage = (tasks: any[]) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
        return Math.round((completed / tasks.length) * 100);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quy trình Onboarding</h1>
                    <p className="text-muted-foreground">Theo dõi tiến độ hội nhập nhân viên mới</p>
                </div>
            </div>

            <Tabs defaultValue="ALL" onValueChange={setStatusFilter}>
                <TabsList>
                    <TabsTrigger value="ALL">
                        Tất cả <Badge variant="secondary" className="ml-2">{onboardingsByStatus.ALL}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="NOT_STARTED">
                        Chưa bắt đầu <Badge variant="secondary" className="ml-2">{onboardingsByStatus.NOT_STARTED}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="IN_PROGRESS">
                        Đang thực hiện <Badge variant="secondary" className="ml-2">{onboardingsByStatus.IN_PROGRESS}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="COMPLETED">
                        Hoàn thành <Badge variant="secondary" className="ml-2">{onboardingsByStatus.COMPLETED}</Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm nhân viên..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {onboardings.length > 0 ? (
                        onboardings.map((onboarding) => {
                            const percent = getCompletionPercentage(onboarding.tasks || []);
                            const statusStyle = onboardingStatusLabels[onboarding.status as OnboardingStatus];

                            return (
                                <Card
                                    key={onboarding.id}
                                    className="cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => {
                                        setSelectedOnboarding(onboarding);
                                        setDetailDialogOpen(true);
                                    }}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="font-semibold text-primary">
                                                        {onboarding.employeeName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{onboarding.employeeName}</h3>
                                                    <p className="text-sm text-muted-foreground">{onboarding.jobTitle}</p>
                                                </div>
                                            </div>
                                            {statusStyle && (
                                                <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Building className="mr-2 h-4 w-4" />
                                                {onboarding.department}
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                Ngày nhận việc: {new Date(onboarding.startDate).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Tiến độ</span>
                                                    <span>{percent}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-300"
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                            Không có nhân viên nào trong quá trình onboarding
                        </div>
                    )}
                </div>
            )}

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    {selectedOnboarding && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex justify-between items-center">
                                    <span>Chi tiết Onboarding</span>
                                    {selectedOnboarding.status === 'COMPLETED' && (
                                        <Button
                                            onClick={handleTransfer}
                                            disabled={isTransferring}
                                            className="ml-4"
                                            size="sm"
                                        >
                                            {isTransferring ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    Chuyển sang HRM Core
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedOnboarding.employeeName} - {selectedOnboarding.jobTitle}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-6 md:col-span-1">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Thông tin nhân viên
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Email:</span>
                                                <p>{selectedOnboarding.employeeEmail}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Phòng ban:</span>
                                                <p>{selectedOnboarding.department}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Người hướng dẫn:</span>
                                                <p>{selectedOnboarding.buddyName || 'Chưa cập nhật'}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Ngày bắt đầu:</span>
                                                <p>{new Date(selectedOnboarding.startDate).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">Thống kê</h4>
                                        <div className="space-y-2">
                                            {(selectedOnboarding.tasks || []).length > 0 ? (
                                                <>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Tổng số việc:</span>
                                                        <span>{(selectedOnboarding.tasks || []).length}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Hoàn thành:</span>
                                                        <span className="text-green-600 font-medium">
                                                            {(selectedOnboarding.tasks || []).filter(t => t.status === 'COMPLETED').length}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Còn lại:</span>
                                                        <span className="text-orange-600 font-medium">
                                                            {(selectedOnboarding.tasks || []).filter(t => t.status !== 'COMPLETED').length}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-sm text-muted-foreground">Chưa có công việc nào</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold flex items-center gap-2">
                                            <ClipboardList className="h-4 w-4" />
                                            Danh sách công việc
                                        </h4>
                                    </div>

                                    <div className="space-y-2">
                                        {(selectedOnboarding.tasks || []).map((task) => {
                                            const categoryStyle = taskCategoryLabels[task.category as TaskCategory];
                                            const categoryIcon = getCategoryIcon(task.category as TaskCategory);
                                            return (
                                                <div
                                                    key={task.id}
                                                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                                >
                                                    <Checkbox
                                                        checked={task.status === 'COMPLETED'}
                                                        onCheckedChange={() => handleToggleTask(selectedOnboarding.id, task.id, task.status)}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className={`font-medium ${task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''}`}>
                                                                {task.title}
                                                            </span>
                                                            <Badge variant="secondary" className={`${categoryStyle?.color} border-0 flex items-center gap-1`}>
                                                                {categoryIcon}
                                                                {categoryStyle?.label}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{task.description}</p>
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                                            <span className="flex items-center gap-1">
                                                                <User className="h-3 w-3" />
                                                                Giao cho: {task.assignedTo || 'N/A'}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                Hạn: Ngày thứ {task.dueDay}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {(selectedOnboarding.tasks || []).length === 0 && (
                                            <div className="text-center py-4 text-muted-foreground border border-dashed rounded-lg">
                                                Chưa có công việc nào
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
