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
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EnrollmentItem {
    id: string;
    userId: string;
    userName: string | null;
    courseId: string;
    courseName: string;
    enrolledAt: string;
    completedAt: string | null;
    progress: number;
    score: number | null;
    status: string;
}

export default function HistoryPage() {
    const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/enrollments');
                const json = await res.json();
                setEnrollments(json.data || []);
            } catch {
                setEnrollments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = enrollments.filter(e =>
        (e.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoàn thành</Badge>;
            case 'IN_PROGRESS': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đang học</Badge>;
            case 'FAILED': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Chưa đạt</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
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
            <div>
                <h1 className="text-2xl font-bold">Lịch sử đào tạo</h1>
                <p className="text-muted-foreground">Theo dõi tiến độ và kết quả học tập của nhân viên.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Danh sách học viên</CardTitle>
                        <div className="relative w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm nhân viên, khóa học..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Khóa học</TableHead>
                                <TableHead>Ngày đăng ký</TableHead>
                                <TableHead>Tiến độ</TableHead>
                                <TableHead>Điểm số</TableHead>
                                <TableHead>Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.userName || '-'}</TableCell>
                                    <TableCell>{item.courseName}</TableCell>
                                    <TableCell>{new Date(item.enrolledAt).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell className="w-[150px]">
                                        <div className="flex items-center gap-2">
                                            <Progress value={item.progress} className="h-2" />
                                            <span className="text-xs text-muted-foreground">{item.progress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.score ?? '-'}</TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filtered.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">Không có dữ liệu</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
