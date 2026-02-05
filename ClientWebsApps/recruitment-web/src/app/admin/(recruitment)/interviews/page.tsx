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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    mockInterviews,
    interviewTypeLabels,
    interviewStatusLabels,
    Interview,
    formatDateTime,
} from '@/lib/mocks';
import {
    Search,
    Calendar,
    Clock,
    Users,
    Video,
    Phone,
    MapPin,
    Star,
    Plus,
    MessageSquare,
} from 'lucide-react';

const recommendationLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    HIRE: { label: 'Tuyển dụng', variant: 'default' },
    REJECT: { label: 'Từ chối', variant: 'destructive' },
    NEXT_ROUND: { label: 'Vòng tiếp theo', variant: 'secondary' },
    UNDECIDED: { label: 'Chưa quyết định', variant: 'outline' },
};

export default function AdminInterviewsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

    const filteredInterviews = mockInterviews.filter((interview) => {
        const matchesSearch =
            interview.candidateName.toLowerCase().includes(search.toLowerCase()) ||
            interview.jobTitle.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || interview.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const interviewsByStatus = {
        ALL: mockInterviews.length,
        SCHEDULED: mockInterviews.filter((i) => i.status === 'SCHEDULED').length,
        COMPLETED: mockInterviews.filter((i) => i.status === 'COMPLETED').length,
        CANCELLED: mockInterviews.filter((i) => i.status === 'CANCELLED').length,
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO':
                return <Video className="h-4 w-4" />;
            case 'PHONE':
                return <Phone className="h-4 w-4" />;
            case 'ONSITE':
                return <MapPin className="h-4 w-4" />;
            default:
                return null;
        }
    };

    // Helper function to safely format date using the one from mocks or local logic if needed.
    // The imported formatDateTime treats input as ISO string.
    const getFormattedDate = (dateString: string) => {
        // We can just use the utility from mocks if it fits, but splitting date/time might need custom logic
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }),
            time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý phỏng vấn</h1>
                    <p className="text-muted-foreground">Lên lịch và theo dõi phỏng vấn ứng viên</p>
                </div>
                <Button onClick={() => setScheduleDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Lên lịch phỏng vấn
                </Button>
            </div>

            {/* Status Tabs */}
            <Tabs defaultValue="ALL" onValueChange={setStatusFilter}>
                <TabsList className="flex-wrap h-auto gap-2">
                    <TabsTrigger value="ALL" className="gap-2">
                        Tất cả <Badge variant="secondary">{interviewsByStatus.ALL}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="SCHEDULED" className="gap-2">
                        Đã lên lịch <Badge variant="secondary">{interviewsByStatus.SCHEDULED}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="COMPLETED" className="gap-2">
                        Hoàn thành <Badge variant="secondary">{interviewsByStatus.COMPLETED}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="CANCELLED" className="gap-2">
                        Đã hủy <Badge variant="secondary">{interviewsByStatus.CANCELLED}</Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Card>
                <CardHeader>
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
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ứng viên</TableHead>
                                <TableHead>Vị trí</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead>Hình thức</TableHead>
                                <TableHead>Người PV</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Kết quả</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInterviews.map((interview) => {
                                const { date, time } = getFormattedDate(interview.scheduledAt);
                                const statusStyle = interviewStatusLabels[interview.status];
                                const feedback = interview.feedback;
                                const recommendationStyle = feedback?.recommendation ? recommendationLabels[feedback.recommendation] : null;

                                return (
                                    <TableRow key={interview.id}>
                                        <TableCell className="font-medium">
                                            {interview.candidateName}
                                        </TableCell>
                                        <TableCell>{interview.jobTitle}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {date}
                                                </span>
                                                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                                                    <Clock className="h-3 w-3" />
                                                    {time} ({interview.duration} phút)
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {getTypeIcon(interview.type)}
                                                <span>{interviewTypeLabels[interview.type]}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                <span>{interview.interviewers.length}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {recommendationStyle && (
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={recommendationStyle.variant}>{recommendationStyle.label}</Badge>
                                                    {feedback?.rating && (
                                                        <span className="flex items-center gap-0.5 text-sm text-yellow-500">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            {feedback.rating}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedInterview(interview);
                                                    setFeedbackDialogOpen(true);
                                                }}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredInterviews.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không có lịch phỏng vấn nào phù hợp
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Feedback Dialog */}
            <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
                <DialogContent className="max-w-lg">
                    {selectedInterview && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Đánh giá phỏng vấn</DialogTitle>
                                <DialogDescription>
                                    {selectedInterview.candidateName} - {selectedInterview.jobTitle}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Kết quả</Label>
                                    <Select defaultValue={selectedInterview.feedback?.recommendation || 'UNDECIDED'}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HIRE">Tuyển dụng</SelectItem>
                                            <SelectItem value="NEXT_ROUND">Vòng tiếp theo</SelectItem>
                                            <SelectItem value="REJECT">Từ chối</SelectItem>
                                            <SelectItem value="UNDECIDED">Chưa quyết định</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Đánh giá (1-5 sao)</Label>
                                    <Select defaultValue={String(selectedInterview.feedback?.rating || 3)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <SelectItem key={rating} value={String(rating)}>
                                                    {rating} sao
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Nhận xét</Label>
                                    <Textarea
                                        placeholder="Nhập nhận xét về ứng viên..."
                                        defaultValue={selectedInterview.feedback?.notes}
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={() => setFeedbackDialogOpen(false)}>Lưu đánh giá</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Schedule Interview Dialog */}
            <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Lên lịch phỏng vấn mới</DialogTitle>
                        <DialogDescription>
                            Chọn ứng viên và thời gian phỏng vấn
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Ứng viên</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn ứng viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Nguyễn Văn An - Store Manager</SelectItem>
                                    <SelectItem value="2">Trần Thị Bình - Marketing Executive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Ngày</Label>
                                <Input type="date" />
                            </div>
                            <div>
                                <Label>Giờ</Label>
                                <Input type="time" />
                            </div>
                        </div>
                        <div>
                            <Label>Thời lượng (phút)</Label>
                            <Select defaultValue="45">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">30 phút</SelectItem>
                                    <SelectItem value="45">45 phút</SelectItem>
                                    <SelectItem value="60">60 phút</SelectItem>
                                    <SelectItem value="90">90 phút</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Hình thức</Label>
                            <Select defaultValue="VIDEO">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PHONE">Điện thoại</SelectItem>
                                    <SelectItem value="VIDEO">Video call</SelectItem>
                                    <SelectItem value="ONSITE">Tại công ty</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Người phỏng vấn</Label>
                            <Input placeholder="Nhập tên người phỏng vấn" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setScheduleDialogOpen(false)}>Tạo lịch</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
