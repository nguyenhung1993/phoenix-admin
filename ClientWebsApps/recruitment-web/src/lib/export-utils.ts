import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type for autotable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: {
            head?: string[][];
            body?: (string | number)[][];
            startY?: number;
            styles?: Record<string, unknown>;
            headStyles?: Record<string, unknown>;
            theme?: string;
        }) => jsPDF;
    }
}

/**
 * Export data to Excel file
 */
export function exportToExcel<T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    sheetName: string = 'Sheet1'
): void {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate and download the file
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Export data to PDF file with a table
 */
export function exportToPDF(
    title: string,
    headers: string[],
    data: (string | number)[][],
    filename: string
): void {
    // Create PDF document
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    // Add date
    doc.setFontSize(10);
    doc.text(`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, 14, 28);

    // Add table
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 35,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] },
        theme: 'grid',
    });

    // Save the PDF
    doc.save(`${filename}.pdf`);
}

/**
 * Format currency for export
 */
export function formatCurrencyForExport(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
}
