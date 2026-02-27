'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    BarChart3,
    Download,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    Minus,
    Award,
    Loader2,
} from 'lucide-react';

const rankingConfigs = [
    { label: 'A', name: 'Xuất sắc', minScore: 90, maxScore: 100, color: 'green' },
    { label: 'B', name: 'Tốt', minScore: 75, maxScore: 89, color: 'blue' },
    { label: 'C', name: 'Đạt', minScore: 60, maxScore: 74, color: 'yellow' },
    { label: 'D', name: 'Cần cải thiện', minScore: 0, maxScore: 59, color: 'red' },
];

function getRankingFromScore(score: number) {
    return rankingConfigs.find(c => score >= c.minScore && score <= c.maxScore) || rankingConfigs[3];
}

interface ReviewCycleOption {
    id: string;
    name: string;
}

interface EvaluationResult {
    id: string;
    reviewCycleId: string;
    employeeName: string;
    departmentName: string;
    selfScore: number | null;
    managerScore: number | null;
    finalScore: number | null;
    status: string;
}

export default function ResultsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('');
    const [cycles, setCycles] = useState<ReviewCycleOption[]>([]);
    const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [cycleRes, evalRes] = await Promise.all([
                    fetch('/api/reviews'),
                    fetch('/api/evaluations'),
                ]);
                const cycleJson = await cycleRes.json();
                const evalJson = await evalRes.json();
                const cycleData = cycleJson.data || [];
                setCycles(cycleData.map((c: any) => ({ id: c.id, name: c.name })));
                setEvaluations(evalJson.data || []);
                if (cycleData.length > 0) setSelectedPeriod(cycleData[0].id);
            } catch {
                setCycles([]);
                setEvaluations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const periodResults = evaluations
        .filter(r => r.reviewCycleId === selectedPeriod && r.finalScore !== null)
        .map(r => ({
            ...r,
            ranking: getRankingFromScore(r.finalScore || 0).label,
        }))
        .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));

    const distribution = rankingConfigs.map(config => ({
        ...config,
        count: periodResults.filter(r => r.ranking === config.label).length,
        percent: periodResults.length > 0
            ? Math.round((periodResults.filter(r => r.ranking === config.label).length / periodResults.length) * 100)
            : 0,
    }));

    // Dept stats
    const deptStats = periodResults.reduce((acc, result) => {
        const dept = result.departmentName || 'Khác';
        if (!acc[dept]) acc[dept] = { name: dept, scores: [] };
        acc[dept].scores.push(result.finalScore || 0);
        return acc;
    }, {} as Record<string, { name: string; scores: number[] }>);

    const departmentAverages = Object.entries(deptStats).map(([key, data]) => ({
        id: key,
        name: data.name,
        avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
        count: data.scores.length,
    })).sort((a, b) => b.avgScore - a.avgScore);

    const overallAvg = periodResults.length > 0
        ? Math.round(periodResults.reduce((sum, r) => sum + (r.finalScore || 0), 0) / periodResults.length)
        : 0;

    const getScoreTrend = (score: number, avg: number) => {
        if (score > avg + 5) return { icon: TrendingUp, color: 'text-green-500' };
        if (score < avg - 5) return { icon: TrendingDown, color: 'text-red-500' };
        return { icon: Minus, color: 'text-gray-500' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        Kết quả xếp loại
                    </h1>
                    <p className="text-muted-foreground">Tổng hợp và duyệt kết quả đánh giá</p>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Chọn kỳ" />
                        </SelectTrigger>
                        <SelectContent>
                            {cycles.map(period => (
                                <SelectItem key={period.id} value={period.id}>{period.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                </div>
            </div>

            {/* Distribution Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {distribution.map((config) => (
                    <Card key={config.label}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-3 h-3 rounded-full bg-${config.color}-500`} />
                                        <span className="font-semibold">Loại {config.label}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{config.name}</p>
                                    <p className="text-xs text-muted-foreground">({config.minScore}-{config.maxScore} điểm)</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold">{config.count}</p>
                                    <p className="text-sm text-muted-foreground">{config.percent}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Results Table */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Bảng xếp hạng nhân viên</CardTitle>
                        <CardDescription>Điểm tổng hợp</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nhân viên</TableHead>
                                    <TableHead className="text-center">Tự đánh giá</TableHead>
                                    <TableHead className="text-center">Quản lý</TableHead>
                                    <TableHead className="text-center">Tổng</TableHead>
                                    <TableHead className="text-center">Xếp loại</TableHead>
                                    <TableHead className="text-center">Duyệt</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {periodResults.map((result) => {
                                    const rankConfig = getRankingFromScore(result.finalScore || 0);
                                    const trend = getScoreTrend(result.finalScore || 0, overallAvg);
                                    const TrendIcon = trend.icon;

                                    return (
                                        <TableRow key={result.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{result.employeeName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{result.employeeName}</div>
                                                        <div className="text-xs text-muted-foreground">{result.departmentName}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{result.selfScore || '-'}</TableCell>
                                            <TableCell className="text-center">{result.managerScore || '-'}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="font-bold text-lg">{result.finalScore}</span>
                                                    <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={`bg-${rankConfig.color}-100 text-${rankConfig.color}-700`}>
                                                    <Award className="h-3 w-3 mr-1" />
                                                    {result.ranking}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {result.status === 'APPROVED' ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                                ) : result.status === 'DRAFT' ? (
                                                    <Clock className="h-5 w-5 text-orange-500 mx-auto" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        {periodResults.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">Không có kết quả nào</div>
                        )}
                    </CardContent>
                </Card>

                {/* Department Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Theo phòng ban</CardTitle>
                        <CardDescription>Điểm trung bình theo bộ phận</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {departmentAverages.map((dept, index) => {
                            const rankConfig = getRankingFromScore(dept.avgScore);
                            return (
                                <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-muted text-muted-foreground'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium">{dept.name}</div>
                                            <div className="text-xs text-muted-foreground">{dept.count} nhân viên</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg">{dept.avgScore}</div>
                                        <Badge variant="outline" className={`text-${rankConfig.color}-700`}>
                                            Loại {rankConfig.label}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                        {departmentAverages.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground">Không có dữ liệu</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
