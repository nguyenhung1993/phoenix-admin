import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const page = parseInt(searchParams.get('page') || '1');
        const action = searchParams.get('action');
        const userId = searchParams.get('userId');
        const target = searchParams.get('target');
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const search = searchParams.get('q');

        const skip = (page - 1) * limit;

        // Build where clause
        const where: Record<string, unknown> = {};

        if (action) {
            where.action = { contains: action, mode: 'insensitive' };
        }
        if (userId) {
            where.userId = userId;
        }
        if (target) {
            where.target = { contains: target, mode: 'insensitive' };
        }
        if (search) {
            where.OR = [
                { action: { contains: search, mode: 'insensitive' } },
                { target: { contains: search, mode: 'insensitive' } },
                { userName: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (from || to) {
            where.createdAt = {};
            if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
            if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
        }

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true, image: true },
                    },
                },
            }),
            prisma.auditLog.count({ where }),
        ]);

        return NextResponse.json({
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }
}
