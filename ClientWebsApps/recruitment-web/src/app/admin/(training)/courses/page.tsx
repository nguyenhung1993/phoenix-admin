'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    Search,
    MoreVertical,
    BookOpen,
    Clock,
    Users,
    Star,
    LayoutGrid,
    List as ListIcon,
    Filter,
    Loader2,
} from 'lucide-react';
import { CourseDialog } from '@/components/admin/training/course-dialog';
import { CourseAssignmentDialog } from '@/components/admin/training/course-assignment-dialog';
import Image from 'next/image';

const courseStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PUBLISHED: { label: 'Đã xuất bản', variant: 'default' },
    DRAFT: { label: 'Bản nháp', variant: 'secondary' },
    ARCHIVED: { label: 'Lưu trữ', variant: 'outline' },
};

interface CourseItem {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string;
    instructor: string | null;
    duration: string | null;
    totalModules: number;
    totalLessons: number;
    category: string;
    level: string;
    students: number;
    rating: number;
    status: string;
    modules: any[];
}

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState<CourseItem | null>(null);
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/courses');
            const json = await res.json();
            const data = json.data || [];
            setCourses(data);
            const cats = [...new Set(data.map((c: CourseItem) => c.category).filter(Boolean))] as string[];
            setCategories(cats);
        } catch {
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || course.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (course: CourseItem) => {
        setCourseToEdit(course);
        setCreateDialogOpen(true);
    };

    const handleAssign = (course: CourseItem) => {
        setCourseToEdit(course);
        setAssignDialogOpen(true);
    };

    const handleCreate = () => {
        setCourseToEdit(null);
        setCreateDialogOpen(true);
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
                    <h1 className="text-2xl font-bold">Thư viện khóa học</h1>
                    <p className="text-muted-foreground">Quản lý các khóa học đào tạo nội bộ</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm khóa học
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm khóa học..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex items-center border rounded-md bg-background">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-primary bg-accent/50"><LayoutGrid className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground"><ListIcon className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden flex flex-col group hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video w-full bg-muted">
                            <Image
                                src={course.thumbnail}
                                alt={course.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute top-2 right-2">
                                <Badge variant={courseStatusLabels[course.status]?.variant || 'secondary'} className="shadow-sm">
                                    {courseStatusLabels[course.status]?.label || course.status}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start gap-2">
                                <Badge variant="outline" className="mb-2">{course.category}</Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleEdit(course)}>Chỉnh sửa thông tin</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAssign(course)}>Giao khóa học</DropdownMenuItem>
                                        <DropdownMenuItem>Quản lý nội dung</DropdownMenuItem>
                                        <DropdownMenuItem>Học viên tham gia</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">Xóa khóa học</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="text-lg line-clamp-2 leading-tight">
                                {course.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {course.description}
                            </p>
                            <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <BookOpen className="h-4 w-4" />
                                    <span>{course.totalModules} chương</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{course.duration || '-'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-4 w-4" />
                                    <span>{course.students} học viên</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-yellow-600">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span>{course.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 border-t bg-muted/20 p-4">
                            <Button variant="secondary" className="w-full">Xem chi tiết</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Không tìm thấy khóa học nào phù hợp</p>
                </div>
            )}

            <CourseDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                courseToEdit={courseToEdit as any}
            />

            <CourseAssignmentDialog
                open={assignDialogOpen}
                onOpenChange={setAssignDialogOpen}
                course={courseToEdit as any}
            />
        </div>
    );
}
