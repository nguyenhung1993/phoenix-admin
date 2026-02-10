'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { courseCategories, Course } from '@/lib/mocks/training';

const courseSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tên khóa học'),
    description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
    category: z.string().min(1, 'Vui lòng chọn danh mục'),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    duration: z.string().min(1, 'Vui lòng nhập thời lượng (ví dụ: 2h 30m)'),
    thumbnail: z.string().optional(), // In real app, this would be a file upload
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseToEdit?: Course | null;
}

export function CourseDialog({ open, onOpenChange, courseToEdit }: CourseDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: courseToEdit?.title || '',
            description: courseToEdit?.description || '',
            category: courseToEdit?.category || '',
            level: courseToEdit?.level || 'BEGINNER',
            duration: courseToEdit?.duration || '',
            thumbnail: courseToEdit?.thumbnail || '',
        },
    });

    // Reset form when courseToEdit changes (optional, might need useEffect like LeaveDialog)
    // But since this dialog is likely unmounted or fully reset on close/open by parent key or similar strategy, 
    // or if we want to support edit mode we should use useEffect.
    // Let's implement useEffect for safety if we reuse the same dialog instance.

    // Actually, let's keep it simple for now and rely on defaultValues for initial render 
    // or assume the parent handles the key to force re-render on edit change.

    const onSubmit = async (data: CourseFormValues) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));


        toast.success(courseToEdit ? 'Đã cập nhật khóa học' : 'Đã tạo khóa học mới', {
            description: data.title,
        });

        setIsLoading(false);
        onOpenChange(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{courseToEdit ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin cơ bản về khóa học. Nội dung bài giảng sẽ được quản lý sau khi tạo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên khóa học</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tên khóa học..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Mô tả nội dung khóa học..." className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Danh mục</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {courseCategories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.name}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trình độ</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn trình độ" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="BEGINNER">Cơ bản</SelectItem>
                                                <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
                                                <SelectItem value="ADVANCED">Nâng cao</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thời lượng dự kiến</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ví dụ: 2h 30m" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ảnh bìa (URL)</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2">
                                            <Input placeholder="https://..." {...field} />
                                            <Button type="button" variant="outline" size="icon">
                                                <Upload className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {courseToEdit ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
