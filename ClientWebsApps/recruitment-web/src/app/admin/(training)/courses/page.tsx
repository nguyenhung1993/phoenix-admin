'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    mockCourses,
    mockTrainingClasses,
    mockEnrollments,
    courseStatusLabels,
    courseLevelLabels,
    Course,
    CourseStatus,
} from '@/lib/mocks';
import {
    GraduationCap,
    Plus,
    Search,
    Eye,
    Edit,
    BookOpen,
    Users,
    Clock,
} from 'lucide-react';

export default function CoursesPage() {
    const [statusFilter, setStatusFilter] = useState<CourseStatus | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    const filteredCourses = mockCourses.filter((course) => {
        const matchesStatus = statusFilter === 'ALL' || course.status === statusFilter;
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: mockCourses.length,
        active: mockCourses.filter(c => c.status === 'ACTIVE').length,
        totalClasses: mockTrainingClasses.length,
        totalEnrollments: mockEnrollments.length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
                    <p className="text-muted-foreground">Danh mục các khóa đào tạo nội bộ</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm khóa học
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng khóa học</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <GraduationCap className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <BookOpen className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Lớp học</p>
                                <p className="text-2xl font-bold">{stats.totalClasses}</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Học viên</p>
                                <p className="text-2xl font-bold">{stats.totalEnrollments}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm khóa học..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Tabs defaultValue="ALL" onValueChange={(v) => setStatusFilter(v as CourseStatus | 'ALL')}>
                    <TabsList>
                        <TabsTrigger value="ALL">Tất cả</TabsTrigger>
                        <TabsTrigger value="ACTIVE">Đang hoạt động</TabsTrigger>
                        <TabsTrigger value="DRAFT">Nháp</TabsTrigger>
                        <TabsTrigger value="ARCHIVED">Lưu trữ</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Courses Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã</TableHead>
                                <TableHead>Tên khóa học</TableHead>
                                <TableHead>Cấp độ</TableHead>
                                <TableHead className="text-center">Thời lượng</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCourses.map((course) => {
                                const statusStyle = courseStatusLabels[course.status];
                                const levelStyle = courseLevelLabels[course.level];

                                return (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-mono text-sm">{course.code}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{course.name}</p>
                                                <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                                                    {course.description}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${levelStyle.color}`}>
                                                {levelStyle.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>{course.duration}h</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        setDetailDialogOpen(true);
                                                    }}
                                                >
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

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không tìm thấy khóa học nào
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-lg">
                    {selectedCourse && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedCourse.name}</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Badge variant="outline">{selectedCourse.code}</Badge>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${courseLevelLabels[selectedCourse.level].color}`}>
                                        {courseLevelLabels[selectedCourse.level].label}
                                    </span>
                                    <Badge variant={courseStatusLabels[selectedCourse.status].variant}>
                                        {courseStatusLabels[selectedCourse.status].label}
                                    </Badge>
                                </div>

                                <p className="text-muted-foreground">{selectedCourse.description}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Thời lượng</p>
                                        <p className="font-medium">{selectedCourse.duration} giờ</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ngày tạo</p>
                                        <p className="font-medium">{new Date(selectedCourse.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button variant="outline" className="flex-1">
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Xem lớp học
                                    </Button>
                                    <Button className="flex-1">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Chỉnh sửa
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
