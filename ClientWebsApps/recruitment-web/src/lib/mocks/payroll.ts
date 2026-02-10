import { SalaryComponent, TaxBracket, InsuranceRate } from '@/lib/types/payroll';

// 1. Salary Components
export const mockSalaryComponents: SalaryComponent[] = [
    // Income - Fixed
    { id: '1', code: 'BASE_SALARY', name: 'Lương cơ bản', type: 'INCOME', method: 'FIXED', isSystem: true, isActive: true, order: 1, description: 'Mức lương thỏa thuận trên HĐLĐ' },
    { id: '2', code: 'LUNCH', name: 'Phụ cấp ăn trưa', type: 'INCOME', method: 'FIXED', isSystem: false, isActive: true, order: 2, description: 'Phụ cấp tiền ăn' },
    { id: '3', code: 'TRANSPORT', name: 'Phụ cấp đi lại', type: 'INCOME', method: 'FIXED', isSystem: false, isActive: true, order: 3 },

    // Income - Calculated
    { id: '4', code: 'OT_PAY', name: 'Lương làm thêm giờ', type: 'INCOME', method: 'FORMULA', formula: '([BASE_SALARY] / 26 / 8) * [OT_HOURS] * 1.5', isSystem: true, isActive: true, order: 4 },
    { id: '5', code: 'GROSS_INCOME', name: 'Tổng thu nhập', type: 'INCOME', method: 'FORMULA', formula: '[BASE_SALARY] + [LUNCH] + [TRANSPORT] + [OT_PAY]', isSystem: true, isActive: true, order: 10 },

    // Deduction - Insurance
    { id: '6', code: 'BHXH_EMP', name: 'BHXH (NV)', type: 'INSURANCE', method: 'PERCENTAGE', isSystem: true, isActive: true, order: 11 },
    { id: '7', code: 'BHYT_EMP', name: 'BHYT (NV)', type: 'INSURANCE', method: 'PERCENTAGE', isSystem: true, isActive: true, order: 12 },
    { id: '8', code: 'BHTN_EMP', name: 'BHTN (NV)', type: 'INSURANCE', method: 'PERCENTAGE', isSystem: true, isActive: true, order: 13 },

    // Deduction - Tax
    { id: '9', code: 'TAXABLE_INCOME', name: 'Thu nhập tính thuế', type: 'TAX', method: 'FORMULA', formula: '[GROSS_INCOME] - [LUNCH] - [BHXH_EMP] - [BHYT_EMP] - [BHTN_EMP] - 11000000 - ([DEPENDENTS] * 4400000)', isSystem: true, isActive: true, order: 20 },
    { id: '10', code: 'PIT', name: 'Thuế TNCN', type: 'TAX', method: 'FORMULA', isSystem: true, isActive: true, order: 21 }, // Engine handles PIT logic separately

    // Final
    { id: '11', code: 'NET_INCOME', name: 'Thực lĩnh', type: 'NET_INCOME', method: 'FORMULA', formula: '[GROSS_INCOME] - [BHXH_EMP] - [BHYT_EMP] - [BHTN_EMP] - [PIT]', isSystem: true, isActive: true, order: 99 },
];

// 2. Tax Brackets (Vietnam PIT Progressive Rates)
export const mockTaxBrackets: TaxBracket[] = [
    { id: '1', minIncome: 0, maxIncome: 5000000, taxRate: 5, subtractAmount: 0, order: 1 },
    { id: '2', minIncome: 5000000, maxIncome: 10000000, taxRate: 10, subtractAmount: 250000, order: 2 },
    { id: '3', minIncome: 10000000, maxIncome: 18000000, taxRate: 15, subtractAmount: 750000, order: 3 },
    { id: '4', minIncome: 18000000, maxIncome: 32000000, taxRate: 20, subtractAmount: 1650000, order: 4 },
    { id: '5', minIncome: 32000000, maxIncome: 52000000, taxRate: 25, subtractAmount: 3250000, order: 5 },
    { id: '6', minIncome: 52000000, maxIncome: 80000000, taxRate: 30, subtractAmount: 5850000, order: 6 },
    { id: '7', minIncome: 80000000, maxIncome: undefined, taxRate: 35, subtractAmount: 9850000, order: 7 },
];

// 3. Insurance Rates (2024)
export const mockInsuranceRates: InsuranceRate[] = [
    { id: '1', type: 'BHXH', employeeRate: 8, employerRate: 17.5, capBaseSalary: 36000000, isActive: true, effectiveDate: '2024-01-01' }, // Cap example
    { id: '2', type: 'BHYT', employeeRate: 1.5, employerRate: 3, capBaseSalary: 36000000, isActive: true, effectiveDate: '2024-01-01' },
    { id: '3', type: 'BHTN', employeeRate: 1, employerRate: 1, capBaseSalary: 93600000, isActive: true, effectiveDate: '2024-01-01' }, // Cap varies by region, simplify for now
    { id: '4', type: 'UNION', employeeRate: 0, employerRate: 2, isActive: true, effectiveDate: '2024-01-01' },
];
