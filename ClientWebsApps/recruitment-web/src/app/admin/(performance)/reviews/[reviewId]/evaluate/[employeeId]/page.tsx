'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const evaluationSchema = z.object({
    kpiResults: z.array(z.object({
        kpiId: z.string(),
        kpiName: z.string(),
        target: z.number(),
        weight: z.number(),
        actual: z.coerce.number().min(0, 'Kết quả thực tế phải >= 0'),
        score: z.number().optional(),
        comment: z.string().optional(),
    })),
    strengths: z.string().optional(),
    weaknesses: z.string().optional(),
    developmentPlan: z.string().optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

interface EmployeeInfo {
    id: string;
    employeeCode: string;
    fullName: string;
    departmentName: string;
    positionName: string;
    hireDate: string;
}

interface ReviewCycleInfo {
    id: string;
    name: string;
}

interface KPIItem {
    id: string;
    name: string;
    target: number;
    weight: number;
    departmentId: string | null;
}

export default function EvaluationFormPage() {
    const params = useParams();
    const router = useRouter();
    const reviewId = params.reviewId as string;
    const employeeId = params.employeeId as string;
    const [isLoading, setIsLoading] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [pageLoading, setPageLoading] = useState(true);
    const [cycle, setCycle] = useState<ReviewCycleInfo | null>(null);
    const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
    const [existingEval, setExistingEval] = useState<any>(null);

    const form = useForm<EvaluationFormValues>({
        resolver: zodResolver(evaluationSchema) as any,
        defaultValues: {
            kpiResults: [],
            strengths: '',
            weaknesses: '',
            developmentPlan: '',
        },
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: 'kpiResults',
    });

    useEffect(() => {
        const fetchData = async () => {
            setPageLoading(true);
            try {
                const [cycleRes, evalRes, kpiRes, empRes] = await Promise.all([
                    fetch('/api/reviews'),
                    fetch(`/api/evaluations?reviewCycleId=${reviewId}`),
                    fetch('/api/kpis'),
                    fetch('/api/employees'),
                ]);
                const cycleJson = await cycleRes.json();
                const evalJson = await evalRes.json();
                const kpiJson = await kpiRes.json();
                const empJson = await empRes.json();

                const foundCycle = (cycleJson.data || []).find((c: any) => c.id === reviewId);
                setCycle(foundCycle || null);

                const foundEmp = (empJson.data || []).find((e: any) => e.id === employeeId);
                setEmployee(foundEmp || null);

                const foundEval = (evalJson.data || []).find((e: any) => e.employeeId === employeeId);
                setExistingEval(foundEval || null);

                // Build kpiResults
                const kpis: KPIItem[] = kpiJson.data || [];
                const relevantKpis = kpis.filter(k => !k.departmentId || k.departmentId === foundEmp?.departmentId);

                let defaultKpis;
                if (foundEval?.kpiResults && Array.isArray(foundEval.kpiResults)) {
                    defaultKpis = foundEval.kpiResults;
                } else {
                    defaultKpis = relevantKpis.map(k => ({
                        kpiId: k.id,
                        kpiName: k.name,
                        target: k.target,
                        weight: k.weight,
                        actual: 0,
                        score: 0,
                        comment: '',
                    }));
                }

                form.reset({
                    kpiResults: defaultKpis,
                    strengths: foundEval?.strengths || '',
                    weaknesses: foundEval?.weaknesses || '',
                    developmentPlan: foundEval?.developmentPlan || '',
                });
            } catch {
                setCycle(null);
                setEmployee(null);
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [reviewId, employeeId]);

    // Calculate score
    const kpiResults = form.watch('kpiResults');
    useEffect(() => {
        let score = 0;
        (kpiResults || []).forEach(item => {
            if (item.target > 0) {
                const achievementRate = Math.min(item.actual / item.target, 1.2);
                score += achievementRate * item.weight;
            }
        });
        setTotalScore(Math.round(score));
    }, [kpiResults]);

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (!cycle || !employee) return <div className="p-8 text-center text-muted-foreground">Không tìm thấy dữ liệu</div>;

    const handleSubmit = async (values: EvaluationFormValues, isDraft: boolean) => {
        setIsLoading(true);
        try {
            const body = {
                ...(existingEval ? { id: existingEval.id } : {}),
                reviewCycleId: reviewId,
                employeeId,
                kpiResults: values.kpiResults,
                strengths: values.strengths,
                weaknesses: values.weaknesses,
                developmentPlan: values.developmentPlan,
                finalScore: totalScore,
                status: isDraft ? 'DRAFT' : 'SUBMITTED',
            };

            const method = existingEval ? 'PATCH' : 'POST';
            await fetch('/api/evaluations', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

            toast.success(isDraft ? 'Đã lưu bản nháp' : 'Đã gửi đánh giá', {
                description: `Tổng điểm: ${totalScore}/100`
            });

            if (!isDraft) {
                router.push(`/admin/reviews/${reviewId}`);
            }
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Đánh giá nhân viên</h1>
                    <p className="text-muted-foreground">{cycle.name}</p>
                </div>
            </div>

            {/* Employee Info Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="text-xl">{employee.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex-1">
                            <h2 className="text-xl font-bold">{employee.fullName}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                                <p>Mã NV: <span className="text-foreground">{employee.employeeCode}</span></p>
                                <p>Phòng ban: <span className="text-foreground">{employee.departmentName}</span></p>
                                <p>Vị trí: <span className="text-foreground">{employee.positionName}</span></p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">Tổng điểm dự kiến</div>
                            <div className={`text-4xl font-bold ${totalScore >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                                {totalScore}<span className="text-lg text-muted-foreground font-normal">/100</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <form>
                {/* KPI Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kết quả công việc (KPIs)</CardTitle>
                        <CardDescription>Nhập kết quả thực tế cho từng chỉ số KPI được giao.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Chỉ số KPI</TableHead>
                                    <TableHead className="text-center">Trọng số</TableHead>
                                    <TableHead className="text-center">Mục tiêu</TableHead>
                                    <TableHead className="w-[120px]">Thực tế</TableHead>
                                    <TableHead className="text-center">Điểm số</TableHead>
                                    <TableHead>Nhận xét</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => {
                                    const actual = form.watch(`kpiResults.${index}.actual`) || 0;
                                    const target = field.target;
                                    const weight = field.weight;
                                    const achievementRate = target > 0 ? Math.min(actual / target, 1.2) : 0;
                                    const score = Math.round(achievementRate * weight);

                                    return (
                                        <TableRow key={field.id}>
                                            <TableCell className="font-medium align-top pt-3">
                                                {field.kpiName}
                                            </TableCell>
                                            <TableCell className="text-center align-top pt-4">
                                                <Badge variant="outline">{weight}%</Badge>
                                            </TableCell>
                                            <TableCell className="text-center align-top pt-4 font-medium">
                                                {new Intl.NumberFormat('vi-VN').format(target)}
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <Input
                                                    type="number"
                                                    {...form.register(`kpiResults.${index}.actual`)}
                                                    className="w-full text-right font-medium"
                                                />
                                            </TableCell>
                                            <TableCell className="text-center align-top pt-4 font-bold text-blue-600">
                                                {score}
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <Textarea
                                                    {...form.register(`kpiResults.${index}.comment`)}
                                                    placeholder="Ghi chú..."
                                                    className="min-h-[60px] resize-none"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4} className="text-right font-bold">Tổng đánh giá:</TableCell>
                                    <TableCell className="text-center font-bold text-lg">{totalScore}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>

                {/* Qualitative Section */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Đánh giá năng lực & Phẩm chất</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Điểm mạnh</label>
                            <Textarea
                                {...form.register('strengths')}
                                placeholder="Nhập điểm mạnh của nhân viên..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Điểm cần cải thiện</label>
                            <Textarea
                                {...form.register('weaknesses')}
                                placeholder="Nhập những điểm cần khắc phục..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kế hoạch phát triển (Development Plan)</label>
                            <Textarea
                                {...form.register('developmentPlan')}
                                placeholder="Đề xuất các khóa học hoặc lộ trình phát triển..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" type="button" onClick={() => handleSubmit(form.getValues(), true)} disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu nháp
                    </Button>
                    <Button type="button" onClick={() => handleSubmit(form.getValues(), false)} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Send className="mr-2 h-4 w-4" />
                        Gửi đánh giá
                    </Button>
                </div>
            </form>
        </div>
    );
}
