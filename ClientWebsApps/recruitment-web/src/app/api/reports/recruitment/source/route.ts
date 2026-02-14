import { NextResponse } from 'next/server';
import { getRecruitmentSourceStats } from '@/lib/reports';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await getRecruitmentSourceStats();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching source report:', error);
        return NextResponse.json(
            { error: 'Failed to fetch report data' },
            { status: 500 }
        );
    }
}
