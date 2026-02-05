'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    mockExams,
    mockExamResults,
    examStatusLabels,
    ExamStatus,
} from '@/lib/mocks';
import {
    FileQuestion,
    Plus,
    Eye,
    Edit,
    Clock,
    CheckCircle,
    XCircle,
    Users,
    Award,
} from 'lucide-react';

export default function ExamsPage() {
    const [statusFilter, setStatusFilter] = useState<ExamStatus | 'ALL'>('ALL');

    const filteredExams = mockExams.filter((exam) => {
        return statusFilter === 'ALL' || exam.status === statusFilter;
    });

    const stats = {
        totalExams: mockExams.length,
        activeExams: mockExams.filter(e => e.status === 'ACTIVE').length,
        totalResults: mockExamResults.length,
        passRate: Math.round(
            (mockExamResults.filter(r => r.passed).length / mockExamResults.length) * 100
        ) || 0,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Bài kiểm tra</h1>
                    <p className="text-muted-foreground">Quản lý bài kiểm tra và xem kết quả</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo bài kiểm tra
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng bài kiểm tra</p>
                                <p className="text-2xl font-bold">{stats.totalExams}</p>
                            </div>
                            <FileQuestion className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                                <p className="text-2xl font-bold text-green-600">{stats.activeExams}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Lượt làm bài</p>
                                <p className="text-2xl font-bold">{stats.totalResults}</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tỷ lệ đạt</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.passRate}%</p>
                            </div>
                            <Award className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="exams">
                <TabsList>
                    <TabsTrigger value="exams">Danh sách bài kiểm tra</TabsTrigger>
                    <TabsTrigger value="results">Kết quả</TabsTrigger>
                </TabsList>

                <TabsContent value="exams" className="space-y-4">
                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <Button
                            variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('ALL')}
                        >
                            Tất cả
                        </Button>
                        <Button
                            variant={statusFilter === 'ACTIVE' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('ACTIVE')}
                        >
                            Đang hoạt động
                        </Button>
                        <Button
                            variant={statusFilter === 'DRAFT' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('DRAFT')}
                        >
                            Nháp
                        </Button>
                    </div>

                    {/* Exams Table */}
                    <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên bài kiểm tra</TableHead>
                                        <TableHead>Khóa học</TableHead>
                                        <TableHead className="text-center">Thời gian</TableHead>
                                        <TableHead className="text-center">Câu hỏi</TableHead>
                                        <TableHead className="text-center">Điểm đạt</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredExams.map((exam) => {
                                        const statusStyle = examStatusLabels[exam.status];

                                        return (
                                            <TableRow key={exam.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{exam.title}</p>
                                                        <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                                                            {exam.description}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{exam.courseName}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span>{exam.duration} phút</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-mono">
                                                    {exam.totalQuestions}
                                                </TableCell>
                                                <TableCell className="text-center font-mono">
                                                    {exam.passingScore}%
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            {filteredExams.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    Không có bài kiểm tra nào
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="results">
                    {/* Exam Results Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kết quả làm bài</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nhân viên</TableHead>
                                        <TableHead>Bài kiểm tra</TableHead>
                                        <TableHead className="text-center">Điểm</TableHead>
                                        <TableHead className="text-center">Kết quả</TableHead>
                                        <TableHead className="text-center">Thời gian làm</TableHead>
                                        <TableHead>Ngày làm</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockExamResults.map((result) => (
                                        <TableRow key={result.id}>
                                            <TableCell className="font-medium">{result.employeeName}</TableCell>
                                            <TableCell className="text-muted-foreground">{result.examTitle}</TableCell>
                                            <TableCell className="text-center">
                                                <span className={`font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                    {result.score}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {result.passed ? (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Đạt
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-red-100 text-red-800">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Chưa đạt
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center font-mono">
                                                {result.duration} phút
                                            </TableCell>
                                            <TableCell>
                                                {new Date(result.completedAt).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {mockExamResults.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    Chưa có kết quả nào
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
