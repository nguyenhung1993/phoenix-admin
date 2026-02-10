'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { PayrollEngine } from '@/lib/payroll/engine';
import { formatCurrency } from '@/lib/mocks/hrm';
import { Download } from 'lucide-react';

export default function PayrollTestPage() {
    // Default values
    const [baseSalary, setBaseSalary] = useState<number>(30000000);
    const [standardDays, setStandardDays] = useState<number>(22);
    const [actualDays, setActualDays] = useState<number>(20);
    const [otHours, setOtHours] = useState<number>(0);
    const [bonus, setBonus] = useState<number>(2000000);
    const [lunchAllowance, setLunchAllowance] = useState<number>(1500000);

    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const inputs = {
            BASE_SALARY: baseSalary,
            STANDARD_DAYS: standardDays,
            ACTUAL_DAYS: actualDays,
            OT_HOURS: otHours,
            BONUS: bonus,
            LUNCH: lunchAllowance,
            DEPENDENTS: 1, // Default 1 dependent
        };

        // Override engine logic slightly for this simulation if needed, 
        // or ensure engine handles ACTUAL_DAYS / STANDARD_DAYS correctly.
        // For now, we'll update the mock engine to handle pro-rated salary if it doesn't already.
        // But since the engine implementation (Step 2258) used mock formulas like "[BASE_SALARY] + ...",
        // we might need to adjust the Mock Formulas (Step 2252) or just pre-calculate here.

        // Let's assume we pass these to engine and engine handles them via config formulas.
        // However, standard mock formulas in Step 2252 were: 
        // Gross = Base + Lunch + Transport + OT. 
        // They didn't have Proration (Actual/Standard).

        // RE-IMPLEMENTING FORMULA LOGIC LOCAL FOR SIMULATION (OR UPDATING ENGINE INPUTS)
        // To match the specific screenshot logic "Salary = Base * Actual / Standard", we override the BASE_SALARY input to the engine represents the *Prorated* Base Salary, or we adjust the engine.
        // Let's calculate the "Real Base Salary" before passing to engine to keep it simple.

        const proratedBaseSalary = (baseSalary / standardDays) * actualDays;

        const engineInputs = {
            BASE_SALARY: proratedBaseSalary,
            LUNCH: lunchAllowance, // Full lunch for simplicity, or prorate? usually full or based on days. let's keep full.
            TRANSPORT: 0,
            OT_HOURS: otHours,
            // We need to inject the raw base salary for OT calculation if OT depends on standard salary
            // The formula for OT in mocks was: ([BASE_SALARY] / 26 / 8) * [OT_HOURS] * 1.5
            // So we should pass the original base salary as a separate variable if we want accurate OT.
            // Let's overwrite the formula-used BASE_SALARY with the prorated one, but that affects OT.

            // BETTER APPROACH: Pass RAW_BASE and calculate components manually here before engine? 
            // OR simple hack: Pass "BASE_SALARY" as the prorated amount. 
            // And OT calculation in mock engine uses BASE_SALARY. 
            // If we pass Prorated Base, OT will be calculated on Prorated Base (Wrong).

            // Let's stick to the engine but maybe we need to update the Mock Formulas to support Proration?
            // User just wants a calculator. I will perform the "Pre-calculation" of components here and pass 'Fixed' values to engine for Tax/Insurance.
        };

        // Actually, to make it exactly like the screenshot, I will build a custom object for the view
        // using the Engine ONLY for Tax/Insurance/Net calculation to ensure consistency.

        // 1. Calculate Earnings
        const salaryByWorkDays = Math.round((baseSalary / standardDays) * actualDays);
        const otPay = Math.round((baseSalary / standardDays / 8) * otHours * 1.5);
        const grossIncome = salaryByWorkDays + otPay + lunchAllowance + bonus;

        // 2. Pass to Engine for Tax/Insurance
        // Engine expects specific inputs.
        // We can use the 'GROSS_INCOME' override feature if our engine supports it, 
        // or just pass components that sum up to Gross.
        const engine = new PayrollEngine();

        // We will pass values directly. The engine sorts components.
        // If we want to use the Engine's Tax Logic, we need to make sure TAXABLE_INCOME is calculated correctly.
        // Mock Formula for Taxable: [GROSS_INCOME] - [LUNCH] - [INSURANCE] - ...

        const calcResult = engine.calculate({
            BASE_SALARY: baseSalary, // Used for Insurance Cap check (if using Base for Insurance)
            GROSS_INCOME: grossIncome, // Override calculated gross
            LUNCH: lunchAllowance,
            // We need to ensure the engine uses THESE values and not re-calculates Gross from Base.
            // In my engine implementation:
            // "if (comp.method === 'Fixed') { if (results[comp.code] === undefined) ... }"
            // "else if (comp.method === 'FORMULA') { results[comp.code] = this.evaluateFormula... }"

            // GROSS_INCOME is a FORMULA in mock components. So it will be RE-CALCULATED.
            // This is a problem if I want to override it.
            // I should override the *inputs* to the formula.
            // But "Salary By Work Days" isn't a standard mock component.

            // SOLUTION: For this simulation page, I will rely on the Engine's `calculatePIT` and `Insurance` logic 
            // but might need to instantiate a "Custom" engine or just manually calculate using helper functions if I can't easily override.
            // WAIT, `PayrollEngine` in step 2258 is a class. I can just use it. 

            // Let's try to pass the "Adjusted" Base Salary as "BASE_SALARY".
            // If I do that: Gross = ProratedBase + Lunch + OT + Bonus.
            // OT Formula = ProratedBase / 26... (Wait, OT should be on real base).

            // OK, I will perform the full calculation inside this component for the "Simulation" aspect, 
            // reusing the Engine's logic for the hard parts (Tax/Insurance) by creating a localized context.
        });

        // RE-PLAN: To emulate the screenshot perfectly:
        // 1. Manual calc of Income items.
        // 2. Manual calc of Insurance (8%, 1.5%, 1%) on Base Salary (or Cap).
        // 3. Manual calc of Taxable Income.
        // 4. Use Engine.calculatePIT(taxable).

        // Let's do that. It's safer for a "Calculator" UI to be explicit.

        // Insurance on Full Base Salary (User usually pays insurance on agreed wage, not prorated, or depends on policy. Let's assume Full Base).
        const INS_CAP_BASE = 36000000;
        const INS_CAP_BHTN = 93600000;
        const insBase = Math.min(baseSalary, INS_CAP_BASE);
        const bhtnBase = Math.min(baseSalary, INS_CAP_BHTN);

        const bhxh = insBase * 0.08;
        const bhyt = insBase * 0.015;
        const bhtn = bhtnBase * 0.01;
        const totalInsurance = bhxh + bhyt + bhtn;

        const taxable = grossIncome - lunchAllowance - totalInsurance - 11000000 - (1 * 4400000);

        // Tax (Accessing private method? No, let's just use the engine for a dummy calculation)
        const dummyInput = {
            TAXABLE_INCOME: taxable > 0 ? taxable : 0
        };
        // We can force the engine to just run the PIT component if we want, or just expose calculatePIT.
        // Since I can't easily change the engine code right now without another step, 
        // I will use a dummy calc:
        // Create an engine instance.
        // It has a method calculate(inputs).
        // I want it to calculate PIT based on my Taxable.
        // I can pass { TAXABLE_INCOME: x, PIT: 0 } -> The engine will see PIT is a formula/system... 
        // Wait, in Mock data, PIT is "method: FORMULA". The engine will run `calculatePIT`.
        // So if I pass `TAXABLE_INCOME` in inputs, the engine uses it?
        // In Step 2258: `const taxableIncome = results['TAXABLE_INCOME'] || 0;` ... `results[comp.code] = this.evaluateFormula...`
        // Wait, TAXABLE_INCOME is also a formula in mock data: `[GROSS] - ...`. 
        // If I pass it in `inputs`, the Engine loop checks: 
        // `if (comp.method === 'FIXED') ... else if (comp.method === 'FORMULA') ...`
        // It will RE-CALCULATE TAXABLE_INCOME using the formula, overwriting my input if I'm not careful.
        // BUT, if I don't provide GROSS inputs, the formula might result in negative or wrong values.

        // Hack: I will copy the `calculatePIT` logic locally for this specific UI to ensure 100% responsiveness and accuracy for the specific logic requested.
        // It's a "Calculator" - okay to be standalone.
        const calculatePIT = (income: number) => {
            if (income <= 0) return 0;
            if (income <= 5000000) return income * 0.05;
            if (income <= 10000000) return income * 0.1 - 250000;
            if (income <= 18000000) return income * 0.15 - 750000;
            if (income <= 32000000) return income * 0.2 - 1650000;
            if (income <= 52000000) return income * 0.25 - 3250000;
            if (income <= 80000000) return income * 0.3 - 5850000;
            return income * 0.35 - 9850000;
        };

        const tax = calculatePIT(taxable);
        const net = grossIncome - totalInsurance - tax;

        setResult({
            baseSalary,
            salaryByWorkDays,
            otPay,
            lunchAllowance,
            bonus,
            grossIncome,
            bhxh,
            bhyt,
            bhtn,
            taxable,
            tax,
            net
        });
    };

    useEffect(() => {
        calculate();
    }, [baseSalary, standardDays, actualDays, otHours, bonus]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Phiếu lương Online</h1>
                    <p className="text-muted-foreground">Thông tin lương thưởng và công cụ tính toán cá nhân</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Tải PDF</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Inputs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tham số tính lương</CardTitle>
                        <CardDescription>Điều chỉnh để xem thay đổi lương thực nhận</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label>Lương cơ bản</Label>
                                <Input
                                    type="number"
                                    value={baseSalary}
                                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                                    className="w-[150px] text-right font-bold"
                                />
                            </div>
                            <Slider
                                value={[baseSalary]}
                                min={5000000}
                                max={100000000}
                                step={500000}
                                onValueChange={(v) => setBaseSalary(v[0])}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {new Intl.NumberFormat('vi-VN').format(baseSalary)} ₫
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày công chuẩn</Label>
                                <div className="flex items-center justify-between">
                                    <Input
                                        type="number"
                                        step="0.5"
                                        value={standardDays}
                                        onChange={(e) => setStandardDays(Number(e.target.value))}
                                        className="h-8 w-20 text-center"
                                    />
                                    <span className="text-sm text-muted-foreground">ngày</span>
                                </div>
                                <Slider
                                    value={[standardDays]}
                                    min={10}
                                    max={31}
                                    step={0.5}
                                    onValueChange={(v) => setStandardDays(v[0])}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày công thực tế</Label>
                                <div className="flex items-center justify-between">
                                    <Input
                                        type="number"
                                        step="0.5"
                                        value={actualDays}
                                        onChange={(e) => setActualDays(Number(e.target.value))}
                                        className="h-8 w-20 text-center"
                                    />
                                    <span className="text-sm text-muted-foreground">ngày</span>
                                </div>
                                <Slider
                                    value={[actualDays]}
                                    min={0}
                                    max={31}
                                    step={0.5}
                                    onValueChange={(v) => setActualDays(v[0])}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Giờ tăng ca (OT)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={otHours}
                                        onChange={(e) => setOtHours(Number(e.target.value))}
                                        className="h-8 w-20 text-center"
                                    />
                                    <span className="text-sm text-muted-foreground">giờ</span>
                                </div>
                            </div>
                            <Slider
                                value={[otHours]}
                                min={0}
                                max={100}
                                step={0.5}
                                onValueChange={(v) => setOtHours(v[0])}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Phụ cấp (Ăn trưa)</Label>
                            <Input
                                type="number"
                                value={lunchAllowance}
                                onChange={(e) => setLunchAllowance(Number(e.target.value))}
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

                {/* Results */}
                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">KẾT QUẢ TÍNH TOÁN (DỰ KIẾN)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-end">
                                <div className="text-3xl font-bold bg-primary text-primary-foreground px-4 py-2 rounded-full">
                                    {result ? formatCurrency(result.net) : '...'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Details */}
                        <Card>
                            <CardHeader><CardTitle className="text-green-600">KHOẢN THU NHẬP</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Lương cơ bản</span>
                                    <span className="font-bold">{formatCurrency(baseSalary)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Quy đổi ngày công ({actualDays}/{standardDays})</span>
                                    <span>{result ? formatCurrency(result.salaryByWorkDays) : 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tăng ca ({otHours} giờ)</span>
                                    <span>{result ? formatCurrency(result.otPay) : 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phụ cấp (Ăn trưa)</span>
                                    <span>{formatCurrency(lunchAllowance)}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Thưởng hiệu suất</span>
                                    <span>{formatCurrency(bonus)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg text-green-700">
                                    <span>TỔNG THU NHẬP</span>
                                    <span>{result ? formatCurrency(result.grossIncome) : 0}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-red-600">KHOẢN KHẤU TRỪ</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span>BHXH (8%)</span>
                                    <span>{result ? formatCurrency(result.bhxh) : 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>BHYT (1.5%)</span>
                                    <span>{result ? formatCurrency(result.bhyt) : 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>BHTN (1%)</span>
                                    <span>{result ? formatCurrency(result.bhtn) : 0}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Thuế TNCN tạm tính</span>
                                    <span>{result ? formatCurrency(result.tax) : 0}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg text-red-700">
                                    <span>TỔNG KHẤU TRỪ</span>
                                    <span>{result ? formatCurrency(result.bhxh + result.bhyt + result.bhtn + result.tax) : 0}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
