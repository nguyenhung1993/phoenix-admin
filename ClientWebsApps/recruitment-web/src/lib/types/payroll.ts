export type ComponentType = 'INCOME' | 'DEDUCTION' | 'TAX' | 'INSURANCE' | 'NET_INCOME' | 'EMPLOYER_COST';
export type CalculationMethod = 'FIXED' | 'FORMULA' | 'PERCENTAGE';

export interface SalaryComponent {
    id: string;
    code: string;           // E.g., BASE_SALARY, LUNCH_ALLOWANCE
    name: string;           // E.g., Lương cơ bản, Phụ cấp ăn trưa
    type: ComponentType;
    method: CalculationMethod;
    formula?: string;       // E.g., "[BASE_SALARY] / 26 * [WORK_DAYS]"
    isSystem: boolean;      // System components cannot be deleted (e.g., TAX, INSURANCE)
    isActive: boolean;
    order: number;
    description?: string;
}

export interface PayrollFormula {
    id: string;
    componentId: string;
    expression: string;     // The raw formula string
    variables: string[];    // List of component codes used in formula
    description?: string;
}

export interface TaxBracket {
    id: string;
    minIncome: number;      // >
    maxIncome?: number;     // <= (undefined means infinite)
    taxRate: number;        // Percentage (0-100)
    subtractAmount: number; // Fast calculation number (số trừ nhanh)
    order: number;
}

export interface InsuranceRate {
    id: string;
    type: 'BHXH' | 'BHYT' | 'BHTN' | 'UNION'; // Union fee (Kinh phí công đoàn)
    employeeRate: number;   // % paid by employee
    employerRate: number;   // % paid by company
    capBaseSalary?: number; // Max salary base for calculation (mức trần)
    isActive: boolean;
    effectiveDate: string;
}
