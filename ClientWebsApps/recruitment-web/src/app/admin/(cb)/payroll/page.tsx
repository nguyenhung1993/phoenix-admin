'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { generateMockPayroll, PayrollSlip } from '@/lib/mocks/cb';
import { formatCurrency } from '@/lib/mocks';
import { Calculator, CheckCircle2, Eye, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';

export default function PayrollPage() {
    const [month, setMonth] = useState('2');
    const [year, setYear] = useState('2026');
    const currentUserId = '1';

    // Mock initial data
    const allPayroll = generateMockPayroll(parseInt(month), parseInt(year));
    const initialSlip = allPayroll.find(p => p.employeeId === currentUserId);

    // Dynamic Calculation State
    const [baseSalary, setBaseSalary] = useState(initialSlip?.baseSalary || 30000000);
    const [standardDays, setStandardDays] = useState(initialSlip?.standardWorkDays || 22);
    const [actualDays, setActualDays] = useState(initialSlip?.actualWorkDays || 22);
    const [otHours, setOtHours] = useState(initialSlip?.overtimeHours || 0);
    const [bonus, setBonus] = useState(initialSlip?.bonus || 0);

    // Recalculate Logic
    const dailyRate = baseSalary / standardDays;
    const salaryByWorkDays = dailyRate * actualDays;
    const overtimePay = (dailyRate / 8) * 1.5 * otHours;
    const allowances = initialSlip?.allowances || 1500000;

    const totalIncome = salaryByWorkDays + overtimePay + allowances + bonus;

    const insuranceSalary = baseSalary;
    const bhxh = insuranceSalary * 0.08;
    const bhyt = insuranceSalary * 0.015;
    const bhtn = insuranceSalary * 0.01;
    // Simplified tax calculation
    const taxableIncome = totalIncome - (bhxh + bhyt + bhtn) - 11000000;
    const tax = Math.max(0, taxableIncome * 0.05);

    const totalDeductions = bhxh + bhyt + bhtn + tax;
    const netSalary = totalIncome - totalDeductions;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Phiếu lương Online</h1>
                    <p className="text-muted-foreground">Thông tin lương thưởng và công cụ tính toán cá nhân</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Tải PDF</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* SETTINGS / INPUTS COLUMN */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Tham số tính lương</CardTitle>
                            <CardDescription>Điều chỉnh để xem thay đổi lương thực nhận</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Lương cơ bản</Label>
                                <div className="text-lg font-bold text-slate-700">{formatCurrency(baseSalary)}</div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>Ngày công chuẩn</Label>
                                    <span className="text-sm font-medium">{standardDays} ngày</span>
                                </div>
                                <Slider
                                    value={[standardDays]}
                                    min={20} max={31} step={1}
                                    onValueChange={(v) => setStandardDays(v[0])}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>Ngày công thực tế</Label>
                                    <span className="text-sm font-medium">{actualDays} ngày</span>
                                </div>
                                <Slider
                                    value={[actualDays]}
                                    min={0} max={31} step={0.5}
                                    onValueChange={(v) => setActualDays(v[0])}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>Giờ tăng ca (OT)</Label>
                                    <span className="text-sm font-medium">{otHours} giờ</span>
                                </div>
                                <Slider
                                    value={[otHours]}
                                    min={0} max={50} step={0.5}
                                    onValueChange={(v) => setOtHours(v[0])}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Thưởng thêm</Label>
                                <Input
                                    type="number"
                                    value={bonus}
                                    onChange={(e) => setBonus(Number(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RESULT COLUMNS */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-l-4 border-l-blue-600 bg-slate-50/50">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle>KẾT QUẢ TÍNH TOÁN (DỰ KIẾN)</CardTitle>
                                <Badge variant="outline" className="text-xl px-4 py-2 bg-blue-600 text-white border-blue-700 shadow-md">
                                    {formatCurrency(netSalary)}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* EARNINGS */}
                        <Card>
                            <CardHeader className="bg-green-50/50 border-b">
                                <CardTitle className="text-base text-green-700">KHOẢN THU NHẬP</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex justify-between items-center border-b border-dashed pb-2">
                                    <span className="text-muted-foreground">Lương cơ bản</span>
                                    <span className="font-medium">{formatCurrency(baseSalary)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dashed pb-2">
                                    <span className="text-muted-foreground">Ngày công ({actualDays} / {standardDays})</span>
                                    <span className="font-medium">{formatCurrency(salaryByWorkDays)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dashed pb-2">
                                    <span className="text-muted-foreground">Tăng ca ({otHours} giờ)</span>
                                    <span className="font-medium">{formatCurrency(overtimePay)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dashed pb-2">
                                    <span className="text-muted-foreground">Phụ cấp</span>
                                    <span className="font-medium">{formatCurrency(allowances)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-muted-foreground">Thưởng hiệu suất</span>
                                    <span className="font-medium text-green-600">{formatCurrency(bonus)}</span>
                                </div>
                                <div className="flex justify-between items-end pt-4 border-t-2">
                                    <span className="font-bold text-lg">TỔNG THU NHẬP</span>
                                    <span className="font-bold text-xl text-green-700">{formatCurrency(totalIncome)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* DEDUCTIONS */}
                        <Card>
                            <CardHeader className="bg-red-50/50 border-b">
                                <CardTitle className="text-base text-red-700">KHOẢN KHẤU TRỪ</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex justify-between items-center border-b border-dashed pb-2">
                                    <span className="text-muted-foreground">BHXH (8%)</span>
                                    <span className="font-medium">{formatCurrency(bhxh)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dashed pb-2">
                                    <span className="text-muted-foreground">BHYT (1.5%)</span>
                                    <span className="font-medium">{formatCurrency(bhyt)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dashed pb-2">
                                    <span className="text-muted-foreground">BHTN (1%)</span>
                                    <span className="font-medium">{formatCurrency(bhtn)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dashed pb-2">
                                    <span className="text-muted-foreground">Thuế TNCN tạm tính</span>
                                    <span className="font-medium">{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex justify-between items-end pt-12 border-t-2">
                                    <span className="font-bold text-lg">TỔNG KHẤU TRỪ</span>
                                    <span className="font-bold text-xl text-red-700">{formatCurrency(totalDeductions)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
