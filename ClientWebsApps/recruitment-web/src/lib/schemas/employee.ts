import { z } from 'zod';

// Define enum values as constants (avoid importing @prisma/client in client components)
export const EmployeeStatusValues = ['ACTIVE', 'PROBATION', 'ON_LEAVE', 'RESIGNED', 'TERMINATED'] as const;
export const GenderValues = ['MALE', 'FEMALE'] as const;

export type EmployeeStatusType = (typeof EmployeeStatusValues)[number];
export type GenderType = (typeof GenderValues)[number];

export const employeeSchema = z.object({
    // Personal Info
    fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ').nullish().or(z.literal('')),
    dob: z.date({ error: 'Vui lòng chọn ngày sinh' }),
    gender: z.enum(GenderValues),
    address: z.string().nullish(),
    avatar: z.string().nullish(),

    // Job Info
    employeeCode: z.string().min(1, 'Mã nhân viên là bắt buộc'),
    departmentId: z.string().min(1, 'Vui lòng chọn phòng ban'),
    positionId: z.string().min(1, 'Vui lòng chọn chức vụ'),
    managerId: z.string().nullish(),
    hireDate: z.date({ error: 'Vui lòng chọn ngày vào làm' }),
    status: z.enum(EmployeeStatusValues),

    // Additional fields mapped to Schema
    contractTypeId: z.string().nullish(),
    shiftTypeId: z.string().nullish(),
    identityCard: z.string().nullish(),
    taxCode: z.string().nullish(),
    bankAccount: z.string().nullish(),
    bankName: z.string().nullish(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
