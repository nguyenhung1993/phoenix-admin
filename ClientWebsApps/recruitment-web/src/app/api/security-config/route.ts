import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        let config = await prisma.securityConfig.findFirst();
        if (!config) {
            config = await prisma.securityConfig.create({
                data: {
                    id: 'default',
                    passwordMinLength: 8,
                    requireSpecialChar: true,
                    requireNumber: true,
                    sessionTimeoutMinutes: 30,
                    mfaEnabled: false,
                    loginRetries: 5,
                },
            });
        }
        return NextResponse.json(config);
    } catch (error) {
        console.error('Error fetching security config:', error);
        return NextResponse.json({ error: 'Failed to fetch security config' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const config = await prisma.securityConfig.upsert({
            where: { id: 'default' },
            update: body,
            create: { id: 'default', ...body },
        });
        return NextResponse.json(config);
    } catch (error) {
        console.error('Error updating security config:', error);
        return NextResponse.json({ error: 'Failed to update security config' }, { status: 500 });
    }
}
