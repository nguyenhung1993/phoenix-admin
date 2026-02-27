'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Shield,
    Users,
    Building2,
    Wallet,
    FileText,
    Download,
    Loader2,
} from 'lucide-react';

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

const insuranceTypeLabels: Record<string, { label: string; color: string }> = {
    BHXH: { label: 'BHXH', color: 'bg-blue-100 text-blue-700' },
    BHYT: { label: 'BHYT', color: 'bg-green-100 text-green-700' },
    BHTN: { label: 'BHTN', color: 'bg-orange-100 text-orange-700' },
};

const insuranceStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    ACTIVE: { label: 'Đang tham gia', variant: 'default' },
    INACTIVE: { label: 'Ngừng tham gia', variant: 'secondary' },
    SUSPENDED: { label: 'Tạm dừng', variant: 'outline' },
};

type InsuranceType = 'BHXH' | 'BHYT' | 'BHTN';

interface InsuranceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    insuranceNumber: string | null;
    type: InsuranceType;
    startDate: string;
    status: string;
    baseSalary: number;
    monthlyContribution: number;
}

export default function InsurancePage() {
    const [typeFilter, setTypeFilter] = useState<InsuranceType | 'ALL'>('ALL');
    const [records, setRecords] = useState<InsuranceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/reports/hrm/insurance');
                const json = await res.json();
                // Map API response to InsuranceRecord format
                const employees = json.data || [];
                const insuranceRecords: InsuranceRecord[] = [];

                employees.forEach((emp: any) => {
                    const baseSalary = emp.baseSalary || 0;
                    // Generate BHXH, BHYT, BHTN records per employee
                    const types: { type: InsuranceType; employeeRate: number }[] = [
                        { type: 'BHXH', employeeRate: 0.08 },
                        { type: 'BHYT', employeeRate: 0.015 },
                        { type: 'BHTN', employeeRate: 0.01 },
                    ];
                    types.forEach(({ type, employeeRate }) => {
                        insuranceRecords.push({
                            id: `${emp.id}-${type}`,
                            employeeId: emp.id,
                            employeeName: emp.employeeName,
                            insuranceNumber: emp.insuranceNumber || null,
                            type,
                            startDate: emp.startDate || new Date().toISOString(),
                            status: 'ACTIVE',
                            baseSalary,
                            monthlyContribution: baseSalary * employeeRate,
                        });
                    });
                });

                setRecords(insuranceRecords);
            } catch {
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredRecords = records.filter((record) => {
        return typeFilter === 'ALL' || record.type === typeFilter;
    });

    const recordsByType = {
        ALL: records.length,
        BHXH: records.filter(r => r.type === 'BHXH').length,
        BHYT: records.filter(r => r.type === 'BHYT').length,
        BHTN: records.filter(r => r.type === 'BHTN').length,
    };

    const totalContributions = records
        .filter(r => r.status === 'ACTIVE')
        .reduce((sum, r) => sum + r.monthlyContribution, 0);

    const activeRecords = records.filter(r => r.status === 'ACTIVE').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Bảo hiểm xã hội</h1>
                    <p className="text-muted-foreground">Quản lý BHXH, BHYT, BHTN của nhân viên</p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Xuất báo cáo
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng hồ sơ</p>
                                <p className="text-2xl font-bold">{recordsByType.ALL}</p>
                            </div>
                            <Shield className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang tham gia</p>
                                <p className="text-2xl font-bold text-green-600">{activeRecords}</p>
                            </div>
                            <Users className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đóng góp/tháng</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(totalContributions)}
                                </p>
                            </div>
                            <Wallet className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Công ty đóng</p>
                                <p className="text-2xl font-bold">17.5%</p>
                            </div>
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Type Tabs */}
            <Tabs defaultValue="ALL" onValueChange={(v) => setTypeFilter(v as InsuranceType | 'ALL')}>
                <TabsList className="flex-wrap h-auto gap-2">
                    <TabsTrigger value="ALL" className="gap-2">
                        Tất cả <Badge variant="secondary">{recordsByType.ALL}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="BHXH" className="gap-2">
                        BHXH <Badge variant="secondary">{recordsByType.BHXH}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="BHYT" className="gap-2">
                        BHYT <Badge variant="secondary">{recordsByType.BHYT}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="BHTN" className="gap-2">
                        BHTN <Badge variant="secondary">{recordsByType.BHTN}</Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Insurance Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Danh sách hồ sơ bảo hiểm
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Số sổ BH</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Ngày tham gia</TableHead>
                                <TableHead className="text-right">Lương cơ sở</TableHead>
                                <TableHead className="text-right">Đóng góp/tháng</TableHead>
                                <TableHead>Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.map((record) => {
                                const typeStyle = insuranceTypeLabels[record.type] || { label: record.type, color: 'bg-gray-100' };
                                const statusStyle = insuranceStatusLabels[record.status] || { label: record.status, variant: 'secondary' as const };

                                return (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                                        <TableCell className="font-mono text-sm">{record.insuranceNumber || '-'}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${typeStyle.color}`}>
                                                {typeStyle.label}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(record.startDate).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {formatCurrency(record.baseSalary)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {formatCurrency(record.monthlyContribution)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredRecords.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không có hồ sơ bảo hiểm nào
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Rate Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Tỷ lệ đóng bảo hiểm (Theo quy định)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Loại bảo hiểm</TableHead>
                                <TableHead className="text-center">Người lao động</TableHead>
                                <TableHead className="text-center">Doanh nghiệp</TableHead>
                                <TableHead className="text-center">Tổng</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">BHXH - Bảo hiểm xã hội</TableCell>
                                <TableCell className="text-center">8%</TableCell>
                                <TableCell className="text-center">17.5%</TableCell>
                                <TableCell className="text-center font-bold">25.5%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">BHYT - Bảo hiểm y tế</TableCell>
                                <TableCell className="text-center">1.5%</TableCell>
                                <TableCell className="text-center">3%</TableCell>
                                <TableCell className="text-center font-bold">4.5%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">BHTN - Bảo hiểm thất nghiệp</TableCell>
                                <TableCell className="text-center">1%</TableCell>
                                <TableCell className="text-center">1%</TableCell>
                                <TableCell className="text-center font-bold">2%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
