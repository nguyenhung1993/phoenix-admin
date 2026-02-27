'use client';

import { useState, useEffect } from 'react';
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
    Loader2,
} from 'lucide-react';
import { exportToExcel } from '@/lib/export-utils';

interface InsuranceRecord {
    id: string;
    code: string;
    name: string;
    socialInsuranceNo: string;
    baseSalary: number;
    bhxh: { employee: number; company: number };
    bhyt: { employee: number; company: number };
    bhtn: { employee: number; company: number };
    status: string;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function InsuranceReportPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [insuranceData, setInsuranceData] = useState<InsuranceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/reports/hrm/insurance');
                const data = await res.json();
                setInsuranceData(Array.isArray(data) ? data : []);
            } catch {
                setInsuranceData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = insuranceData.filter((emp) => {
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
        exportToExcel(exportData, `BHXH_report`, 'Bảo hiểm');
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
                    <Button variant="outline" onClick={handleExportExcel} disabled={loading || filteredData.length === 0}>
                        <Download className="h-4 w-4 mr-2" />
                        Xuất D02-TS
                    </Button>
                    <Button variant="outline" onClick={handleExportExcel} disabled={loading || filteredData.length === 0}>
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
                        {loading ? 'Đang tải...' : `Danh sách ${filteredData.length} nhân viên`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Chưa có dữ liệu bảo hiểm
                        </div>
                    ) : (
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
