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
    Receipt,
    Download,
    Search,
    Filter,
    Calculator,
    Loader2,
} from 'lucide-react';
import { exportToExcel } from '@/lib/export-utils';

interface PITRecord {
    id: string;
    code: string;
    name: string;
    taxCode: string;
    grossIncome: number;
    socialInsurance: number;
    dependentDeduction: number;
    taxableIncome: number;
    pitAmount: number;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function PITReportPage() {
    const [period, setPeriod] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [pitData, setPitData] = useState<PITRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const parts = period.split('-');
                const month = parts[1] || '1';
                const year = parts[0] || '2024';
                const res = await fetch(`/api/reports/hrm/pit?month=${month}&year=${year}`);
                const data = await res.json();
                setPitData(Array.isArray(data) ? data : []);
            } catch {
                setPitData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [period]);

    const filteredData = pitData.filter(
        (emp) =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totals = filteredData.reduce(
        (acc, emp) => ({
            grossIncome: acc.grossIncome + emp.grossIncome,
            socialInsurance: acc.socialInsurance + emp.socialInsurance,
            dependentDeduction: acc.dependentDeduction + emp.dependentDeduction,
            taxableIncome: acc.taxableIncome + emp.taxableIncome,
            pitAmount: acc.pitAmount + emp.pitAmount,
        }),
        { grossIncome: 0, socialInsurance: 0, dependentDeduction: 0, taxableIncome: 0, pitAmount: 0 }
    );

    const handleExportExcel = () => {
        const exportData = filteredData.map((emp) => ({
            'Mã NV': emp.code,
            'Họ tên': emp.name,
            'Mã số thuế': emp.taxCode,
            'Thu nhập': emp.grossIncome,
            'BHXH': emp.socialInsurance,
            'Giảm trừ PT': emp.dependentDeduction,
            'TN chịu thuế': emp.taxableIncome,
            'Thuế TNCN': emp.pitAmount,
        }));
        exportToExcel(exportData, `Thue_TNCN_${period}`, 'Thuế TNCN');
    };

    const now = new Date();
    const periodOptions = [];
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
        periodOptions.push({ value, label });
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Receipt className="h-6 w-6 text-primary" />
                        Báo cáo Thuế TNCN
                    </h1>
                    <p className="text-muted-foreground">Tổng hợp thuế thu nhập cá nhân theo kỳ</p>
                </div>
                <div className="flex gap-2">
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
                        <p className="text-sm text-muted-foreground">Tổng thu nhập</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(totals.grossIncome)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Tổng giảm trừ</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(totals.socialInsurance + totals.dependentDeduction)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Thu nhập chịu thuế</p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {formatCurrency(totals.taxableIncome)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Tổng thuế TNCN</p>
                        <p className="text-2xl font-bold text-primary">
                            {formatCurrency(totals.pitAmount)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Bộ lọc
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="w-48">
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn kỳ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {periodOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Chi tiết thuế TNCN
                    </CardTitle>
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
                            Chưa có dữ liệu thuế TNCN cho kỳ này
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã NV</TableHead>
                                        <TableHead>Họ tên</TableHead>
                                        <TableHead>Mã số thuế</TableHead>
                                        <TableHead className="text-right">Thu nhập</TableHead>
                                        <TableHead className="text-right">BHXH</TableHead>
                                        <TableHead className="text-right">Giảm trừ PT</TableHead>
                                        <TableHead className="text-right">TN chịu thuế</TableHead>
                                        <TableHead className="text-right">Thuế TNCN</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.map((emp) => (
                                        <TableRow key={emp.id}>
                                            <TableCell>
                                                <Badge variant="outline">{emp.code}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{emp.name}</TableCell>
                                            <TableCell className="font-mono text-sm">{emp.taxCode}</TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(emp.grossIncome)}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {formatCurrency(emp.socialInsurance)}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {formatCurrency(emp.dependentDeduction)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(emp.taxableIncome)}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-primary">
                                                {formatCurrency(emp.pitAmount)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {/* Totals Row */}
                                    <TableRow className="bg-muted/50 font-bold">
                                        <TableCell colSpan={3}>TỔNG CỘNG</TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(totals.grossIncome)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(totals.socialInsurance)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(totals.dependentDeduction)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(totals.taxableIncome)}
                                        </TableCell>
                                        <TableCell className="text-right text-primary">
                                            {formatCurrency(totals.pitAmount)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
