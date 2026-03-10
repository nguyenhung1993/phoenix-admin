'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Loader2, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PageHeaderSkeleton } from '@/components/ui/skeletons';

interface PayrollSlip {
    id: string;
    month: number;
    year: number;
    standardWorkDays: number;
    actualWorkDays: number;
    baseSalary: number;
    salaryByWorkDays: number;
    overtimeHours: number;
    overtimePay: number;
    allowances: number;
    bonus: number;
    totalIncome: number;
    bhxh: number;
    bhyt: number;
    bhtn: number;
    tax: number;
    totalDeductions: number;
    netSalary: number;
    createdAt: string;
}

export default function PortalPayslipsPage() {
    const [payslips, setPayslips] = useState<PayrollSlip[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string>('');

    useEffect(() => {
        const fetchPayslips = async () => {
            try {
                const res = await fetch('/api/portal/payslips');
                const json = await res.json();
                if (json.data) {
                    setPayslips(json.data);
                    if (json.data.length > 0) {
                        setSelectedId(json.data[0].id);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch payslips:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayslips();
    }, []);

    const selectedSlip = payslips.find(p => p.id === selectedId);

    const handleExportPDF = () => {
        if (!selectedSlip) return;

        const doc = new jsPDF();
        const title = `Phieu_Luong_Thang_${selectedSlip.month}_${selectedSlip.year}`;

        // Add font sizes and styling
        doc.setFontSize(18);
        doc.text('PHIẾU LƯƠNG NHÂN VIÊN (PAYSLIP)', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Kỳ lương: Tháng ${selectedSlip.month}/${selectedSlip.year}`, 20, 35);

        // Add table
        const tableData = [
            ['I. THÔNG TIN CHUNG', ''],
            ['Ngày công chuẩn', `${selectedSlip.standardWorkDays} ngày`],
            ['Ngày công thực tế', `${selectedSlip.actualWorkDays} ngày`],
            ['Mức lương cơ bản', formatCurrency(selectedSlip.baseSalary)],
            ['', ''],
            ['II. TỔNG THU NHẬP (INCOME)', formatCurrency(selectedSlip.totalIncome)],
            ['Lương theo ngày công', formatCurrency(selectedSlip.salaryByWorkDays)],
            ['Phụ cấp / Trợ cấp', formatCurrency(selectedSlip.allowances)],
            ['Thưởng', formatCurrency(selectedSlip.bonus)],
            ['Lương làm thêm giờ (OT)', formatCurrency(selectedSlip.overtimePay)],
            [`Số giờ OT: ${selectedSlip.overtimeHours}h`, ''],
            ['', ''],
            ['III. CÁC KHOẢN KHẤU TRỪ (DEDUCTIONS)', formatCurrency(selectedSlip.totalDeductions)],
            ['BHXH', formatCurrency(selectedSlip.bhxh)],
            ['BHYT', formatCurrency(selectedSlip.bhyt)],
            ['BHTN', formatCurrency(selectedSlip.bhtn)],
            ['Thuế TNCN', formatCurrency(selectedSlip.tax)],
            ['', ''],
            ['IV. THỰC LÃNH (NET SALARY)', formatCurrency(selectedSlip.netSalary)]
        ];

        (doc as any).autoTable({
            startY: 45,
            head: [['Chi tiết khoản mục', 'Số tiền']],
            body: tableData,
            theme: 'grid',
            styles: { font: 'Arial', fontSize: 10 }, // Need font supporting vietnamese, default might fallback
            willDrawCell: function (data: any) {
                if (data.row.raw[0].includes('I.') || data.row.raw[0].includes('II.') || data.row.raw[0].includes('III.') || data.row.raw[0].includes('IV.')) {
                    doc.setFillColor(240, 240, 240);
                    doc.setTextColor(0, 0, 0);
                    doc.setFont('helvetica', 'bold');
                }
            }
        });

        doc.save(`${title}.pdf`);
    };

    if (loading) {
        return <PageHeaderSkeleton />;
    }

    if (payslips.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Lương & Thưởng</h1>
                    <p className="text-muted-foreground">Theo dõi và tải xuống phiếu lương hàng tháng</p>
                </div>
                <Card className="flex flex-col items-center justify-center py-16 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <CardTitle className="mb-2">Chưa có phiếu lương</CardTitle>
                    <CardDescription>
                        Hệ thống chưa ghi nhận phiếu lương nào của bạn hoặc lương tháng này chưa được chốt.
                    </CardDescription>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-500" />
                        Lương & Thưởng
                    </h1>
                    <p className="text-muted-foreground">Theo dõi và tải xuống phiếu lương hàng tháng</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={selectedId} onValueChange={setSelectedId}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Chọn kỳ lương" />
                        </SelectTrigger>
                        <SelectContent>
                            {payslips.map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                    Tháng {p.month}/{p.year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExportPDF} disabled={!selectedSlip}>
                        <Download className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                </div>
            </div>

            {selectedSlip && (
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Summary Cards */}
                    <Card className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x dark:divide-gray-800">
                        <div className="p-6 flex flex-col items-center justify-center text-center">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Tổng Thu Nhập</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                                {formatCurrency(selectedSlip.totalIncome)}
                            </p>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center text-center bg-muted/20">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Tổng Khấu Trừ</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                                -{formatCurrency(selectedSlip.totalDeductions)}
                            </p>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center text-center bg-primary/5 dark:bg-primary/10">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Thực Lãnh</p>
                            <p className="text-3xl font-black text-primary">
                                {formatCurrency(selectedSlip.netSalary)}
                            </p>
                            <Badge variant="outline" className="mt-2 text-green-600 border-green-600 bg-green-50 dark:bg-green-950/30">
                                Đã chuyển khoản
                            </Badge>
                        </div>
                    </Card>

                    {/* Detailed Breakdowns */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Chi tiết Thu Nhập</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium text-muted-foreground">Mức lương cơ bản</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(selectedSlip.baseSalary)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Lương ngày công ({selectedSlip.actualWorkDays}/{selectedSlip.standardWorkDays})</TableCell>
                                        <TableCell className="text-right">{formatCurrency(selectedSlip.salaryByWorkDays)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium pl-8 text-muted-foreground flex items-center justify-between">
                                            <span>Làm thêm giờ (OT)</span>
                                            <Badge variant="secondary" className="text-xs font-normal ml-2">{selectedSlip.overtimeHours}h</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(selectedSlip.overtimePay)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Phụ cấp & Trợ cấp</TableCell>
                                        <TableCell className="text-right">{formatCurrency(selectedSlip.allowances)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Thưởng (Bonus)</TableCell>
                                        <TableCell className="text-right text-green-600 dark:text-green-400">+{formatCurrency(selectedSlip.bonus)}</TableCell>
                                    </TableRow>
                                    <TableRow className="bg-muted/50 font-bold border-t-2">
                                        <TableCell>TỔNG THU NHẬP</TableCell>
                                        <TableCell className="text-right text-lg">{formatCurrency(selectedSlip.totalIncome)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Chi tiết Khấu Trừ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Bảo hiểm Xã hội (BHXH)</TableCell>
                                        <TableCell className="text-right text-red-600 dark:text-red-400">-{formatCurrency(selectedSlip.bhxh)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Bảo hiểm Y tế (BHYT)</TableCell>
                                        <TableCell className="text-right text-red-600 dark:text-red-400">-{formatCurrency(selectedSlip.bhyt)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Bảo hiểm Thất nghiệp</TableCell>
                                        <TableCell className="text-right text-red-600 dark:text-red-400">-{formatCurrency(selectedSlip.bhtn)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Thuế TNCN</TableCell>
                                        <TableCell className="text-right text-red-600 dark:text-red-400">-{formatCurrency(selectedSlip.tax)}</TableCell>
                                    </TableRow>
                                    <TableRow className="bg-muted/50 font-bold border-t-2">
                                        <TableCell>TỔNG KHẤU TRỪ</TableCell>
                                        <TableCell className="text-right text-lg text-red-600 dark:text-red-500">-{formatCurrency(selectedSlip.totalDeductions)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
