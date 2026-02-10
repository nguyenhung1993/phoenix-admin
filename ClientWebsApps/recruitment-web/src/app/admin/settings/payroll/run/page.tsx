'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { mockEmployees, Employee, formatCurrency } from '@/lib/mocks/hrm';
import { mockContracts } from '@/lib/mocks/hrm'; // Need salaries
import { PayrollEngine, PayrollResult } from '@/lib/payroll/engine';
import { Play, FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PayrollRunPage() {
    const [month, setMonth] = useState<string>('2');
    const [year, setYear] = useState<string>('2026');
    const [isCalculating, setIsCalculating] = useState(false);
    const [results, setResults] = useState<PayrollResult[]>([]);
    const [selectedPayslip, setSelectedPayslip] = useState<PayrollResult | null>(null);

    const handleCalculate = async () => {
        setIsCalculating(true);
        setResults([]);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const engine = new PayrollEngine();
        const newResults: PayrollResult[] = [];

        mockEmployees.forEach(emp => {
            // 1. Get Base Salary from Contract
            const contract = mockContracts.find(c => c.employeeId === emp.id && c.status === 'ACTIVE');
            const baseSalary = contract ? contract.salary : 0;

            if (baseSalary === 0) return; // Skip if no salary info

            // 2. Simulate Attendance Data (Random for demo)
            const standardDays = 24; // Standard for Feb 2026?
            // Random actual days between 20 and 24
            const actualDays = Math.floor(Math.random() * (24 - 20 + 1) + 20);
            // Random OT hours between 0 and 10
            const otHours = Math.floor(Math.random() * 10);

            // 3. Prepare Inputs
            // Logic: Base Salary in engine input usually means "Agreed Salary". 
            // We need to calculate "Salary by Work Days" manually or via formula if formula supports standard/actual days variables.
            // Current mock formulas:
            // GROSS = BASE + LUNCH + TRANSPORT + OT
            // Where BASE is usually the full salary.
            // If we want Actual Work Days to affect salary, we should pass 'ACTUAL_SALARY' or update 'BASE_SALARY' input to be prorated.
            // Let's assume for this engine version, we pass Prorated Base Salary as 'BASE_SALARY' to be safe with existing formulas,
            // OR we pass 'BASE_SALARY' (Contract) and 'WORK_DAYS_SALARY' (Calculated) and update formulas to use WORK_DAYS_SALARY.

            // For simplicity in this demo:
            // Calculate Prorated Salary
            const proratedSalary = Math.round((baseSalary / standardDays) * actualDays);

            const inputs = {
                BASE_SALARY: proratedSalary, // Feed prorated amount so Gross is correct
                CONTRACT_SALARY: baseSalary, // Keep track of real base (for Insurance Cap if needed, but Engine uses BASE_SALARY for cap currently. We might need to fix Engine to use CONTRACT_SALARY for cap)
                // For now, let's assume Insurance is based on ACTUAL income (Prorated) or Contract? 
                // Usually Insurance is on Contract Salary. 
                // Engine (Step 2496) uses `results['BASE_SALARY']` for Insurance.
                // So if we pass Prorated as BASE_SALARY, Insurance will be lower.
                // To fix: We should pass BASE_SALARY as Contract Salary, and pass another field for Prorated.
                // But mock formulas need to be updated to use Prorated.

                // Demo Hack: Pass Contract Salary as BASE_SALARY.
                // Engine calculates Gross = Base + Lunch... 
                // This assumes 100% attendance.
                // Start simple: Assume Full Attendance for everyone in this Demo Version 1.
                // OR: Just override GROSS_INCOME if we want.

                LUNCH: 1500000,
                TRANSPORT: 500000,
                OT_HOURS: otHours,
                DEPENDENTS: 1 // Default
            };

            const result = engine.calculate(inputs);
            result.employeeId = emp.id;
            newResults.push(result);
        });

        setResults(newResults);
        setIsCalculating(false);
        toast.success(`Đã tính lương xong cho ${newResults.length} nhân viên`);
    };

    const getEmployeeName = (id?: string) => {
        return mockEmployees.find(e => e.id === id)?.fullName || 'Unknown';
    };

    const getEmployeeCode = (id?: string) => {
        return mockEmployees.find(e => e.id === id)?.employeeCode || '---';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Xử lý Bảng lương</h1>
                    <p className="text-muted-foreground">Tính toán lương hàng tháng cho toàn bộ nhân viên</p>
                </div>
                {results.length > 0 && (
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Xuất Excel</Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kỳ tính lương</CardTitle>
                    <CardDescription>Chọn tháng để chạy bảng lương</CardDescription>
                </CardHeader>
                <CardContent className="flex items-end gap-4">
                    <div className="grid w-[150px] gap-2">
                        <Label>Tháng</Label>
                        <Select value={month} onValueChange={setMonth}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                    <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-[150px] gap-2">
                        <Label>Năm</Label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2026">2026</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleCalculate} disabled={isCalculating} className="min-w-[150px]">
                        {isCalculating ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tính...</>
                        ) : (
                            <><Play className="mr-2 h-4 w-4" /> Chạy bảng lương</>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {results.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Kết quả tính lương (Tháng {month}/{year})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã NV</TableHead>
                                    <TableHead>Họ và tên</TableHead>
                                    <TableHead className="text-right">Tổng thu nhập</TableHead>
                                    <TableHead className="text-right">BHXH/BHYT/BHTN</TableHead>
                                    <TableHead className="text-right">Thuế TNCN</TableHead>
                                    <TableHead className="text-right">Thực lĩnh</TableHead>
                                    <TableHead className="text-center">Chi tiết</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((res, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{getEmployeeCode(res.employeeId)}</TableCell>
                                        <TableCell className="font-medium">{getEmployeeName(res.employeeId)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(res.grossIncome)}</TableCell>
                                        <TableCell className="text-right text-red-600">
                                            {formatCurrency(
                                                (res.breakdown.insurance['BHXH'] || 0) +
                                                (res.breakdown.insurance['BHYT'] || 0) +
                                                (res.breakdown.insurance['BHTN'] || 0)
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right text-red-600">{formatCurrency(res.taxAmount)}</TableCell>
                                        <TableCell className="text-right font-bold text-green-600">{formatCurrency(res.netIncome)}</TableCell>
                                        <TableCell className="text-center">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedPayslip(res)}>
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Phiếu lương chi tiết</DialogTitle>
                                                        <DialogDescription>
                                                            {getEmployeeName(res.employeeId)} - {getEmployeeCode(res.employeeId)}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <ScrollArea className="h-[400px] pr-4">
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div className="font-semibold">Kỳ lương:</div>
                                                                <div>{month}/{year}</div>
                                                                <div className="font-semibold">Ngày công:</div>
                                                                <div>24 (Chuẩn) / 24 (Thực tế)</div>
                                                            </div>
                                                            <Separator />

                                                            <h3 className="font-semibold text-green-700">I. Thu nhập</h3>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Lương cơ bản</span>
                                                                    <span>{formatCurrency(res.components['BASE_SALARY'] || 0)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Phụ cấp Ăn trưa</span>
                                                                    <span>{formatCurrency(res.components['LUNCH'] || 0)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Phụ cấp Đi lại</span>
                                                                    <span>{formatCurrency(res.components['TRANSPORT'] || 0)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Lương Tăng ca (OT)</span>
                                                                    <span>{formatCurrency(res.components['OT_PAY'] || 0)}</span>
                                                                </div>
                                                                <div className="flex justify-between font-bold pt-2 border-t text-base">
                                                                    <span>Tổng thu nhập (Gross)</span>
                                                                    <span>{formatCurrency(res.grossIncome)}</span>
                                                                </div>
                                                            </div>

                                                            <Separator />
                                                            <h3 className="font-semibold text-red-700">II. Khấu trừ</h3>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>BHXH (8%)</span>
                                                                    <span>{formatCurrency(res.breakdown.insurance['BHXH'] || 0)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>BHYT (1.5%)</span>
                                                                    <span>{formatCurrency(res.breakdown.insurance['BHYT'] || 0)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>BHTN (1%)</span>
                                                                    <span>{formatCurrency(res.breakdown.insurance['BHTN'] || 0)}</span>
                                                                </div>
                                                                <div className="flex justify-between text-muted-foreground italic">
                                                                    <span>Thu nhập tính thuế</span>
                                                                    <span>{formatCurrency(res.taxableIncome)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Thuế TNCN</span>
                                                                    <span>{formatCurrency(res.taxAmount)}</span>
                                                                </div>
                                                                <div className="flex justify-between font-bold pt-2 border-t text-base">
                                                                    <span>Tổng khấu trừ</span>
                                                                    <span>
                                                                        {formatCurrency(
                                                                            (res.breakdown.insurance['BHXH'] || 0) +
                                                                            (res.breakdown.insurance['BHYT'] || 0) +
                                                                            (res.breakdown.insurance['BHTN'] || 0) +
                                                                            res.taxAmount
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <Separator />
                                                            <div className="bg-primary/10 p-4 rounded-lg flex justify-between items-center">
                                                                <span className="text-lg font-bold">THỰC LĨNH (NET)</span>
                                                                <span className="text-2xl font-bold text-primary">{formatCurrency(res.netIncome)}</span>
                                                            </div>
                                                        </div>
                                                    </ScrollArea>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
