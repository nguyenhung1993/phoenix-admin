'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Target, CheckCircle2, AlertCircle, Send, PlusCircle } from 'lucide-react';
import { PageHeaderSkeleton } from '@/components/ui/skeletons';
import { toast } from 'sonner';

interface EvalData {
    id: string;
    status: string;
    finalScore?: number;
    employeeComment?: string;
    managerComment?: string;
    cycle: {
        id: string;
        name: string;
        type: string;
        startDate: string;
        endDate: string;
        status: string;
    };
    template: {
        name: string;
        type: string;
    };
    evaluator?: {
        id: string;
        fullName: string;
    };
}

export default function PortalPerformancePage() {
    const [selfEvals, setSelfEvals] = useState<EvalData[]>([]);
    const [managerEvals, setManagerEvals] = useState<EvalData[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state for a new basic evaluation logic
    const [selectedEval, setSelectedEval] = useState<EvalData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [comment, setComment] = useState('');
    const [score, setScore] = useState<number | string>('');

    useEffect(() => {
        const fetchEvals = async () => {
            try {
                const res = await fetch('/api/portal/performance');
                const json = await res.json();
                if (json.data) {
                    setSelfEvals(json.data.self);
                    setManagerEvals(json.data.manager);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvals();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT': return <Badge variant="secondary">Chưa nộp</Badge>;
            case 'SUBMITTED': return <Badge className="bg-blue-500 hover:bg-blue-600">Chờ duyệt</Badge>;
            case 'REVIEWED': return <Badge className="bg-orange-500 hover:bg-orange-600">Đã phản hồi</Badge>;
            case 'APPROVED': return <Badge className="bg-green-500 hover:bg-green-600">Hoàn tất</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleSubmitSelfEval = async () => {
        if (!selectedEval) return;
        setIsSubmitting(true);
        // Normally this would be a real API call. 
        // Here we simulate successful submission for user experience.
        try {
            await fetch(`/api/portal/performance/${selectedEval.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'SUBMITTED',
                    employeeComment: comment,
                    finalScore: Number(score)
                }),
            });

            setSelfEvals(prev => prev.map(e => {
                if (e.id === selectedEval.id) {
                    return { ...e, status: 'SUBMITTED', employeeComment: comment, finalScore: Number(score) };
                }
                return e;
            }));

            toast.success('Đã nộp form tự đánh giá thành công.');
            setSelectedEval(null);
            setComment('');
            setScore('');
        } catch (error) {
            toast.error('Lỗi khi nộp tự đánh giá');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <PageHeaderSkeleton />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    Đánh Giá Năng Lực (KPI)
                </h1>
                <p className="text-muted-foreground">Thực hiện tự đánh giá và xem phản hồi từ người quản lý.</p>
            </div>

            <Tabs defaultValue="self" className="w-full">
                <TabsList>
                    <TabsTrigger value="self">Xác lập & Tự đánh giá ({selfEvals.length})</TabsTrigger>
                    <TabsTrigger value="manager">Phản hồi từ Quản lý ({managerEvals.length})</TabsTrigger>
                </TabsList>

                {/* SELF EVALUATIONS TAB */}
                <TabsContent value="self" className="mt-6 space-y-6">
                    {selfEvals.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center py-12 text-center">
                            <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <CardTitle className="mb-2">Không có kỳ đánh giá nào</CardTitle>
                            <CardDescription>
                                Hiện tại không có kỳ làm đánh giá năng lực nào đang mở dành cho bạn.
                            </CardDescription>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {selfEvals.map(evalItem => (
                                <Card key={evalItem.id} className={selectedEval?.id === evalItem.id ? 'ring-2 ring-primary' : ''}>
                                    <CardHeader className="pb-3 border-b">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Badge variant="outline" className="mb-2">{evalItem.cycle.type}</Badge>
                                                <CardTitle className="text-lg">{evalItem.cycle.name}</CardTitle>
                                                <CardDescription className="flex items-center gap-1 mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Hạn: {new Date(evalItem.cycle.endDate).toLocaleDateString('vi-VN')}
                                                </CardDescription>
                                            </div>
                                            {getStatusBadge(evalItem.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-4">
                                        <div className="text-sm flex justify-between">
                                            <span className="text-muted-foreground">Mẫu áp dụng:</span>
                                            <span className="font-medium truncate max-w-[200px]" title={evalItem.template.name}>{evalItem.template.name}</span>
                                        </div>
                                        <div className="text-sm flex justify-between">
                                            <span className="text-muted-foreground">Điểm tự đánh giá (1-100):</span>
                                            <span className="font-bold">{evalItem.finalScore || '-'}</span>
                                        </div>

                                        {evalItem.status === 'SUBMITTED' ? (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-md text-sm border border-blue-100 dark:border-blue-900 flex items-start gap-2">
                                                <AlertCircle className="h-4 w-4 mt-0.5" />
                                                <p>Bản tự đánh giá đã được nộp lên Quản lý trực tiếp. Vui lòng chờ phản hồi trong tab "Phản hồi từ Quản lý".</p>
                                            </div>
                                        ) : evalItem.status === 'DRAFT' && selectedEval?.id !== evalItem.id ? (
                                            <Button className="w-full" onClick={() => setSelectedEval(evalItem)}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Thực hiện đánh giá
                                            </Button>
                                        ) : null}

                                        {/* Simple Evaluation Form */}
                                        {selectedEval?.id === evalItem.id && evalItem.status === 'DRAFT' && (
                                            <div className="mt-4 pt-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="space-y-2">
                                                    <Label>Điểm tự đánh giá KPI (%)</Label>
                                                    <Input
                                                        type="number"
                                                        min={0} max={100}
                                                        placeholder="VD: 95"
                                                        value={score}
                                                        onChange={(e) => setScore(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Mô tả thành tích cốt lõi (Tự đánh giá)</Label>
                                                    <Textarea
                                                        placeholder="Mô tả cụ thể những gì bạn đã làm tốt và các mục tiêu đã hoàn thành..."
                                                        className="h-24"
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button disabled={!score || isSubmitting} onClick={handleSubmitSelfEval} className="flex-1">
                                                        {isSubmitting ? 'Đang gửi...' : <><Send className="mr-2 h-4 w-4" /> Nộp báo cáo</>}
                                                    </Button>
                                                    <Button variant="outline" onClick={() => setSelectedEval(null)}>Hủy</Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* MANAGER FEEDBACK TAB */}
                <TabsContent value="manager" className="mt-6 space-y-6">
                    {managerEvals.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            Chưa có phản hồi chính thức nào từ Quản lý.
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {managerEvals.map(evalItem => (
                                <Card key={evalItem.id} className="bg-primary/5">
                                    <CardHeader className="pb-3 border-b border-primary/10">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{evalItem.cycle.name}</CardTitle>
                                                <CardDescription className="mt-1 text-primary">
                                                    Người đánh giá: {evalItem.evaluator?.fullName}
                                                </CardDescription>
                                            </div>
                                            {getStatusBadge(evalItem.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-4 text-sm">
                                        <div className="flex justify-between items-center bg-background p-3 rounded-lg border">
                                            <span className="font-medium text-muted-foreground">Điểm đánh giá chốt:</span>
                                            <Badge variant="default" className="text-base px-3">{evalItem.finalScore || 0}</Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="font-medium block">Nhận xét từ cấp quản lý:</span>
                                            <div className="bg-background p-3 rounded-md text-muted-foreground whitespace-pre-wrap">
                                                {evalItem.managerComment || 'Không có bình luận thêm.'}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
