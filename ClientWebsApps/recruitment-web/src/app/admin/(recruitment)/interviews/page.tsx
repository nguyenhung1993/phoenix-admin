'use client';

import { useState, useEffect, useCallback } from 'react';
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
    InterviewItem,
    InterviewStatus,
    InterviewStatusValues,
    interviewTypeLabels,
    interviewStatusLabels,
    recommendationLabels,
    CandidateItem,
} from '@/lib/schemas/recruitment';
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
    Loader2,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminInterviewsPage() {
    const [interviews, setInterviews] = useState<InterviewItem[]>([]);
    const [candidates, setCandidates] = useState<CandidateItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedInterview, setSelectedInterview] = useState<InterviewItem | null>(null);
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Feedback form state
    const [fbRecommendation, setFbRecommendation] = useState('UNDECIDED');
    const [fbRating, setFbRating] = useState('3');
    const [fbNotes, setFbNotes] = useState('');

    // Schedule form state
    const [schedCandidateId, setSchedCandidateId] = useState('');
    const [schedDate, setSchedDate] = useState('');
    const [schedTime, setSchedTime] = useState('');
    const [schedDuration, setSchedDuration] = useState('45');
    const [schedType, setSchedType] = useState('VIDEO');
    const [schedInterviewerName, setSchedInterviewerName] = useState('');

    const fetchInterviews = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter !== 'ALL') params.set('status', statusFilter);

            const res = await fetch(`/api/interviews?${params}`);
            const data = await res.json();
            setInterviews(data.data || []);
        } catch {
            toast.error('Không thể tải dữ liệu phỏng vấn');
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    const fetchCandidates = async () => {
        try {
            const res = await fetch('/api/candidates?limit=100');
            const data = await res.json();
            setCandidates(data.data || []);
        } catch {
            console.warn('Could not load candidates');
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, [fetchInterviews]);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const filteredInterviews = interviews;

    const interviewsByStatus = {
        ALL: interviews.length,
        SCHEDULED: interviews.filter((i) => i.status === 'SCHEDULED').length,
        COMPLETED: interviews.filter((i) => i.status === 'COMPLETED').length,
        CANCELLED: interviews.filter((i) => i.status === 'CANCELLED').length,
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

    const getFormattedDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }),
            time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    const handleSaveFeedback = async () => {
        if (!selectedInterview) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/interviews/${selectedInterview.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'COMPLETED',
                    feedback: {
                        recommendation: fbRecommendation,
                        rating: parseInt(fbRating),
                        notes: fbNotes,
                    },
                }),
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Đã lưu đánh giá phỏng vấn');
            setFeedbackDialogOpen(false);
            fetchInterviews();
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSchedule = async () => {
        if (!schedCandidateId || !schedDate || !schedTime) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        setSubmitting(true);
        try {
            const scheduledAt = new Date(`${schedDate}T${schedTime}`).toISOString();
            const res = await fetch('/api/interviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    candidateId: schedCandidateId,
                    type: schedType,
                    scheduledAt,
                    duration: parseInt(schedDuration),
                    interviewers: schedInterviewerName ? [{ name: schedInterviewerName }] : [],
                }),
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Đã lên lịch phỏng vấn');
            setScheduleDialogOpen(false);
            // Reset form
            setSchedCandidateId('');
            setSchedDate('');
            setSchedTime('');
            setSchedDuration('45');
            setSchedType('VIDEO');
            setSchedInterviewerName('');
            fetchInterviews();
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Bạn có chắc muốn hủy buổi phỏng vấn này?')) return;
        try {
            const res = await fetch(`/api/interviews/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CANCELLED' }),
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Đã hủy phỏng vấn');
            fetchInterviews();
        } catch {
            toast.error('Có lỗi xảy ra');
        }
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
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
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
                                        const statusStyle = interviewStatusLabels[interview.status as InterviewStatus];
                                        const feedback = interview.feedback;
                                        const recommendationStyle = feedback?.recommendation
                                            ? recommendationLabels[feedback.recommendation]
                                            : null;
                                        const interviewers = Array.isArray(interview.interviewers) ? interview.interviewers : [];

                                        return (
                                            <TableRow key={interview.id}>
                                                <TableCell className="font-medium">
                                                    {interview.candidate?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>{interview.job?.title || 'N/A'}</TableCell>
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
                                                        <span>{interviewers.length}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {statusStyle && (
                                                        <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {recommendationStyle && (
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={recommendationStyle.variant}>
                                                                {recommendationStyle.label}
                                                            </Badge>
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
                                                    <div className="flex justify-end gap-1">
                                                        {interview.status === 'SCHEDULED' && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Đánh giá"
                                                                    onClick={() => {
                                                                        setSelectedInterview(interview);
                                                                        setFbRecommendation(feedback?.recommendation || 'UNDECIDED');
                                                                        setFbRating(String(feedback?.rating || 3));
                                                                        setFbNotes(feedback?.notes || '');
                                                                        setFeedbackDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <MessageSquare className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Hủy"
                                                                    onClick={() => handleCancel(interview.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {interview.status === 'COMPLETED' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Xem đánh giá"
                                                                onClick={() => {
                                                                    setSelectedInterview(interview);
                                                                    setFbRecommendation(feedback?.recommendation || 'UNDECIDED');
                                                                    setFbRating(String(feedback?.rating || 3));
                                                                    setFbNotes(feedback?.notes || '');
                                                                    setFeedbackDialogOpen(true);
                                                                }}
                                                            >
                                                                <MessageSquare className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
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
                        </>
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
                                    {selectedInterview.candidate?.name} - {selectedInterview.job?.title}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Kết quả</Label>
                                    <Select value={fbRecommendation} onValueChange={setFbRecommendation}>
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
                                    <Select value={fbRating} onValueChange={setFbRating}>
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
                                        value={fbNotes}
                                        onChange={(e) => setFbNotes(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleSaveFeedback} disabled={submitting}>
                                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Lưu đánh giá
                                </Button>
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
                            <Select value={schedCandidateId} onValueChange={setSchedCandidateId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn ứng viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    {candidates.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name} - {c.job?.title || 'N/A'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Ngày</Label>
                                <Input type="date" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} />
                            </div>
                            <div>
                                <Label>Giờ</Label>
                                <Input type="time" value={schedTime} onChange={(e) => setSchedTime(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <Label>Thời lượng (phút)</Label>
                            <Select value={schedDuration} onValueChange={setSchedDuration}>
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
                            <Select value={schedType} onValueChange={setSchedType}>
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
                            <Input
                                placeholder="Nhập tên người phỏng vấn"
                                value={schedInterviewerName}
                                onChange={(e) => setSchedInterviewerName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSchedule} disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Tạo lịch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
