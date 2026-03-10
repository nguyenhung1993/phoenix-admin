import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const INITIAL_COMPANIES = [
    { code: 'HL', name: 'Hải Long' },
    { code: 'PH', name: 'Phượng Hoàng' },
    { code: 'TS', name: 'Thiên Sơn' },
    { code: 'ST', name: 'Sơn Thành' },
];

export async function POST() {
    try {
        const results = [];
        for (const company of INITIAL_COMPANIES) {
            const existing = await prisma.company.findUnique({
                where: { code: company.code }
            });

            if (!existing) {
                const created = await prisma.company.create({
                    data: company
                });
                results.push(created);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Đã khởi tạo các pháp nhân cơ bản',
            data: results
        });
    } catch (error) {
        console.error('Lỗi khởi tạo pháp nhân:', error);
        return NextResponse.json({ success: false, error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const companies = await prisma.company.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json({
            success: true,
            data: companies
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Đã xảy ra lỗi' }, { status: 500 });
    }
}
