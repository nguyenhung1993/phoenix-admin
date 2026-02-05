'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    ShieldCheck,
    Download,
    Search,
    Building,
    Users,
    Wallet,
} from 'lucide-react';
import { exportToExcel } from '@/lib/export-utils';

// Mock Insurance data
const mockInsuranceData = [
    {
        id: 'emp-001',
        code: 'NV001',
        name: 'Nguyễn Văn A',
        socialInsuranceNo: '0123456789',
        baseSalary: 25000000,
        bhxh: { employee: 2000000, company: 4375000 },
        bhyt: { employee: 375000, company: 750000 },
        bhtn: { employee: 250000, company: 250000 },
        status: 'ACTIVE',
    },
    {
        id: 'emp-002',
        code: 'NV002',
        name: 'Trần Thị B',
        socialInsuranceNo: '0123456790',
        baseSalary: 35000000,
        bhxh: { employee: 2800000, company: 6125000 },
        bhyt: { employee: 525000, company: 1050000 },
        bhtn: { employee: 350000, company: 350000 },
        status: 'ACTIVE',
    },
    {
        id: 'emp-003',
        code: 'NV003',
        name: 'Lê Văn C',
        socialInsuranceNo: '0123456791',
        baseSalary: 18000000,
        bhxh: { employee: 1440000, company: 3150000 },
        bhyt: { employee: 270000, company: 540000 },
        bhtn: { employee: 180000, company: 180000 },
        status: 'ACTIVE',
    },
    {
        id: 'emp-004',
        code: 'NV004',
        name: 'Phạm Thị D',
        socialInsuranceNo: '0123456792',
        baseSalary: 36000000,
        bhxh: { employee: 2592000, company: 5670000 },
        bhyt: { employee: 486000, company: 972000 },
        bhtn: { employee: 324000, company: 324000 },
        status: 'ACTIVE',
    },
    {
        id: 'emp-005',
        code: 'NV005',
        name: 'Hoàng Văn E',
        socialInsuranceNo: '0123456793',
        baseSalary: 15000000,
        bhxh: { employee: 1200000, company: 2625000 },
        bhyt: { employee: 225000, company: 450000 },
        bhtn: { employee: 150000, company: 150000 },
        status: 'NEW',
    },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function InsuranceReportPage() {
    const [period, setPeriod] = useState('2024-01');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredData = mockInsuranceData.filter((emp) => {
        const matchesSearch =
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totals = filteredData.reduce(
        (acc, emp) => ({
            baseSalary: acc.baseSalary + emp.baseSalary,
            employeeTotal:
                acc.employeeTotal + emp.bhxh.employee + emp.bhyt.employee + emp.bhtn.employee,
            companyTotal:
                acc.companyTotal + emp.bhxh.company + emp.bhyt.company + emp.bhtn.company,
        }),
        { baseSalary: 0, employeeTotal: 0, companyTotal: 0 }
    );

    const handleExportExcel = () => {
        const exportData = filteredData.map((emp) => ({
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
            'Trạng thái': emp.status === 'ACTIVE' ? 'Đang tham gia' : emp.status === 'NEW' ? 'Mới đăng ký' : 'Đã dừng',
        }));
        exportToExcel(exportData, `BHXH_${period}`, 'Bảo hiểm');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        Báo cáo Bảo hiểm xã hội
                    </h1>
                    <p className="text-muted-foreground">Tổng hợp đóng BHXH, BHYT, BHTN</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportExcel}>
                        <Download className="h-4 w-4 mr-2" />
                        Xuất D02-TS
                    </Button>
                    <Button variant="outline" onClick={handleExportExcel}>
                        <Download className="h-4 w-4 mr-2" />
                        Xuất Excel
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Số NV tham gia</p>
                                <p className="text-2xl font-bold">{filteredData.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng lương đóng BH</p>
                                <p className="text-xl font-bold">{formatCurrency(totals.baseSalary)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">NV đóng</p>
                                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                    {formatCurrency(totals.employeeTotal)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <Building className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Doanh nghiệp đóng</p>
                                <p className="text-xl font-bold text-primary">
                                    {formatCurrency(totals.companyTotal)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Rate Info */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                            <span className="text-muted-foreground">BHXH:</span>
                            <span className="ml-2 font-medium">NV 8% + DN 17.5%</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">BHYT:</span>
                            <span className="ml-2 font-medium">NV 1.5% + DN 3%</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">BHTN:</span>
                            <span className="ml-2 font-medium">NV 1% + DN 1%</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Mức trần:</span>
                            <span className="ml-2 font-medium">36,000,000 VND</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Chọn kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024-01">Tháng 1/2024</SelectItem>
                        <SelectItem value="2024-02">Tháng 2/2024</SelectItem>
                        <SelectItem value="2024-03">Tháng 3/2024</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="ACTIVE">Đang tham gia</SelectItem>
                        <SelectItem value="NEW">Mới đăng ký</SelectItem>
                        <SelectItem value="STOPPED">Đã dừng</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex-1 min-w-[200px] max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm theo tên hoặc mã NV..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Chi tiết đóng bảo hiểm</CardTitle>
                    <CardDescription>
                        Danh sách {filteredData.length} nhân viên
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã NV</TableHead>
                                    <TableHead>Họ tên</TableHead>
                                    <TableHead>Số sổ BHXH</TableHead>
                                    <TableHead className="text-right">Lương đóng BH</TableHead>
                                    <TableHead className="text-right">BHXH</TableHead>
                                    <TableHead className="text-right">BHYT</TableHead>
                                    <TableHead className="text-right">BHTN</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((emp) => (
                                    <TableRow key={emp.id}>
                                        <TableCell>
                                            <Badge variant="outline">{emp.code}</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{emp.name}</TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {emp.socialInsuranceNo}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(emp.baseSalary)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="text-xs">
                                                <div>NV: {formatCurrency(emp.bhxh.employee)}</div>
                                                <div className="text-muted-foreground">
                                                    DN: {formatCurrency(emp.bhxh.company)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="text-xs">
                                                <div>NV: {formatCurrency(emp.bhyt.employee)}</div>
                                                <div className="text-muted-foreground">
                                                    DN: {formatCurrency(emp.bhyt.company)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="text-xs">
                                                <div>NV: {formatCurrency(emp.bhtn.employee)}</div>
                                                <div className="text-muted-foreground">
                                                    DN: {formatCurrency(emp.bhtn.company)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={emp.status === 'ACTIVE' ? 'default' : 'secondary'}
                                                className={
                                                    emp.status === 'ACTIVE'
                                                        ? 'bg-green-500'
                                                        : emp.status === 'NEW'
                                                            ? 'bg-blue-500'
                                                            : ''
                                                }
                                            >
                                                {emp.status === 'ACTIVE'
                                                    ? 'Đang tham gia'
                                                    : emp.status === 'NEW'
                                                        ? 'Mới đăng ký'
                                                        : 'Đã dừng'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
