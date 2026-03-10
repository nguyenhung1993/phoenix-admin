import { describe, it, expect } from 'vitest';
import { hasPermission } from '../rbac';

describe('RBAC (Role Based Access Control)', () => {
    describe('hasPermission', () => {
        it('SUPER_ADMIN luôn có mọi quyền', () => {
            expect(hasPermission('SUPER_ADMIN', 'users:manage')).toBe(true);
            expect(hasPermission('SUPER_ADMIN', 'payroll:manage')).toBe(true);
        });

        it('HR_MANAGER có quyền quản lý nhân sự', () => {
            expect(hasPermission('HR_MANAGER', 'employees:view')).toBe(true);
            expect(hasPermission('HR_MANAGER', 'employees:create')).toBe(true);
            expect(hasPermission('HR_MANAGER', 'employees:edit')).toBe(true);
            expect(hasPermission('HR_MANAGER', 'employees:delete')).toBe(false); // Only SUPER_ADMIN can delete based on rolePermissions
        });

        it('HR_MANAGER không có quyền cấu hình hệ thống (SETTINGS)', () => {
            expect(hasPermission('HR_MANAGER', 'settings:manage')).toBe(false);
            expect(hasPermission('HR_MANAGER', 'users:manage')).toBe(false);
        });

        it('RECRUITER chỉ có quyền liên quan đến tuyển dụng', () => {
            expect(hasPermission('RECRUITER', 'jobs:view')).toBe(true);
            expect(hasPermission('RECRUITER', 'candidates:view')).toBe(true);
            expect(hasPermission('RECRUITER', 'interviews:view')).toBe(true);
            expect(hasPermission('RECRUITER', 'employees:view')).toBe(false);
            expect(hasPermission('RECRUITER', 'payroll:view')).toBe(false);
        });

        it('EMPLOYEE có quyền cơ bản (PORTAL)', () => {
            expect(hasPermission('EMPLOYEE', 'workplace:post')).toBe(true);
            expect(hasPermission('EMPLOYEE', 'employees:view')).toBe(false);
            expect(hasPermission('EMPLOYEE', 'jobs:create')).toBe(false);
        });

        it('VIEWER (hoặc Guest) không có quyền bằng default', () => {
            expect(hasPermission('VIEWER', 'settings:view')).toBe(false);
            expect(hasPermission('VIEWER', 'employees:edit')).toBe(false);
            expect(hasPermission('VIEWER', 'employees:view')).toBe(true); // VIEWER has employees:view
        });
    });
});
