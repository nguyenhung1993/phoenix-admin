'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileQuestion, Clock, Plus, Eye, Loader2 } from 'lucide-react';

interface ExamItem {
    id: string;
    title: string;
    durationMinutes: number;
    totalQuestions: number;
    passScore: number;
    status: string;
}

export default function ExamsPage() {
    const [exams, setExams] = useState<ExamItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/exams');
                const json = await res.json();
                setExams(json.data || []);
            } catch {
                setExams([]);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

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
                    <h1 className="text-2xl font-bold">Quản lý Bài kiểm tra</h1>
                    <p className="text-muted-foreground">Ngân hàng đề thi và cấu hình bài kiểm tra.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo bài kiểm tra
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách bài kiểm tra</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead>Số câu hỏi</TableHead>
                                <TableHead>Điểm đạt</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {exams.map((exam) => (
                                <TableRow key={exam.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileQuestion className="h-4 w-4 text-blue-500" />
                                            {exam.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {exam.durationMinutes} phút
                                        </div>
                                    </TableCell>
                                    <TableCell>{exam.totalQuestions} câu</TableCell>
                                    <TableCell>{exam.passScore}/100</TableCell>
                                    <TableCell>
                                        <Badge variant={exam.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                            {exam.status === 'ACTIVE' ? 'Đang dùng' : 'Nháp'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {exams.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">Không có bài kiểm tra nào</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
