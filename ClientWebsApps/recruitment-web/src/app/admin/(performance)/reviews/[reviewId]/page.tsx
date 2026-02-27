'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, ArrowLeft, PlayCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewCycleDetail {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    type: string;
}

interface ParticipantItem {
    id: string;
    employeeCode: string;
    fullName: string;
    departmentName: string;
    positionName: string;
    evaluationStatus: string;
    score: number | null;
}

export default function ReviewCycleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const reviewId = params.reviewId as string;
    const [searchQuery, setSearchQuery] = useState('');
    const [cycle, setCycle] = useState<ReviewCycleDetail | null>(null);
    const [participants, setParticipants] = useState<ParticipantItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch cycle info
                const cycleRes = await fetch('/api/reviews');
                const cycleJson = await cycleRes.json();
                const foundCycle = (cycleJson.data || []).find((c: any) => c.id === reviewId);
                setCycle(foundCycle || null);

                // Fetch evaluations for this cycle
                const evalRes = await fetch(`/api/evaluations?reviewCycleId=${reviewId}`);
                const evalJson = await evalRes.json();
                const evals = evalJson.data || [];

                // Fetch employees
                const empRes = await fetch('/api/employees');
                const empJson = await empRes.json();
                const employees = empJson.data || [];

                // Map employees with evaluation status
                const participantList: ParticipantItem[] = employees.map((emp: any) => {
                    const evaluation = evals.find((e: any) => e.employeeId === emp.id);
                    return {
                        id: emp.id,
                        employeeCode: emp.employeeCode,
                        fullName: emp.fullName,
                        departmentName: emp.departmentName || '',
                        positionName: emp.positionName || '',
                        evaluationStatus: evaluation?.status || 'NOT_STARTED',
                        score: evaluation?.finalScore || null,
                    };
                });
                setParticipants(participantList);
            } catch {
                setCycle(null);
                setParticipants([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reviewId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (!cycle) {
        return <div className="p-8 text-center text-muted-foreground">Không tìm thấy kỳ đánh giá</div>;
    }

    const filteredParticipants = participants.filter(p =>
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const completedCount = filteredParticipants.filter(p => p.evaluationStatus === 'APPROVED').length;
    const progress = filteredParticipants.length > 0 ? (completedCount / filteredParticipants.length) * 100 : 0;

    const handleStartEvaluation = (employeeId: string) => {
        toast.info('Chuyển đến trang đánh giá');
        router.push(`/admin/reviews/${reviewId}/evaluate/${employeeId}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'NOT_STARTED': return <Badge variant="outline">Chưa bắt đầu</Badge>;
            case 'DRAFT': return <Badge variant="secondary">Đang đánh giá</Badge>;
            case 'SUBMITTED': return <Badge variant="default" className="bg-blue-500">Đã gửi</Badge>;
            case 'APPROVED': return <Badge variant="default" className="bg-green-600">Hoàn thành</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{cycle.name}</h1>
                    <p className="text-muted-foreground">
                        {new Date(cycle.startDate).toLocaleDateString('vi-VN')} - {new Date(cycle.endDate).toLocaleDateString('vi-VN')} • {cycle.type}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tiến độ hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedCount} / {filteredParticipants.length}</div>
                        <Progress value={progress} className="mt-2 h-2" />
                        <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}% nhân sự đã hoàn thành đánh giá</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm nhân viên, phòng ban..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Xuất báo cáo</Button>
                    <Button>Gửi nhắc nhở</Button>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nhân viên</TableHead>
                            <TableHead>Phòng ban</TableHead>
                            <TableHead>Vị trí</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Kết quả (Điểm)</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredParticipants.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{p.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{p.fullName}</div>
                                            <div className="text-xs text-muted-foreground">{p.employeeCode}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{p.departmentName}</TableCell>
                                <TableCell>{p.positionName}</TableCell>
                                <TableCell>{getStatusBadge(p.evaluationStatus)}</TableCell>
                                <TableCell>
                                    {p.score ? (
                                        <span className={`font-bold ${p.score >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                                            {p.score}/100
                                        </span>
                                    ) : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    {p.evaluationStatus === 'APPROVED' ? (
                                        <Button variant="ghost" size="sm" onClick={() => handleStartEvaluation(p.id)}>
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                            Xem kết quả
                                        </Button>
                                    ) : (
                                        <Button size="sm" onClick={() => handleStartEvaluation(p.id)}>
                                            <PlayCircle className="mr-2 h-4 w-4" />
                                            Đánh giá
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
