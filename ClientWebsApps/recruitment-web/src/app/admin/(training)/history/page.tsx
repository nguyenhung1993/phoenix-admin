'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    mockEnrollments,
    enrollmentStatusLabels,
    EnrollmentStatus,
} from '@/lib/mocks';
import {
    History,
    GraduationCap,
    CheckCircle,
    Clock,
    Search,
    TrendingUp,
    Trophy,
} from 'lucide-react';

export default function LearningHistoryPage() {
    const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEnrollments = mockEnrollments.filter((enroll) => {
        const matchesStatus = statusFilter === 'ALL' || enroll.status === statusFilter;
        const matchesSearch =
            enroll.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            enroll.courseName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: mockEnrollments.length,
        completed: mockEnrollments.filter(e => e.status === 'COMPLETED').length,
        inProgress: mockEnrollments.filter(e => e.status === 'IN_PROGRESS').length,
        avgScore: Math.round(
            mockEnrollments.filter(e => e.score).reduce((sum, e) => sum + (e.score || 0), 0) /
            mockEnrollments.filter(e => e.score).length || 0
        ),
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Lịch sử học tập</h1>
                <p className="text-muted-foreground">Theo dõi tiến độ học tập của nhân viên</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng đăng ký</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <History className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang học</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Điểm TB</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.avgScore}</p>
                            </div>
                            <Trophy className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên nhân viên hoặc khóa học..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as EnrollmentStatus | 'ALL')}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả</SelectItem>
                        <SelectItem value="ENROLLED">Đã đăng ký</SelectItem>
                        <SelectItem value="IN_PROGRESS">Đang học</SelectItem>
                        <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                        <SelectItem value="DROPPED">Bỏ học</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Learning History Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Lịch sử đăng ký học
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Khóa học</TableHead>
                                <TableHead>Ngày đăng ký</TableHead>
                                <TableHead>Tiến độ</TableHead>
                                <TableHead className="text-center">Điểm</TableHead>
                                <TableHead>Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEnrollments.map((enroll) => {
                                const statusStyle = enrollmentStatusLabels[enroll.status];

                                return (
                                    <TableRow key={enroll.id}>
                                        <TableCell className="font-medium">{enroll.employeeName}</TableCell>
                                        <TableCell>{enroll.courseName}</TableCell>
                                        <TableCell>
                                            {new Date(enroll.enrolledAt).toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 min-w-[120px]">
                                                <Progress value={enroll.progress} className="flex-1 h-2" />
                                                <span className="text-sm font-mono w-10 text-right">
                                                    {enroll.progress}%
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {enroll.score ? (
                                                <span className={`font-bold ${enroll.score >= 80 ? 'text-green-600' : enroll.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {enroll.score}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredEnrollments.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không tìm thấy lịch sử học tập nào
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
