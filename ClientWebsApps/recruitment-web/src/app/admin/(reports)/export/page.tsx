'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FileSpreadsheet,
    FileText,
    Download,
    Calendar,
    Check,
    Loader2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exportToExcel, exportToPDF } from '@/lib/export-utils';

const employeeStatusLabels: Record<string, { label: string }> = {
    ACTIVE: { label: 'Đang làm việc' },
    PROBATION: { label: 'Thử việc' },
    ON_LEAVE: { label: 'Nghỉ phép' },
    RESIGNED: { label: 'Đã nghỉ' },
    TERMINATED: { label: 'Chấm dứt' },
};

interface ReportType {
    id: string;
    name: string;
    description: string;
    icon: typeof FileSpreadsheet;
    formats: ('excel' | 'pdf')[];
    category: string;
}

const reportTypes: ReportType[] = [
    {
        id: 'employee-list',
        name: 'Danh sách nhân viên',
        description: 'Xuất danh sách nhân viên theo phòng ban, trạng thái',
        icon: FileSpreadsheet,
        formats: ['excel', 'pdf'],
        category: 'Nhân sự',
    },
    {
        id: 'pit-report',
        name: 'Báo cáo Thuế TNCN',
        description: 'Tổng hợp thuế thu nhập cá nhân theo kỳ',
        icon: FileText,
        formats: ['excel'],
        category: 'Thuế',
    },
    {
        id: 'insurance-d02',
        name: 'Mẫu D02-TS',
        description: 'Danh sách đề nghị hưởng BHXH',
        icon: FileText,
        formats: ['excel'],
        category: 'Bảo hiểm',
    },
    {
        id: 'insurance-01c',
        name: 'Mẫu 01C/BH',
        description: 'Bảng kê đóng BHXH, BHYT, BHTN',
        icon: FileText,
        formats: ['excel'],
        category: 'Bảo hiểm',
    },
    {
        id: 'payroll-summary',
        name: 'Bảng tổng hợp lương',
        description: 'Tổng hợp chi phí lương theo tháng',
        icon: FileSpreadsheet,
        formats: ['excel', 'pdf'],
        category: 'Lương',
    },
    {
        id: 'timesheet',
        name: 'Bảng chấm công',
        description: 'Chi tiết công theo ngày của nhân viên',
        icon: FileSpreadsheet,
        formats: ['excel'],
        category: 'Công',
    },
    {
        id: 'leave-summary',
        name: 'Báo cáo nghỉ phép',
        description: 'Tổng hợp ngày nghỉ phép còn lại',
        icon: FileText,
        formats: ['excel', 'pdf'],
        category: 'Phép',
    },
    {
        id: 'kpi-results',
        name: 'Kết quả đánh giá KPI',
        description: 'Điểm KPI và xếp loại nhân viên',
        icon: FileSpreadsheet,
        formats: ['excel', 'pdf'],
        category: 'Đánh giá',
    },
];

const periods = [
    { value: '2024-01', label: 'Tháng 1/2024' },
    { value: '2024-02', label: 'Tháng 2/2024' },
    { value: '2024-03', label: 'Tháng 3/2024' },
    { value: '2024-Q1', label: 'Quý 1/2024' },
    { value: '2024-Q2', label: 'Quý 2/2024' },
    { value: '2024', label: 'Năm 2024' },
];

