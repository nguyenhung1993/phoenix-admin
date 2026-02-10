
/**
 * Export data to Excel file
 */
export async function exportToExcel<T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    sheetName: string = 'Sheet1'
): Promise<void> {
    // Dynamic import
    const XLSX = await import('xlsx');

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
export async function exportToPDF(
    title: string,
    headers: string[],
    data: (string | number)[][],
    filename: string
): Promise<void> {
    // Dynamic import
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    // Create PDF document
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    // Add date
    doc.setFontSize(10);
    doc.text(`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, 14, 28);

    // Add table
    // @ts-ignore - autotable augmentation needs to be handled carefully with dynamic types
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
