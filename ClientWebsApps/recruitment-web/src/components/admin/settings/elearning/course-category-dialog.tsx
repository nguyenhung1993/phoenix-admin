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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { CourseCategory } from "@/lib/types/hrm"

const courseCategorySchema = z.object({
    name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
    isActive: z.boolean(),
})

type CourseCategoryFormValues = z.infer<typeof courseCategorySchema>

interface CourseCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: CourseCategory | null
    onSubmit: (values: CourseCategoryFormValues, id?: string) => void
}

export function CourseCategoryDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: CourseCategoryDialogProps) {
    const form = useForm<CourseCategoryFormValues>({
        resolver: zodResolver(courseCategorySchema) as any,
        defaultValues: {
            name: "",
            description: "",
            isActive: true,
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                description: initialData.description || "",
                isActive: initialData.isActive,
            })
        } else {
            form.reset({
                name: "",
                description: "",
                isActive: true,
            })
        }
    }, [initialData, form, open])

    const handleSubmit = (values: CourseCategoryFormValues) => {
        onSubmit(values, initialData?.id)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Chỉnh sửa danh mục đào tạo" : "Thêm danh mục đào tạo mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Cập nhật thông tin danh mục khóa học."
                            : "Tạo mới một danh mục để phân loại các khóa học."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên danh mục</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Kỹ năng mềm, Chuyên môn..." {...field} />
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
                                    <FormLabel>Mô tả (Tùy chọn)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Mô tả về nhóm khóa học này..." {...field} />
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
                                        <div className="text-[0.8rem] text-muted-foreground">
                                            Danh mục này sẽ hiển thị trong danh sách lựa chọn
                                        </div>
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