export default function ExportPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
    const [exporting, setExporting] = useState<string | null>(null);

    const handleExport = async (reportId: string, format: 'excel' | 'pdf') => {
        setExporting(`${reportId}-${format}`);

        const report = reportTypes.find(r => r.id === reportId);
        const filename = `${report?.name.replace(/\s+/g, '_')}_${selectedPeriod}`;

        let dataToExport: any[] = [];

        try {
            if (reportId === 'employee-list') {
                const res = await fetch('/api/employees');
                const employees = await res.json();
                dataToExport = (employees.data || employees).map((emp: any) => ({
                    'Mã NV': emp.employeeCode,
                    'Họ tên': emp.fullName,
                    'Phòng ban': emp.department?.name || '',
                    'Chức vụ': emp.position?.name || '',
                    'Trạng thái': employeeStatusLabels[emp.status]?.label || emp.status,
                    'Ngày vào làm': emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('vi-VN') : '',
                    'Email': emp.email,
                    'Số điện thoại': emp.phone || '',
                }));
            } else if (reportId === 'pit-report') {
                const res = await fetch(`/api/reports/hrm/pit?month=${selectedPeriod.split('-')[1] || 1}&year=${selectedPeriod.split('-')[0] || 2024}`);
                const pitData = await res.json();
                dataToExport = pitData.map((emp: any) => ({
                    'Mã NV': emp.code,
                    'Họ tên': emp.name,
                    'Mã số thuế': emp.taxCode,
                    'Thu nhập': emp.grossIncome,
                    'BHXH': emp.socialInsurance,
                    'Giảm trừ PT': emp.dependentDeduction,
                    'TN chịu thuế': emp.taxableIncome,
                    'Thuế TNCN': emp.pitAmount,
                }));
            } else if (reportId === 'insurance-d02' || reportId === 'insurance-01c') {
                const res = await fetch('/api/reports/hrm/insurance');
                const insData = await res.json();
                dataToExport = insData.map((emp: any) => ({
                    'Mã NV': emp.code,
                    'Họ tên': emp.name,
                    'Số sổ BHXH': emp.socialInsuranceNo,
                    'Lương đóng BH': emp.baseSalary,
                    'BHXH (NV)': emp.bhxh.employee,
                    'BHXH (DN)': emp.bhxh.company,
                    'BHYT (NV)': emp.bhyt.employee,
                    'BHYT (DN)': emp.bhyt.company,
                    'BHTN (NV)': emp.bhtn.employee,
                    'BHTN (DN)': emp.bhtn.company,
                }));
            } else {
                // Placeholder for other report types
                dataToExport = [{ 'Thông báo': 'Chức năng đang phát triển' }];
            }
        } catch {
            dataToExport = [{ 'Lỗi': 'Không thể tải dữ liệu' }];
        }


        if (format === 'excel') {
            await exportToExcel(dataToExport, filename, report?.name || 'Sheet1');
        } else if (format === 'pdf') {
            if (dataToExport.length > 0) {
                const headers = Object.keys(dataToExport[0]);
                const data = dataToExport.map(row => Object.values(row)) as (string | number)[][];
                await exportToPDF(report?.name || 'Report', headers, data, filename);
            }
        }

        setExporting(null);
    };

    const categories = Array.from(new Set(reportTypes.map(r => r.category)));

    const ReportCard = ({ report }: { report: ReportType }) => {
        const Icon = report.icon;
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-base mt-3">{report.name}</CardTitle>
                    <CardDescription className="text-sm">
                        {report.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        {report.formats.includes('excel') && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                disabled={exporting !== null}
                                onClick={() => handleExport(report.id, 'excel')}
                            >
                                {exporting === `${report.id}-excel` ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                                )}
                                Excel
                            </Button>
                        )}
                        {report.formats.includes('pdf') && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                disabled={exporting !== null}
                                onClick={() => handleExport(report.id, 'pdf')}
                            >
                                {exporting === `${report.id}-pdf` ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <FileText className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                                )}
                                PDF
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Download className="h-6 w-6 text-primary" />
                        Xuất báo cáo
                    </h1>
                    <p className="text-muted-foreground">Tải xuống các báo cáo định dạng Excel hoặc PDF</p>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Chọn kỳ báo cáo" />
                        </SelectTrigger>
                        <SelectContent>
                            {periods.map((period) => (
                                <SelectItem key={period.value} value={period.value}>
                                    {period.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="ALL" className="space-y-6">
                <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0 justify-start">
                    <TabsTrigger
                        value="ALL"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background"
                    >
                        Tất cả
                    </TabsTrigger>
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category}
                            value={category}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background"
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="ALL" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reportTypes.map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </div>
                </TabsContent>

                {categories.map((category) => (
                    <TabsContent key={category} value={category} className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reportTypes.filter(r => r.category === category).map((report) => (
                                <ReportCard key={report.id} report={report} />
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Info */}
            <Card className="bg-muted/50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium">Lưu ý khi xuất báo cáo</p>
                            <ul className="mt-2 space-y-1 text-muted-foreground">
                                <li>• Dữ liệu được xuất theo kỳ đã chọn ở trên</li>
                                <li>• File Excel hỗ trợ định dạng .xlsx tương thích với Microsoft Excel</li>
                                <li>• File PDF phù hợp để in ấn và lưu trữ</li>
                                <li>• Một số báo cáo thuế/bảo hiểm theo mẫu chuẩn của cơ quan nhà nước</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
