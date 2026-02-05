'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    mockTrainingClasses,
    mockEnrollments,
    classStatusLabels,
    ClassStatus,
} from '@/lib/mocks';
import {
    Users,
    Plus,
    Eye,
    Calendar,
    MapPin,
    User,
    Clock,
} from 'lucide-react';

export default function ClassesPage() {
    const [statusFilter, setStatusFilter] = useState<ClassStatus | 'ALL'>('ALL');

    const filteredClasses = mockTrainingClasses.filter((cls) => {
        return statusFilter === 'ALL' || cls.status === statusFilter;
    });

    const classesByStatus = {
        ALL: mockTrainingClasses.length,
        SCHEDULED: mockTrainingClasses.filter(c => c.status === 'SCHEDULED').length,
        IN_PROGRESS: mockTrainingClasses.filter(c => c.status === 'IN_PROGRESS').length,
        COMPLETED: mockTrainingClasses.filter(c => c.status === 'COMPLETED').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý lớp học</h1>
                    <p className="text-muted-foreground">Lịch đào tạo và quản lý học viên</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo lớp học mới
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng lớp học</p>
                                <p className="text-2xl font-bold">{classesByStatus.ALL}</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đã lên lịch</p>
                                <p className="text-2xl font-bold text-blue-600">{classesByStatus.SCHEDULED}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang diễn ra</p>
                                <p className="text-2xl font-bold text-green-600">{classesByStatus.IN_PROGRESS}</p>
                            </div>
                            <Clock className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                                <p className="text-2xl font-bold">{classesByStatus.COMPLETED}</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Tabs */}
            <Tabs defaultValue="ALL" onValueChange={(v) => setStatusFilter(v as ClassStatus | 'ALL')}>
                <TabsList className="flex-wrap h-auto gap-2">
                    <TabsTrigger value="ALL" className="gap-2">
                        Tất cả <Badge variant="secondary">{classesByStatus.ALL}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="SCHEDULED" className="gap-2">
                        Đã lên lịch <Badge variant="secondary">{classesByStatus.SCHEDULED}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="IN_PROGRESS" className="gap-2">
                        Đang diễn ra <Badge variant="secondary">{classesByStatus.IN_PROGRESS}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="COMPLETED" className="gap-2">
                        Hoàn thành <Badge variant="secondary">{classesByStatus.COMPLETED}</Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Classes Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách lớp học</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Khóa học</TableHead>
                                <TableHead>Giảng viên</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead>Địa điểm</TableHead>
                                <TableHead>Học viên</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClasses.map((cls) => {
                                const statusStyle = classStatusLabels[cls.status];
                                const fillRate = (cls.enrolledCount / cls.maxParticipants) * 100;

                                return (
                                    <TableRow key={cls.id}>
                                        <TableCell className="font-medium">{cls.courseName}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                {cls.instructor}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {new Date(cls.startDate).toLocaleDateString('vi-VN')}
                                                    {cls.startDate !== cls.endDate && (
                                                        <> - {new Date(cls.endDate).toLocaleDateString('vi-VN')}</>
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate max-w-[150px]">{cls.location}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm">
                                                    {cls.enrolledCount}/{cls.maxParticipants}
                                                </span>
                                                <Progress value={fillRate} className="w-16 h-2" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredClasses.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không có lớp học nào
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
