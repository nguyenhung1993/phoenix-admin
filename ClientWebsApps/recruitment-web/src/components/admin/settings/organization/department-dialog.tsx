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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Department } from "@/lib/types/hrm"

const departmentSchema = z.object({
    code: z.string().min(2, "Mã phòng ban phải có ít nhất 2 ký tự"),
    name: z.string().min(2, "Tên phòng ban phải có ít nhất 2 ký tự"),
    parentId: z.string().optional(),
    managerName: z.string().optional(),
    isActive: z.boolean(),
})

type DepartmentFormValues = z.infer<typeof departmentSchema>

interface DepartmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Department | null
    departments: Department[]
    onSubmit: (values: DepartmentFormValues, id?: string) => void
}

export function DepartmentDialog({
    open,
    onOpenChange,
    initialData,
    departments,
    onSubmit,
}: DepartmentDialogProps) {
    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            code: "",
            name: "",
            parentId: "root",
            managerName: "",
            isActive: true,
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                code: initialData.code,
                name: initialData.name,
                parentId: initialData.parentId || "root",
                managerName: initialData.managerName || "",
                isActive: initialData.isActive,
            })
        } else {
            form.reset({
                code: "",
                name: "",
                parentId: "root",
                managerName: "",
                isActive: true,
            })
        }
    }, [initialData, form, open])

    const handleSubmit = (values: DepartmentFormValues) => {
        onSubmit(values, initialData?.id)
    }

    // Filter out self from parent options to avoid cycles (simple check)
    const parentOptions = departments.filter((d) => d.id !== initialData?.id)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Cập nhật thông tin phòng ban."
                            : "Tạo mới một phòng ban trong tổ chức."}
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
                                        <FormLabel>Mã phòng ban</FormLabel>
                                        <FormControl>
                                            <Input placeholder="HR, IT, MKT..." {...field} />
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
                                    <FormLabel>Tên phòng ban</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhân sự, Công nghệ thông tin..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phòng ban cha (Trực thuộc)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn phòng ban cha" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="root">-- Không (Cấp cao nhất) --</SelectItem>
                                            {parentOptions.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id}>
                                                    {dept.name}
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
                            name="managerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trưởng phòng (Tạm thời)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tên trưởng phòng..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Sau này sẽ chọn từ danh sách nhân viên.
                                    </FormDescription>
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
