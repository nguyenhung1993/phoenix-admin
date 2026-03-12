import { NextRequest, NextResponse } from 'next/server';
import { workflowEngine } from '@/lib/workflow-engine';

interface RouteContext {
    params: Promise<{ id: string }>;
}

// POST /api/approval-requests/[id]/approve
export async function POST(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { action, userId, userName, comment, reason } = body;

        if (!action || !userId || !userName) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc: action, userId, userName' },
                { status: 400 }
            );
        }

        let result;
        if (action === 'approve') {
            result = await workflowEngine.approveStep(id, userId, userName, comment);
        } else if (action === 'reject') {
            result = await workflowEngine.rejectStep(id, userId, userName, reason);
        } else {
            return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error processing approval:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
