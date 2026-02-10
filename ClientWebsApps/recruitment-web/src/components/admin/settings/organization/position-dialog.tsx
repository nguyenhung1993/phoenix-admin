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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Position, levelLabels } from "@/lib/mocks/hrm"

const positionSchema = z.object({
    code: z.string().min(2, "Mã chức danh phải có ít nhất 2 ký tự"),
    name: z.string().min(2, "Tên chức danh phải có ít nhất 2 ký tự"),
    level: z.string().min(1, "Vui lòng chọn cấp bậc"),
    minSalary: z.coerce.number().min(0, "Lương tối thiểu không được âm"),
    maxSalary: z.coerce.number().min(0, "Lương tối đa không được âm"),
    description: z.string().optional(),
    isActive: z.boolean(),
})

type PositionFormValues = z.infer<typeof positionSchema>

interface PositionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Position | null
    onSubmit: (values: PositionFormValues, id?: string) => void
}

export function PositionDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: PositionDialogProps) {
    const form = useForm<PositionFormValues>({
        resolver: zodResolver(positionSchema) as any,
        defaultValues: {
            code: "",
            name: "",
            level: "",
            minSalary: 0,
            maxSalary: 0,
            description: "",
            isActive: true,
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                code: initialData.code,
                name: initialData.name,
                level: initialData.level,
                minSalary: initialData.minSalary,
                maxSalary: initialData.maxSalary,
                description: "", // Description is not in Mock Position interface but good to have in form
                isActive: initialData.isActive,
            })
        } else {
            form.reset({
                code: "",
                name: "",
                level: "",
                minSalary: 0,
                maxSalary: 0,
                description: "",
                isActive: true,
            })
        }
    }, [initialData, form, open])

    const handleSubmit = (values: PositionFormValues) => {
        if (values.maxSalary < values.minSalary) {
            form.setError("maxSalary", {
                type: "manual",
                message: "Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu",
            })
            return
        }
        onSubmit(values, initialData?.id)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Chỉnh sửa chức danh" : "Thêm chức danh mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Cập nhật thông tin chức danh và khung lương."
                            : "Tạo mới một chức danh trong hệ thống."}
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
                                        <FormLabel>Mã chức danh</FormLabel>
                                        <FormControl>
                                            <Input placeholder="DIR, MGR, DEV..." {...field} />
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
                                    <FormLabel>Tên chức danh</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Giám đốc, Trưởng phòng..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cấp bậc (Level)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn cấp bậc" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(levelLabels).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label.label}
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
                                name="minSalary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lương tối thiểu</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maxSalary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lương tối đa</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
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
                                        <Textarea placeholder="Mô tả công việc chung..." {...field} />
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
