'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
interface ReviewCycle { id: string; name: string; startDate: string; endDate: string; type: 'ANNUAL' | 'BI_ANNUAL' | 'QUARTERLY' | 'PROBATION'; status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED';[key: string]: unknown; }

const reviewCycleSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên kỳ đánh giá'),
    startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
    endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
    type: z.enum(['ANNUAL', 'BI_ANNUAL', 'QUARTERLY', 'PROBATION']),
    status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'LOCKED']),
});

type ReviewCycleFormValues = z.infer<typeof reviewCycleSchema>;

interface ReviewCycleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cycleToEdit?: ReviewCycle | null;
}

export function ReviewCycleDialog({ open, onOpenChange, cycleToEdit }: ReviewCycleDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ReviewCycleFormValues>({
        resolver: zodResolver(reviewCycleSchema),
        defaultValues: {
            name: cycleToEdit?.name || '',
            startDate: cycleToEdit?.startDate || '',
            endDate: cycleToEdit?.endDate || '',
            type: cycleToEdit?.type || 'QUARTERLY',
            status: cycleToEdit?.status || 'PLANNING',
        },
    });

    const onSubmit = async (data: ReviewCycleFormValues) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));


        toast.success(cycleToEdit ? 'Đã cập nhật kỳ đánh giá' : 'Đã tạo kỳ đánh giá mới', {
            description: data.name,
        });

        setIsLoading(false);
        onOpenChange(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{cycleToEdit ? 'Chỉnh sửa kỳ đánh giá' : 'Tạo kỳ đánh giá mới'}</DialogTitle>
                    <DialogDescription>
                        Thiết lập thời gian và loại hình cho đợt đánh giá năng lực.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên kỳ đánh giá</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Đánh giá Q2 2026" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại hình</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="QUARTERLY">Hàng quý</SelectItem>
                                                <SelectItem value="BI_ANNUAL">6 tháng</SelectItem>
                                                <SelectItem value="ANNUAL">Hàng năm</SelectItem>
                                                <SelectItem value="PROBATION">Thử việc</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trạng thái</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn trạng thái" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PLANNING">Lên kế hoạch</SelectItem>
                                                <SelectItem value="IN_PROGRESS">Đang diễn ra</SelectItem>
                                                <SelectItem value="COMPLETED">Đã hoàn thành</SelectItem>
                                                <SelectItem value="LOCKED">Đã khóa</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày bắt đầu</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày kết thúc</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {cycleToEdit ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
