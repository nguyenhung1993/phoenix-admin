import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, cn } from '../utils';

describe('utils', () => {
    describe('formatCurrency', () => {
        it('nên format số tiền đúng định dạng VND (replace space variants for testing)', () => {
            const result = formatCurrency(1000000).replace(/\s/g, '').replace(/\u00a0/g, '');
            expect(result).toBe('1.000.000₫');
        });

        it('nên trả về "Thỏa thuận" khi input bằng 0 hoặc null', () => {
            expect(formatCurrency(0)).toBe('Thỏa thuận');
            expect(formatCurrency(null)).toBe('Thỏa thuận');
        });

        it('nên xử lý đúng số âm', () => {
            const result = formatCurrency(-500000).replace(/\s/g, '').replace(/\u00a0/g, '');
            expect(result).toBe('-500.000₫');
        });
    });

    describe('formatDate', () => {
        it('nên format ISO string thành DD/MM/YYYY', () => {
            const dateStr = '2026-03-05T00:00:00.000Z';
            // Intl date time can have variance dependent on timezone of node env, check contain string
            expect(formatDate(dateStr)).toContain('05/03/2026');
        });

        it('nên format Date object thành DD/MM/YYYY', () => {
            const dateObj = new Date('2026-03-05T00:00:00.000Z');
            expect(formatDate(dateObj)).toContain('05/03/2026');
        });
    });

    describe('cn (Tailwind Class Merge)', () => {
        it('nên gộp các class chính xác', () => {
            expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
        });

        it('nên handle tailwind override (vd: padding)', () => {
            expect(cn('p-4', 'p-8')).toBe('p-8');
        });

        it('nên bỏ qua các giá trị falsy', () => {
            expect(cn('flex', null, undefined, false && 'hidden', 'items-center')).toBe('flex items-center');
        });
    });
});
