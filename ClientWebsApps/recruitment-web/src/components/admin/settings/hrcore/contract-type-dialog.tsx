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
import { ContractType } from "@/lib/types/hrm"

const contractTypeSchema = z.object({
    code: z.string().min(2, "Mã loại hợp đồng phải có ít nhất 2 ký tự"),
    name: z.string().min(2, "Tên loại hợp đồng phải có ít nhất 2 ký tự"),
    durationMonths: z.coerce.number().min(0, "Thời hạn không được âm"),
    description: z.string().optional(),
    isActive: z.boolean(),
})

type ContractTypeFormValues = z.infer<typeof contractTypeSchema>

interface ContractTypeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: ContractType | null
    onSubmit: (values: ContractTypeFormValues, id?: string) => void
}

export function ContractTypeDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: ContractTypeDialogProps) {
    const form = useForm<ContractTypeFormValues>({
        resolver: zodResolver(contractTypeSchema) as any,
        defaultValues: {
            code: "",
            name: "",
            durationMonths: 0,
            description: "",
            isActive: true,
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                code: initialData.code,
                name: initialData.name,
                durationMonths: initialData.durationMonths || 0,
                description: initialData.description || "",
                isActive: initialData.isActive,
            })
        } else {
            form.reset({
                code: "",
                name: "",
                durationMonths: 0,
                description: "",
                isActive: true,
            })
        }
    }, [initialData, form, open])

    const handleSubmit = (values: ContractTypeFormValues) => {
        onSubmit(values, initialData?.id)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Chỉnh sửa loại hợp đồng" : "Thêm loại hợp đồng mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Cập nhật thông tin loại hợp đồng lao động."
                            : "Tạo mới một loại hợp đồng trong hệ thống."}
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
                                        <FormLabel>Mã loại</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="CT_TYPE..."
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
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8">
                                        <div className="space-y-0.5">
                                            <FormLabel>Áp dụng</FormLabel>
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
                                    <FormLabel>Tên loại hợp đồng</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Hợp đồng..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="durationMonths"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thời hạn (Tháng)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Nhập 0 nếu là hợp đồng không xác định thời hạn.
                                    </FormDescription>
                                    <FormMessage />
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
                                        <Textarea placeholder="Mô tả chi tiết..." {...field} />
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
