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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { KPI, kpiCategoryLabels } from '@/lib/mocks/performance';
import { mockDepartments } from '@/lib/mocks/hrm';

const kpiSchema = z.object({
    code: z.string().min(1, 'Vui lòng nhập mã KPI'),
    name: z.string().min(1, 'Vui lòng nhập tên KPI'),
    description: z.string().optional(),
    unit: z.enum(['PERCENTAGE', 'NUMBER', 'CURRENCY', 'RATING']),
    target: z.coerce.number().min(0, 'Mục tiêu phải lớn hơn hoặc bằng 0'),
    weight: z.coerce.number().min(0).max(100, 'Trọng số từ 0-100%'),
    category: z.enum(['FINANCIAL', 'CUSTOMER', 'INTERNAL', 'LEARNING']),
    departmentId: z.string().optional(),
});

type KPIFormValues = z.infer<typeof kpiSchema>;

interface KPIDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kpiToEdit?: KPI | null;
}

export function KPIDialog({ open, onOpenChange, kpiToEdit }: KPIDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<KPIFormValues>({
        resolver: zodResolver(kpiSchema) as any,
        defaultValues: {
            code: kpiToEdit?.code || '',
            name: kpiToEdit?.name || '',
            description: kpiToEdit?.description || '',
            unit: kpiToEdit?.unit || 'PERCENTAGE',
            target: kpiToEdit?.target || 0,
            weight: kpiToEdit?.weight || 0,
            category: kpiToEdit?.category || 'FINANCIAL',
            departmentId: kpiToEdit?.departmentId || 'ALL', // Simple handling for 'All Departments'
        },
    });

    const onSubmit = async (data: KPIFormValues) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('KPI Data:', data);
        toast.success(kpiToEdit ? 'Đã cập nhật KPI' : 'Đã tạo KPI mới', {
            description: data.name,
        });

        setIsLoading(false);
        onOpenChange(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{kpiToEdit ? 'Chỉnh sửa KPI' : 'Thêm KPI mới'}</DialogTitle>
                    <DialogDescription>
                        Định nghĩa các chỉ số đo lường hiệu quả công việc.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mã KPI</FormLabel>
                                        <FormControl>
                                            <Input placeholder="VD: SALES-01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nhóm chỉ số (BSC)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn nhóm" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="FINANCIAL">Tài chính</SelectItem>
                                                <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                                                <SelectItem value="INTERNAL">Quy trình nội bộ</SelectItem>
                                                <SelectItem value="LEARNING">Đào tạo & Phát triển</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên chỉ số KPI</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Doanh thu bán hàng" {...field} />
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
                                    <FormLabel>Mô tả / Cách tính</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Mô tả chi tiết..." className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Đơn vị tính</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn đơn vị" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                                                <SelectItem value="NUMBER">Số lượng</SelectItem>
                                                <SelectItem value="CURRENCY">Tiền tệ (VND)</SelectItem>
                                                <SelectItem value="RATING">Điểm đánh giá</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="target"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mục tiêu mặc định</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trọng số (%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" max="100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="departmentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Áp dụng cho phòng ban</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || 'ALL'}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn phòng ban" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ALL">Tất cả phòng ban</SelectItem>
                                            {mockDepartments.map(dept => (
                                                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                {kpiToEdit ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
