import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const exams = await prisma.exam.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const data = exams.map((exam) => ({
            id: exam.id,
            title: exam.title,
            durationMinutes: exam.durationMinutes,
            totalQuestions: exam.totalQuestions,
            passScore: exam.passScore,
            status: exam.status,
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('GET /api/exams error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
