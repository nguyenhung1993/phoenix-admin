"use client"

import { useEffect, useState } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Employee, mockDepartments, mockPositions, mockContractTypes, mockShiftTypes } from "@/lib/mocks"
import { CalendarIcon, Upload } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

const employeeSchema = z.object({
    // Personal Info
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(10, "Số điện thoại không hợp lệ"),
    dob: z.string().optional(), // YYYY-MM-DD
    gender: z.enum(["MALE", "FEMALE"]),
    address: z.string().optional(),
    identityCard: z.string().optional(),

    // Work Info
    employeeCode: z.string().min(3, "Mã nhân viên phải có ít nhất 3 ký tự"),
    departmentId: z.string().min(1, "Vui lòng chọn phòng ban"),
    positionId: z.string().min(1, "Vui lòng chọn chức danh"),
    contractTypeId: z.string().optional(),
    shiftTypeId: z.string().optional(),
    status: z.enum(["ACTIVE", "PROBATION", "RESIGNED", "ON_LEAVE"]),
    hireDate: z.string().min(1, "Vui lòng chọn ngày vào làm"),
    managerId: z.string().optional(),

    // Banking
    bankAccount: z.string().optional(),
    bankName: z.string().optional(),
    taxCode: z.string().optional(),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

interface EmployeeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Employee | null
    onSubmit: (values: EmployeeFormValues, id?: string) => void
}

export function EmployeeDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: EmployeeDialogProps) {
    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema) as any,
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            gender: "MALE",
            employeeCode: "",
            departmentId: "",
            positionId: "",
            status: "PROBATION",
            hireDate: new Date().toISOString().split('T')[0],
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                fullName: initialData.fullName,
                email: initialData.email,
                phone: initialData.phone,
                dob: initialData.dob,
                gender: initialData.gender,
                address: initialData.address || "",
                identityCard: initialData.identityCard || "",
                employeeCode: initialData.employeeCode,
                departmentId: initialData.departmentId,
                positionId: initialData.positionId,
                contractTypeId: initialData.contractTypeId || "",
                shiftTypeId: initialData.shiftTypeId || "",
                status: initialData.status,
                hireDate: initialData.hireDate,
                managerId: initialData.managerId || "none", // Handle undefined
                bankAccount: initialData.bankAccount || "",
                bankName: initialData.bankName || "",
                taxCode: initialData.taxCode || "",
            })
        } else {
            form.reset({
                fullName: "",
                email: "",
                phone: "",
                gender: "MALE",
                employeeCode: "",
                departmentId: "",
                positionId: "",
                status: "PROBATION",
                hireDate: new Date().toISOString().split('T')[0],
                contractTypeId: "",
                shiftTypeId: "",
                managerId: "none",
            })
        }
    }, [initialData, form, open])

    const handleSubmit = (values: EmployeeFormValues) => {
        // Handle optional selects returning "none" or empty string
        const cleanedValues = {
            ...values,
            managerId: values.managerId === "none" ? undefined : values.managerId,
            contractTypeId: values.contractTypeId === "none" ? undefined : values.contractTypeId,
            shiftTypeId: values.shiftTypeId === "none" ? undefined : values.shiftTypeId,
        }
        onSubmit(cleanedValues, initialData?.id)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Chỉnh sửa hồ sơ nhân viên" : "Thêm nhân viên mới"}
                    </DialogTitle>
                    <DialogDescription>
                        Quản lý thông tin chi tiết của nhân viên trong hệ thống.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
                                <TabsTrigger value="work">Công việc</TabsTrigger>
                                <TabsTrigger value="banking">Lương & Thuế</TabsTrigger>
                            </TabsList>

                            {/* TAB: PERSONAL INFO */}
                            <TabsContent value="personal" className="space-y-4 py-4">
                                <div className="flex items-center gap-6 mb-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={initialData?.avatar} />
                                        <AvatarFallback className="text-xl">
                                            {initialData?.fullName ? initialData.fullName.charAt(0) : "NV"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button type="button" variant="outline" size="sm">
                                        <Upload className="mr-2 h-4 w-4" /> Tải ảnh lên
                                    </Button>
                                    <p className="text-xs text-muted-foreground w-1/3">
                                        Cho phép: *.jpg, *.jpeg, *.png. Tối đa 2MB.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nguyễn Văn A" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giới tính</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn giới tính" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="MALE">Nam</SelectItem>
                                                        <SelectItem value="FEMALE">Nữ</SelectItem>
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
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email công ty <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email@company.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số điện thoại <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="09xxxxxxx" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày sinh</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="identityCard"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số CCCD/CMND</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="001xxxxxxxxx" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Địa chỉ hiện tại</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Số nhà, đường, phường/xã..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            {/* TAB: WORK INFO */}
                            <TabsContent value="work" className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="employeeCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mã nhân viên <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="EMP..." {...field} />
                                                </FormControl>
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="ACTIVE">Đang làm việc</SelectItem>
                                                        <SelectItem value="PROBATION">Thử việc</SelectItem>
                                                        <SelectItem value="ON_LEAVE">Nghỉ phép dài hạn</SelectItem>
                                                        <SelectItem value="RESIGNED">Đã nghỉ việc</SelectItem>
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
                                        name="departmentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phòng ban <span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn phòng ban" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mockDepartments.map(dept => (
                                                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="positionId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Chức danh <span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn chức danh" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mockPositions.filter(p => !form.getValues('departmentId') || p.departmentId === form.getValues('departmentId') || !p.departmentId).map(pos => (
                                                            <SelectItem key={pos.id} value={pos.id}>{pos.name}</SelectItem>
                                                        ))}
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
                                        name="hireDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày vào làm <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="managerId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quản lý trực tiếp</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn quản lý (nếu có)" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="none">-- Không --</SelectItem>
                                                        {initialData?.id
                                                            ? [] // TODO: Filter current user from managers
                                                            : []}
                                                        {/* Simple Mock for managers - ideally filter out self */}
                                                        <SelectItem value="1">Nguyễn Văn Minh (Giám đốc)</SelectItem>
                                                        <SelectItem value="2">Trần Thị Hương (TP Nhân sự)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="contractTypeId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Loại hợp đồng</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn loại hợp đồng" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mockContractTypes.map(type => (
                                                            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="shiftTypeId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ca làm việc</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn ca làm việc" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mockShiftTypes.map(shift => (
                                                            <SelectItem key={shift.id} value={shift.id}>{shift.name} ({shift.startTime}-{shift.endTime})</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>

                            {/* TAB: BANKING & TAX */}
                            <TabsContent value="banking" className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="taxCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mã số thuế cá nhân</FormLabel>
                                            <FormControl>
                                                <Input placeholder="MST..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="bankAccount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số tài khoản ngân hàng</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Số tài khoản..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bankName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tên ngân hàng & Chi nhánh</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Vietcombank - CN Hà Nội..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Hủy
                            </Button>
                            <Button type="submit">Lưu hồ sơ</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
