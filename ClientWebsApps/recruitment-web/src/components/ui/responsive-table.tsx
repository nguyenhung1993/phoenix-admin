'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

interface Column<T> {
    key: string;
    label: string;
    className?: string;
    render?: (item: T) => React.ReactNode;
}

interface ResponsiveTableProps<T> {
    data: T[];
    columns: Column<T>[];
    mobileCardRender?: (item: T, index: number) => React.ReactNode;
    emptyMessage?: string;
}

/**
 * ResponsiveTable — table on desktop, card list on mobile
 * Auto-switches at 768px breakpoint
 */
export function ResponsiveTable<T extends Record<string, any>>({
    data,
    columns,
    mobileCardRender,
    emptyMessage = 'Không có dữ liệu',
}: ResponsiveTableProps<T>) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                {emptyMessage}
            </div>
        );
    }

    // Mobile: card layout
    if (isMobile) {
        if (mobileCardRender) {
            return <div className="space-y-3">{data.map((item, i) => mobileCardRender(item, i))}</div>;
        }

        return (
            <div className="space-y-3">
                {data.map((item, index) => (
                    <Card key={index}>
                        <CardContent className="pt-4 pb-4 space-y-2">
                            {columns.map((col) => (
                                <div key={col.key} className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium">{col.label}</span>
                                    <span className="text-right">
                                        {col.render ? col.render(item) : String(item[col.key] ?? '')}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Desktop: table layout
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((col) => (
                        <TableHead key={col.key} className={col.className}>
                            {col.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        {columns.map((col) => (
                            <TableCell key={col.key} className={col.className}>
                                {col.render ? col.render(item) : String(item[col.key] ?? '')}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
