import { SalaryComponent, TaxBracket, InsuranceRate } from '@/lib/types/payroll';
import { mockSalaryComponents, mockTaxBrackets, mockInsuranceRates } from '@/lib/mocks/payroll';
import { Employee } from '@/lib/mocks/hrm';

export interface PayrollInput {
    [key: string]: number; // e.g., { BASE_SALARY: 10000000, OT_HOURS: 20 }
}

export interface PayrollResult {
    employeeId?: string;
    components: Record<string, number>;
    grossIncome: number;
    taxableIncome: number;
    taxAmount: number;
    netIncome: number;
    breakdown: {
        insurance: Record<string, number>;
        tax: Record<string, number>;
    }
}

export class PayrollEngine {
    private components: SalaryComponent[];
    private taxBrackets: TaxBracket[];
    private insuranceRates: InsuranceRate[];

    constructor(
        components: SalaryComponent[] = mockSalaryComponents,
        taxBrackets: TaxBracket[] = mockTaxBrackets,
        insuranceRates: InsuranceRate[] = mockInsuranceRates
    ) {
        this.components = components;
        this.taxBrackets = taxBrackets;
        this.insuranceRates = insuranceRates;
    }

    /**
     * Calculate payroll for a single employee
     */
    public calculate(inputs: PayrollInput): PayrollResult {
        // Clone inputs to avoid mutation
        const results: Record<string, number> = { ...inputs };

        // 1. Sort components by order to resolve dependencies
        const sortedComponents = [...this.components].sort((a, b) => a.order - b.order);

        const insuranceBreakdown: Record<string, number> = {};

        // 2. Process each component
        for (const comp of sortedComponents) {
            // Check if component is active
            if (!comp.isActive) continue;

            if (comp.method === 'FIXED') {
                // Already in inputs, or default to 0
                if (results[comp.code] === undefined) results[comp.code] = 0;
            }
            else if (comp.method === 'FORMULA' && comp.formula) {
                try {
                    results[comp.code] = this.evaluateFormula(comp.formula, results);
                } catch (error) {
                    // console.error(`Error calculating ${comp.code}:`, error);
                    results[comp.code] = 0;
                }
            }
            else if (comp.method === 'PERCENTAGE' && comp.type === 'INSURANCE') {
                // Calculate Insurance
                // Match insurance type (BHXH_EMP -> BHXH)
                const rate = this.insuranceRates.find(r => comp.code.startsWith(r.type));

                if (rate) {
                    const baseSalary = results['BASE_SALARY'] || 0;
                    // Apply Cap
                    const salaryForInsurance = rate.capBaseSalary ? Math.min(baseSalary, rate.capBaseSalary) : baseSalary;
                    const amount = Math.round(salaryForInsurance * (rate.employeeRate / 100)); // Round for currency
                    results[comp.code] = amount;
                    insuranceBreakdown[rate.type] = amount;
                }
            }
            else if (comp.code === 'PIT') {
                // Calculate Tax using specialized logic
                // Ensure TAXABLE_INCOME is available. If not, try to determine from settings?
                // Usually TAXABLE_INCOME is calculated via formula BEFORE this step.
                const taxableIncome = Math.max(0, results['TAXABLE_INCOME'] || 0);
                const tax = this.calculatePIT(taxableIncome);
                results[comp.code] = tax;
            }
        }

        return {
            components: results,
            grossIncome: results['GROSS_INCOME'] || 0,
            taxableIncome: results['TAXABLE_INCOME'] || 0,
            taxAmount: results['PIT'] || 0,
            netIncome: results['NET_INCOME'] || 0,
            breakdown: {
                insurance: insuranceBreakdown,
                tax: { PIT: results['PIT'] || 0 }
            }
        };
    }

    /**
     * Evaluate a simple formula string like "[A] + [B] * 2"
     * Using 'new Function' for slightly better sandbox than 'eval', but still needs validation.
     */
    private evaluateFormula(formula: string, context: Record<string, number>): number {
        let parsed = formula;

        // Replace [CODE] with value
        for (const key in context) {
            // Use word boundary to avoid partial replacements (e.g. [BASE] vs [BASE_SALARY]) if naming is bad
            // But with [brackets], it's safer.
            // Escape brackets for regex
            const regex = new RegExp(`\\[${key}\\]`, 'g');
            parsed = parsed.replace(regex, context[key].toString());
        }

        // Handle missing variables (replace [ANY] with 0)
        parsed = parsed.replace(/\[[A-Z_0-9]+\]/g, '0');

        // Allow only safe characters (digits, operators, parens, decimal point)
        if (!/^[0-9+\-*/().\s]*$/.test(parsed)) {
            return 0; // Safety fallback
        }

        try {
            // eslint-disable-next-line no-new-func
            return Math.round(new Function(`return ${parsed}`)());
        } catch (e) {
            return 0;
        }
    }

    /**
     * Calculate Personal Income Tax (Progressive)
     */
    private calculatePIT(taxableIncome: number): number {
        if (taxableIncome <= 0) return 0;

        // Find the applicable bracket for the total income
        // Logic: Progressive tax is calculated by summing tax of each chunk OR using "Fast Calculation":
        // Tax = (TaxableIncome * Rate) - SubtractAmount
        // This fast formula applies if we find the bracket containing the TaxableIncome.

        const sortedBrackets = [...this.taxBrackets].sort((a, b) => a.order - b.order);

        for (const bracket of sortedBrackets) {
            const max = bracket.maxIncome === undefined ? Infinity : bracket.maxIncome;
            if (taxableIncome > bracket.minIncome && taxableIncome <= max) {
                return Math.round((taxableIncome * bracket.taxRate / 100) - bracket.subtractAmount);
            }
        }

        return 0;
    }
}
