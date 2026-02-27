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
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ShiftType } from "@/lib/types/hrm"

const shiftSchema = z.object({
    code: z.string().min(2, "Mã ca phải có ít nhất 2 ký tự"),
    name: z.string().min(2, "Tên ca phải có ít nhất 2 ký tự"),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Định dạng giờ không hợp lệ (HH:mm)"),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Định dạng giờ không hợp lệ (HH:mm)"),
    breakStartTime: z.string().optional(),
    breakEndTime: z.string().optional(),
    workDays: z.array(z.string()).min(1, "Phải chọn ít nhất một ngày làm việc"),
    isActive: z.boolean(),
    isDefault: z.boolean(),
})

type ShiftFormValues = z.infer<typeof shiftSchema>

interface ShiftDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: ShiftType | null
    onSubmit: (values: ShiftFormValues, id?: string) => void
}

const dayOptions = [
    { id: "Thứ 2", label: "Thứ 2" },
    { id: "Thứ 3", label: "Thứ 3" },
    { id: "Thứ 4", label: "Thứ 4" },
    { id: "Thứ 5", label: "Thứ 5" },
    { id: "Thứ 6", label: "Thứ 6" },
    { id: "Thứ 7", label: "Thứ 7" },
    { id: "CN", label: "Chủ Nhật" },
]

export function ShiftDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: ShiftDialogProps) {
    const form = useForm<ShiftFormValues>({
        resolver: zodResolver(shiftSchema) as any,
        defaultValues: {
            code: "",
            name: "",
            startTime: "08:00",
            endTime: "17:30",
            breakStartTime: "",
            breakEndTime: "",
            workDays: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
            isActive: true,
            isDefault: false,
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                code: initialData.code,
                name: initialData.name,
                startTime: initialData.startTime,
                endTime: initialData.endTime,
                breakStartTime: initialData.breakStartTime || "",
                breakEndTime: initialData.breakEndTime || "",
                workDays: initialData.workDays,
                isActive: initialData.isActive,
                isDefault: initialData.isDefault || false,
            })
        } else {
            form.reset({
                code: "",
                name: "",
                startTime: "08:00",
                endTime: "17:30",
                breakStartTime: "",
                breakEndTime: "",
                workDays: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
                isActive: true,
                isDefault: false,
            })
        }
    }, [initialData, form, open])

    const handleSubmit = (values: ShiftFormValues) => {
        onSubmit(values, initialData?.id)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Chỉnh sửa ca làm việc" : "Thêm ca làm việc mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Cập nhật thông tin ca làm việc và thời gian."
                            : "Tạo mới một ca làm việc trong hệ thống."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mã ca</FormLabel>
                                        <FormControl>
                                            <Input placeholder="HC, SANG, CHIEU..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8">
                                        <div className="space-y-0.5">
                                            <FormLabel>Hoạt động</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên ca làm việc</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ca Hành chính, Ca Sáng..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giờ bắt đầu</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giờ kết thúc</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="breakStartTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giờ nghỉ (Từ)</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="breakEndTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giờ nghỉ (Đến)</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="workDays"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Ngày làm việc trong tuần</FormLabel>
                                        <FormDescription>
                                            Chọn các ngày áp dụng cho ca làm việc này.
                                        </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {dayOptions.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="workDays"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, item.id])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== item.id
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isDefault"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Đặt làm mặc định</FormLabel>
                                        <FormDescription>
                                            Ca làm việc này sẽ được chọn mặc định khi tạo nhân viên mới.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
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
