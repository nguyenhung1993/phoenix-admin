'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface TaxBracket {
    id: string;
    order: number;
    minIncome: number;
    maxIncome?: number;
    taxRate: number;
    subtractAmount: number;
}

interface InsuranceRate {
    id: string;
    type: string;
    employeeRate: number;
    employerRate: number;
    capBaseSalary?: number;
}

const defaultTaxBrackets: TaxBracket[] = [
    { id: '1', order: 1, minIncome: 0, maxIncome: 5000000, taxRate: 5, subtractAmount: 0 },
    { id: '2', order: 2, minIncome: 5000000, maxIncome: 10000000, taxRate: 10, subtractAmount: 250000 },
    { id: '3', order: 3, minIncome: 10000000, maxIncome: 18000000, taxRate: 15, subtractAmount: 750000 },
    { id: '4', order: 4, minIncome: 18000000, maxIncome: 32000000, taxRate: 20, subtractAmount: 1650000 },
    { id: '5', order: 5, minIncome: 32000000, maxIncome: 52000000, taxRate: 25, subtractAmount: 3250000 },
    { id: '6', order: 6, minIncome: 52000000, maxIncome: 80000000, taxRate: 30, subtractAmount: 5850000 },
    { id: '7', order: 7, minIncome: 80000000, taxRate: 35, subtractAmount: 9850000 },
];

const defaultInsuranceRates: InsuranceRate[] = [
    { id: '1', type: 'BHXH', employeeRate: 8, employerRate: 17.5, capBaseSalary: 36000000 },
    { id: '2', type: 'BHYT', employeeRate: 1.5, employerRate: 3, capBaseSalary: 36000000 },
    { id: '3', type: 'BHTN', employeeRate: 1, employerRate: 1, capBaseSalary: 93600000 },
    { id: '4', type: 'KPCD', employeeRate: 0, employerRate: 2 },
];

export default function TaxInsuranceSettingsPage() {
    const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>(defaultTaxBrackets);
    const [insuranceRates, setInsuranceRates] = useState<InsuranceRate[]>(defaultInsuranceRates);
    const [personalDeduction, setPersonalDeduction] = useState<number>(11000000);
    const [dependentDeduction, setDependentDeduction] = useState<number>(4400000);

    const handleSaveTax = () => { toast.success("Đã lưu cấu hình Thuế TNCN"); };
    const handleSaveInsurance = () => { toast.success("Đã lưu cấu hình Bảo hiểm"); };

    const updateTaxBracket = (id: string, field: keyof TaxBracket, value: any) => {
        setTaxBrackets(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const updateInsuranceRate = (id: string, field: keyof InsuranceRate, value: any) => {
        setInsuranceRates(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cấu hình Thuế & Bảo hiểm</h1>
                    <p className="text-muted-foreground">Thiết lập các tham số tính lương tự động</p>
                </div>
            </div>

            <Tabs defaultValue="tax" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tax">Thuế Thu nhập cá nhân (PIT)</TabsTrigger>
                    <TabsTrigger value="insurance">Bảo hiểm xã hội (SHUI)</TabsTrigger>
                </TabsList>

                <TabsContent value="tax" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mức giảm trừ gia cảnh</CardTitle>
                            <CardDescription>Cấu hình mức giảm trừ khi tính thuế TNCN (VND)</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Giảm trừ bản thân (tháng)</Label>
                                <Input type="number" value={personalDeduction} onChange={(e) => setPersonalDeduction(Number(e.target.value))} />
                                <p className="text-sm text-muted-foreground">Mặc định: 11,000,000 ₫</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Giảm trừ người phụ thuộc (tháng/người)</Label>
                                <Input type="number" value={dependentDeduction} onChange={(e) => setDependentDeduction(Number(e.target.value))} />
                                <p className="text-sm text-muted-foreground">Mặc định: 4,400,000 ₫</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Biểu thuế lũy tiến từng phần</CardTitle>
                                    <CardDescription>Cấu hình các bậc thuế và thuế suất tương ứng</CardDescription>
                                </div>
                                <Button onClick={handleSaveTax}><Save className="mr-2 h-4 w-4" /> Lưu thay đổi</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Bậc</TableHead>
                                        <TableHead>Thu nhập tính thuế từ (Trên)</TableHead>
                                        <TableHead>Đến (Dưới hoặc bằng)</TableHead>
                                        <TableHead>Thuế suất (%)</TableHead>
                                        <TableHead>Số trừ nhanh (Fast Calc)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {taxBrackets.map((bracket) => (
                                        <TableRow key={bracket.id}>
                                            <TableCell className="font-medium">Bậc {bracket.order}</TableCell>
                                            <TableCell><Input type="number" value={bracket.minIncome} onChange={(e) => updateTaxBracket(bracket.id, 'minIncome', Number(e.target.value))} /></TableCell>
                                            <TableCell><Input type="number" value={bracket.maxIncome || ''} placeholder="Vô cực" onChange={(e) => updateTaxBracket(bracket.id, 'maxIncome', e.target.value ? Number(e.target.value) : undefined)} /></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Input type="number" value={bracket.taxRate} onChange={(e) => updateTaxBracket(bracket.id, 'taxRate', Number(e.target.value))} className="w-20" /><span>%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><Input type="number" value={bracket.subtractAmount} onChange={(e) => updateTaxBracket(bracket.id, 'subtractAmount', Number(e.target.value))} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="insurance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Tỷ lệ đóng bảo hiểm</CardTitle>
                                    <CardDescription>Cấu hình tỷ lệ đóng BHXH, BHYT, BHTN cho DN và NLĐ</CardDescription>
                                </div>
                                <Button onClick={handleSaveInsurance}><Save className="mr-2 h-4 w-4" /> Lưu thay đổi</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Loại bảo hiểm</TableHead>
                                        <TableHead>Mã (Code)</TableHead>
                                        <TableHead>NLĐ đóng (%)</TableHead>
                                        <TableHead>DN đóng (%)</TableHead>
                                        <TableHead>Mức lương trần (Cap Base)</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {insuranceRates.map((rate) => (
                                        <TableRow key={rate.id}>
                                            <TableCell className="font-medium">
                                                {rate.type === 'BHXH' ? 'Bảo hiểm Xã hội' :
                                                    rate.type === 'BHYT' ? 'Bảo hiểm Y tế' :
                                                        rate.type === 'BHTN' ? 'Bảo hiểm Thất nghiệp' : 'Kinh phí Công đoàn'}
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{rate.type}</Badge></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Input type="number" step="0.1" value={rate.employeeRate} onChange={(e) => updateInsuranceRate(rate.id, 'employeeRate', Number(e.target.value))} className="w-20" /><span>%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Input type="number" step="0.1" value={rate.employerRate} onChange={(e) => updateInsuranceRate(rate.id, 'employerRate', Number(e.target.value))} className="w-20" /><span>%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input type="number" value={rate.capBaseSalary || ''} placeholder="Không giới hạn" onChange={(e) => updateInsuranceRate(rate.id, 'capBaseSalary', e.target.value ? Number(e.target.value) : undefined)} />
                                                <p className="text-[10px] text-muted-foreground mt-1">
                                                    {rate.capBaseSalary ? new Intl.NumberFormat('vi-VN').format(rate.capBaseSalary) + ' ₫' : 'Không giới hạn'}
                                                </p>
                                            </TableCell>
                                            <TableCell><Badge variant="secondary">Đang áp dụng</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
