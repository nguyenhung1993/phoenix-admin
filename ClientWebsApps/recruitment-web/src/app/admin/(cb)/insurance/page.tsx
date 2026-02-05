'use client';

import { useState } from 'react';
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
    mockInsuranceRecords,
    insuranceTypeLabels,
    insuranceStatusLabels,
    InsuranceType,
    formatCurrency,
} from '@/lib/mocks';
import {
    Shield,
    Users,
    Building2,
    Wallet,
    FileText,
    Download,
} from 'lucide-react';

export default function InsurancePage() {
    const [typeFilter, setTypeFilter] = useState<InsuranceType | 'ALL'>('ALL');

    const filteredRecords = mockInsuranceRecords.filter((record) => {
        return typeFilter === 'ALL' || record.type === typeFilter;
    });

    const recordsByType = {
        ALL: mockInsuranceRecords.length,
        BHXH: mockInsuranceRecords.filter(r => r.type === 'BHXH').length,
        BHYT: mockInsuranceRecords.filter(r => r.type === 'BHYT').length,
        BHTN: mockInsuranceRecords.filter(r => r.type === 'BHTN').length,
    };

    const totalContributions = mockInsuranceRecords
        .filter(r => r.status === 'ACTIVE')
        .reduce((sum, r) => sum + r.monthlyContribution, 0);

    const activeRecords = mockInsuranceRecords.filter(r => r.status === 'ACTIVE').length;

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
                                const typeStyle = insuranceTypeLabels[record.type];
                                const statusStyle = insuranceStatusLabels[record.status];

                                return (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                                        <TableCell className="font-mono text-sm">{record.insuranceNumber}</TableCell>
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
