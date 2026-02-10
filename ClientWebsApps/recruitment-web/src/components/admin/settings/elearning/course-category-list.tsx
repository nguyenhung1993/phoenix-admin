'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, MoreHorizontal, GraduationCap, BookOpen } from 'lucide-react';
import { mockCourseCategories, CourseCategory } from '@/lib/mocks/settings-hr';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CourseCategoryDialog } from './course-category-dialog';
import { toast } from 'sonner';

export function CourseCategoryList() {
    const [categories, setCategories] = useState<CourseCategory[]>(mockCourseCategories);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CourseCategory | null>(null);

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (category: CourseCategory) => {
        setSelectedCategory(category);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            setCategories(prev => prev.filter(c => c.id !== id));
            toast.success("Đã xóa danh mục thành công");
        }
    };

    const handleSubmit = (values: any, id?: string) => {
        if (id) {
            // Update
            setCategories(prev => prev.map(c => c.id === id ? { ...c, ...values } : c));
            toast.success("Cập nhật danh mục thành công");
        } else {
            // Create
            const newCategory: CourseCategory = {
                id: Math.random().toString(36).substr(2, 9),
                courseCount: 0,
                ...values
            };
            setCategories(prev => [...prev, newCategory]);
            toast.success("Tạo danh mục thành công");
        }
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Danh mục Đào tạo</h3>
                    <p className="text-sm text-muted-foreground">Quản lý các nhóm khóa học và chương trình đào tạo.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
                </Button>
            </div>
            <Separator />

            <Card>
                <CardHeader className="px-6 py-4 pb-3">
                    <CardTitle className="text-base">Danh sách danh mục ({categories.length})</CardTitle>
                    <CardDescription>Phân loại các khóa học trong hệ thống LMS</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table className="[&_tr>th]:px-6 [&_tr>td]:px-6">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[250px]">Tên danh mục</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead className="text-center">Số lượng khóa học</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                                                <BookOpen className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium">{cat.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{cat.description}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="font-normal">
                                            {cat.courseCount} khóa
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={cat.isActive ? "outline" : "destructive"} className={cat.isActive ? "text-green-600 border-green-200 bg-green-50" : ""}>
                                            {cat.isActive ? "Hoạt động" : "Ẩn"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(cat)}>Chỉnh sửa</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(cat.id)} className="text-red-600">Xóa</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <CourseCategoryDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedCategory}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
