'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockTaxBrackets, mockInsuranceRates } from '@/lib/mocks/payroll';
import { TaxBracket, InsuranceRate } from '@/lib/types/payroll';
import { Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function TaxInsuranceSettingsPage() {
    // Local state for simulation
    const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>(mockTaxBrackets);
    const [insuranceRates, setInsuranceRates] = useState<InsuranceRate[]>(mockInsuranceRates);

    // Configurable Deductions (Mocked for now as they are usually in a settings object)
    const [personalDeduction, setPersonalDeduction] = useState<number>(11000000);
    const [dependentDeduction, setDependentDeduction] = useState<number>(4400000);

    const handleSaveTax = () => {
        // In a real app, API call here
        toast.success("Đã lưu cấu hình Thuế TNCN");
    };

    const handleSaveInsurance = () => {
        // In a real app, API call here
        toast.success("Đã lưu cấu hình Bảo hiểm");
    };

    const updateTaxBracket = (id: string, field: keyof TaxBracket, value: any) => {
        setTaxBrackets(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const updateInsuranceRate = (id: string, field: keyof InsuranceRate, value: any) => {
        setInsuranceRates(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
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

                {/* TAX SETTINGS */}
                <TabsContent value="tax" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mức giảm trừ gia cảnh</CardTitle>
                            <CardDescription>Cấu hình mức giảm trừ khi tính thuế TNCN (VND)</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Giảm trừ bản thân (tháng)</Label>
                                <Input
                                    type="number"
                                    value={personalDeduction}
                                    onChange={(e) => setPersonalDeduction(Number(e.target.value))}
                                />
                                <p className="text-sm text-muted-foreground">Mặc định: 11,000,000 ₫</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Giảm trừ người phụ thuộc (tháng/người)</Label>
                                <Input
                                    type="number"
                                    value={dependentDeduction}
                                    onChange={(e) => setDependentDeduction(Number(e.target.value))}
                                />
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
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={bracket.minIncome}
                                                    onChange={(e) => updateTaxBracket(bracket.id, 'minIncome', Number(e.target.value))}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={bracket.maxIncome || ''}
                                                    placeholder="Vô cực"
                                                    onChange={(e) => updateTaxBracket(bracket.id, 'maxIncome', e.target.value ? Number(e.target.value) : undefined)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        value={bracket.taxRate}
                                                        onChange={(e) => updateTaxBracket(bracket.id, 'taxRate', Number(e.target.value))}
                                                        className="w-20"
                                                    />
                                                    <span>%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={bracket.subtractAmount}
                                                    onChange={(e) => updateTaxBracket(bracket.id, 'subtractAmount', Number(e.target.value))}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* INSURANCE SETTINGS */}
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
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        value={rate.employeeRate}
                                                        onChange={(e) => updateInsuranceRate(rate.id, 'employeeRate', Number(e.target.value))}
                                                        className="w-20"
                                                    />
                                                    <span>%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        value={rate.employerRate}
                                                        onChange={(e) => updateInsuranceRate(rate.id, 'employerRate', Number(e.target.value))}
                                                        className="w-20"
                                                    />
                                                    <span>%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={rate.capBaseSalary || ''}
                                                    placeholder="Không giới hạn"
                                                    onChange={(e) => updateInsuranceRate(rate.id, 'capBaseSalary', e.target.value ? Number(e.target.value) : undefined)}
                                                />
                                                <p className="text-[10px] text-muted-foreground mt-1">
                                                    {rate.capBaseSalary ? new Intl.NumberFormat('vi-VN').format(rate.capBaseSalary) + ' ₫' : 'Không giới hạn'}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">Đang áp dụng</Badge>
                                            </TableCell>
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
