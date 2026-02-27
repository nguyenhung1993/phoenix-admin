'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
type LeaveType = 'ANNUAL' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'COMPENSATORY' | 'WEDDING' | 'BEREAVEMENT';
const leaveTypeLabels: Record<string, { label: string; color: string }> = {
    ANNUAL: { label: 'Nghỉ phép năm', color: 'bg-blue-100' },
    SICK: { label: 'Nghỉ ốm', color: 'bg-red-100' },
    PERSONAL: { label: 'Nghỉ việc riêng', color: 'bg-yellow-100' },
    MATERNITY: { label: 'Nghỉ thai sản', color: 'bg-pink-100' },
    PATERNITY: { label: 'Nghỉ chăm con', color: 'bg-indigo-100' },
    UNPAID: { label: 'Nghỉ không lương', color: 'bg-gray-100' },
    COMPENSATORY: { label: 'Nghỉ bù', color: 'bg-green-100' },
    WEDDING: { label: 'Nghỉ cưới', color: 'bg-purple-100' },
    BEREAVEMENT: { label: 'Nghỉ tang', color: 'bg-slate-100' },
};

const leaveSchema = z.object({
    leaveType: z.string().min(1, 'Vui lòng chọn loại nghỉ phép'),
    startDate: z.date(),
    endDate: z.date(),
    reason: z.string().min(5, 'Lý do nghỉ phép phải có ít nhất 5 ký tự'),
});

type LeaveFormValues = z.infer<typeof leaveSchema>;

interface LeaveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    checkInDate?: Date; // Optional: pre-fill date from calendar click
}

export function LeaveDialog({ open, onOpenChange, checkInDate }: LeaveDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LeaveFormValues>({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
            leaveType: 'ANNUAL',
            reason: '',
            startDate: checkInDate || new Date(),
            endDate: checkInDate || new Date(),
        },
    });

    // Reset form when checkInDate changes
    useEffect(() => {
        if (checkInDate) {
            form.reset({
                leaveType: 'ANNUAL',
                reason: '',
                startDate: checkInDate,
                endDate: checkInDate,
            });
        }
    }, [checkInDate, form]);

    const onSubmit = async (data: LeaveFormValues) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));


        toast.success('Đã gửi đơn nghỉ phép thành công', {
            description: `${format(data.startDate, 'dd/MM/yyyy')} - ${format(data.endDate, 'dd/MM/yyyy')}`,
        });

        setIsLoading(false);
        onOpenChange(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tạo đơn nghỉ phép</DialogTitle>
                    <DialogDescription>
                        Điền thông tin chi tiết về thời gian và lý do nghỉ phép.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="leaveType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loại nghỉ phép</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại nghỉ" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(leaveTypeLabels).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                    {value.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Từ ngày</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Đến ngày</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < form.getValues('startDate')
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lý do</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập lý do nghỉ phép..."
                                            className="resize-none"
                                            {...field}
                                        />
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
                                Gửi đơn
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
