import { NextResponse } from 'next/server';
import { getHeadcountStats } from '@/lib/reports';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await getHeadcountStats();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching headcount report:', error);
        return NextResponse.json(
            { error: 'Failed to fetch report data' },
            { status: 500 }
        );
    }
}
