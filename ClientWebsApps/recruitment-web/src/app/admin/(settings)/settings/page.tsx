'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Loader2,
    Save,
    Building2, // Company
    Users,     // Organization, User
    Briefcase, // HR Core
    Clock,     // Attendance
    Banknote,  // Payroll
    GraduationCap, // E-Learning
    FileText,  // Form Builder
    GitBranch, // Workflow
    Bell,      // Notification
    Settings,  // System
    Shield,
    Database,
    AlertTriangle,
    Download,
    LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';
import { getAuditLogs, getSecurityConfig, getEmailTemplates } from '@/lib/mocks/settings';
import { roleLabels } from '@/lib/rbac';
import { cn } from '@/lib/utils';
import { CompanyProfile } from '@/components/admin/settings/general/company-profile';
import { SystemSecurity } from '@/components/admin/settings/general/system-security';
import { DepartmentList } from '@/components/admin/settings/organization/department-list';
import { PositionList } from '@/components/admin/settings/organization/position-list';
import { ContractTypeList } from '@/components/admin/settings/hrcore/contract-type-list';
import { ShiftList } from '@/components/admin/settings/attendance/shift-list';
import { HolidayCalendar } from '@/components/admin/settings/attendance/holiday-calendar';
import { SalaryComponentList } from '@/components/admin/settings/payroll/salary-component-list';
import { CourseCategoryList } from '@/components/admin/settings/elearning/course-category-list';
import { ApprovalWorkflowSettings } from '@/components/admin/settings/workflow/approval-workflow-settings';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("company");
    const [emailTemplates] = useState(getEmailTemplates());

    const sidebarItems = [
        {
            heading: 'Cài đặt chung',
            items: [
                { id: 'company', label: 'Thông tin công ty', icon: Building2 },
                { id: 'system', label: 'Hệ thống & Bảo mật', icon: Settings },
            ]
        },
        {
            heading: 'Tổ chức',
            items: [
                { id: 'organization', label: 'Cơ cấu tổ chức', icon: LayoutGrid },
                { id: 'positions', label: 'Chức danh & Vị trí', icon: Briefcase },
                { id: 'users', label: 'Người dùng & Phân quyền', icon: Users },
            ]
        },
        {
            heading: 'Thiết lập HR',
            items: [
                { id: 'hrcore', label: 'HR Core', icon: Briefcase },
                { id: 'attendance', label: 'Chấm công', icon: Clock },
                { id: 'payroll', label: 'Tính lương', icon: Banknote },
            ]
        },
        {
            heading: 'Module & Tự động hóa',
            items: [
                { id: 'elearning', label: 'Đào tạo (LMS)', icon: GraduationCap },
                { id: 'form', label: 'Form Builder', icon: FileText },
                { id: 'workflow', label: 'Quy trình xét duyệt', icon: GitBranch },
                { id: 'notification', label: 'Thông báo', icon: Bell },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Cài đặt hệ thống</h1>
                <p className="text-muted-foreground">Quản lý cấu hình tập trung cho toàn bộ nền tảng Phoenix HRMS</p>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:gap-12 lg:space-y-0">
                {/* SIDEBAR NAVIGATION */}
                <aside className="-mx-4 lg:mx-0 lg:w-64 shrink-0 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        {sidebarItems.map((group, groupIdx) => (
                            <div key={groupIdx} className="mb-6 px-4 lg:px-0">
                                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                                    {group.heading}
                                </h4>
                                <div className="space-y-1">
                                    {group.items.map((item) => (
                                        <Button
                                            key={item.id}
                                            variant={activeTab === item.id ? "secondary" : "ghost"}
                                            className={cn(
                                                "w-full justify-start",
                                                activeTab === item.id ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline"
                                            )}
                                            onClick={() => setActiveTab(item.id)}
                                        >
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {item.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 min-w-0 min-h-[calc(100vh-150px)]">
                    {/* 1. COMPANY SETTINGS */}
                    {/* 1. COMPANY SETTINGS */}
                    {activeTab === 'company' && <CompanyProfile />}

                    {/* 2. SYSTEM SETTINGS */}
                    {/* 2. SYSTEM SETTINGS */}
                    {activeTab === 'system' && <SystemSecurity />}

                    {/* 3. ORGANIZATION SETTINGS */}
                    {activeTab === 'organization' && <DepartmentList />}
                    {activeTab === 'positions' && <PositionList />}

                    {/* 4. USER & PERMISSIONS */}
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Người dùng & Phân quyền</h3>
                                <p className="text-sm text-muted-foreground">Phân quyền người dùng (RBAC) và cấu trúc tổ chức.</p>
                            </div>
                            <Separator />
                            <Card>
                                <CardHeader className="px-4 py-4 pb-3">
                                    <CardTitle className="text-base">Các vai trò (Roles)</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table className="[&_tr>th]:px-4 [&_tr>td]:px-4">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[200px]">Mã vai trò</TableHead>
                                                <TableHead>Mô tả</TableHead>
                                                <TableHead className="w-[150px]">Nhãn</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(roleLabels).map(([key, role]) => (
                                                <TableRow key={key}>
                                                    <TableCell className="font-mono text-xs">{key}</TableCell>
                                                    <TableCell>{role.description}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={role.color}>{role.label}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-yellow-800 text-sm">
                                💡 Chức năng chỉnh sửa quyền hạn (Ma trận thẩm quyền) sẽ được cập nhật trong phiên bản tiếp theo.
                            </div>
                        </div>
                    )}

                    {/* 5. NOTIFICATIONS */}
                    {activeTab === 'notification' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Cấu hình thông báo</h3>
                                <p className="text-sm text-muted-foreground">Cấu hình mẫu Email và kênh thông báo.</p>
                            </div>
                            <Separator />
                            <div className="grid gap-4">
                                {emailTemplates.map((tpl) => (
                                    <div key={tpl.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Bell className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{tpl.name}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{tpl.description}</p>
                                        </div>
                                        <Button variant="outline" size="sm">Chỉnh sửa mẫu</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 5. PLACEHOLDERS FOR NEW MODULES */}

                    {/* 6. HR CORE SETTINGS */}
                    {activeTab === 'hrcore' && <ContractTypeList />}

                    {/* 7. ATTENDANCE SETTINGS */}
                    {activeTab === 'attendance' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Cấu hình Chấm công</h3>
                                <p className="text-sm text-muted-foreground">Thiết lập ca làm việc và lịch nghỉ lễ.</p>
                            </div>
                            <Separator />
                            <ShiftList />
                            <HolidayCalendar />
                        </div>
                    )}


                    {/* 8. PAYROLL SETTINGS */}
                    {activeTab === 'payroll' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Cấu hình Tính lương</h3>
                                <p className="text-sm text-muted-foreground">Thiết lập các khoản thu nhập, khấu trừ và công thức lương.</p>
                            </div>
                            <Separator />
                            <SalaryComponentList />
                        </div>
                    )}

                    {/* 9. E-LEARNING SETTINGS */}
                    {activeTab === 'elearning' && <CourseCategoryList />}

                    {/* 10. APPROVAL WORKFLOW SETTINGS */}
                    {activeTab === 'workflow' && <ApprovalWorkflowSettings />}

                    {/* 11. PLACEHOLDERS FOR REMAINING MODULES */}
                    {['form'].includes(activeTab) && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium capitalize">Cấu hình {activeTab}</h3>
                                <p className="text-sm text-muted-foreground">Cấu hình chuyên sâu cho module {activeTab}.</p>
                            </div>
                            <Separator />

                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-slate-50">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                    <Settings className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">Module đang phát triển</h3>
                                <p className="text-sm text-slate-500 text-center max-w-sm mt-2">
                                    Các tính năng cấu hình cho <strong>{activeTab}</strong> nằm trong lộ trình phát triển tiếp theo (Nâng cấp HRMS Tiêu chuẩn).
                                </p>
                                <Button className="mt-8" variant="outline" disabled>Sắp ra mắt</Button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
