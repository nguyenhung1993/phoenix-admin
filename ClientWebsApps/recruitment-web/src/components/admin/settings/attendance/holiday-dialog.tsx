"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PublicHoliday } from "@/lib/types/hrm"

const holidaySchema = z.object({
    name: z.string().min(2, "Tên ngày lễ phải có ít nhất 2 ký tự"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày không hợp lệ"),
    daysOff: z.coerce.number().min(0.5, "Số ngày nghỉ tối thiểu là 0.5"),
    description: z.string().optional(),
})

type HolidayFormValues = z.infer<typeof holidaySchema>

interface HolidayDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: PublicHoliday | null
    onSubmit: (values: HolidayFormValues, id?: string) => void
}

export function HolidayDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: HolidayDialogProps) {
    const form = useForm<HolidayFormValues>({
        resolver: zodResolver(holidaySchema) as any,
        defaultValues: {
            name: "",
            date: new Date().toISOString().split('T')[0],
            daysOff: 1,
            description: "",
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                date: initialData.date,
                daysOff: initialData.daysOff,
                description: initialData.description || "",
            })
        } else {
            form.reset({
                name: "",
                date: new Date().toISOString().split('T')[0],
                daysOff: 1,
                description: "",
            })
        }
    }, [initialData, form, open])

    const handleSubmit = (values: HolidayFormValues) => {
        onSubmit(values, initialData?.id)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Chỉnh sửa ngày nghỉ lễ" : "Thêm ngày nghỉ lễ mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Cập nhật thông tin ngày nghỉ lễ."
                            : "Thêm ngày nghỉ lễ vào lịch làm việc năm nay."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên ngày lễ</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tết Dương Lịch, Giỗ Tổ..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày diễn ra</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="daysOff"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số ngày nghỉ</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả (Tùy chọn)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Ghi chú về lịch nghỉ lễ..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Hủy
                            </Button>
                            <Button type="submit">Lưu thay đổi</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
