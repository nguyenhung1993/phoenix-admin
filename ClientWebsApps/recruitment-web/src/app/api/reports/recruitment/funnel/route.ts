import { NextResponse } from 'next/server';
import { getRecruitmentFunnelStats } from '@/lib/reports';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await getRecruitmentFunnelStats();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching funnel report:', error);
        return NextResponse.json(
            { error: 'Failed to fetch report data' },
            { status: 500 }
        );
    }
}
