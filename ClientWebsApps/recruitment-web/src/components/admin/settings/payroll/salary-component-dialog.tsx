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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { SalaryComponent } from "@/lib/mocks/settings-hr"

const salaryComponentSchema = z.object({
    code: z.string().min(2, "Mã thành phần phải có ít nhất 2 ký tự"),
    name: z.string().min(2, "Tên thành phần phải có ít nhất 2 ký tự"),
    type: z.enum(["EARNING", "DEDUCTION"]),
    isTaxable: z.boolean(),
    description: z.string().optional(),
    isActive: z.boolean(),
})

type SalaryComponentFormValues = z.infer<typeof salaryComponentSchema>

interface SalaryComponentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: SalaryComponent | null
    onSubmit: (values: SalaryComponentFormValues, id?: string) => void
}

export function SalaryComponentDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: SalaryComponentDialogProps) {
    const form = useForm<SalaryComponentFormValues>({
        resolver: zodResolver(salaryComponentSchema) as any,
        defaultValues: {
            code: "",
            name: "",
            type: "EARNING",
            isTaxable: true,
            description: "",
            isActive: true,
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                code: initialData.code,
                name: initialData.name,
                type: initialData.type,
                isTaxable: initialData.isTaxable,
                description: initialData.description || "",
                isActive: initialData.isActive,
            })
        } else {
            form.reset({
                code: "",
                name: "",
                type: "EARNING",
                isTaxable: true,
                description: "",
                isActive: true,
            })
        }
    }, [initialData, form, open])

    const handleSubmit = (values: SalaryComponentFormValues) => {
        onSubmit(values, initialData?.id)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Chỉnh sửa thành phần lương" : "Thêm thành phần lương mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Cập nhật thông tin khoản thu nhập hoặc khấu trừ."
                            : "Tạo mới một khoản thu nhập hoặc khấu trừ trong bảng lương."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã thành phần</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="SAL_BASE, BON_KPI..."
                                            {...field}
                                            disabled={initialData?.isSystem}
                                        />
                                    </FormControl>
                                    {initialData?.isSystem && (
                                        <FormDescription className="text-xs">
                                            Mã hệ thống không thể sửa
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên thành phần</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lương cơ bản, Thưởng..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loại</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={initialData?.isSystem}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại thành phần" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="EARNING">Thu nhập (Earning)</SelectItem>
                                            <SelectItem value="DEDUCTION">Khấu trừ (Deduction)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isTaxable"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Tính thuế thu nhập (Taxable)</FormLabel>
                                        <FormDescription>
                                            Khoản này sẽ được tính vào thu nhập chịu thuế
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

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả (Tùy chọn)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Mô tả chi tiết về khoản lương này..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Đang hoạt động</FormLabel>
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
