import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/onboarding - List onboarding records
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const where: Record<string, unknown> = {};
        if (status) where.status = status;
        if (search) {
            where.employeeName = { contains: search, mode: 'insensitive' };
        }

        const onboardings = await prisma.onboarding.findMany({
            where,
            include: {
                tasks: true,
                candidate: { select: { id: true, name: true, email: true } },
            },
            orderBy: { startDate: 'asc' },
        });

        return NextResponse.json({ data: onboardings });
    } catch (error) {
        console.error('GET /api/onboarding error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/onboarding - Create new onboarding process
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { candidateId, buddyName, startDate } = body;

        if (!candidateId || !startDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
            include: { job: true },
        });

        if (!candidate) {
            return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
        }

        const departmentName = candidate.job?.departmentId
            ? (await prisma.department.findUnique({ where: { id: candidate.job.departmentId } }))?.name
            : 'Engineering'; // Fallback

        const onboarding = await prisma.onboarding.create({
            data: {
                candidateId,
                employeeName: candidate.name,
                employeeEmail: candidate.email,
                jobTitle: candidate.job?.title || 'N/A',
                department: departmentName || 'N/A',
                startDate: new Date(startDate),
                buddyName: buddyName || null,
                status: 'NOT_STARTED',
                tasks: {
                    create: [
                        { title: 'Nộp CMND/CCCD', description: 'Bản photo công chứng', category: 'DOCUMENTS', isRequired: true, dueDay: 1 },
                        { title: 'Nộp sổ hộ khẩu', description: 'Bản photo', category: 'DOCUMENTS', isRequired: true, dueDay: 1 },
                        { title: 'Ảnh 3x4', description: '4 tấm nền trắng', category: 'DOCUMENTS', isRequired: true, dueDay: 1 },
                        { title: 'Cấp laptop', description: 'Liên hệ IT', category: 'IT_SETUP', isRequired: true, dueDay: 1, assignedTo: 'IT' },
                        { title: 'Tạo email công ty', description: '@phoenix.com.vn', category: 'IT_SETUP', isRequired: true, dueDay: 1, assignedTo: 'IT' },
                        { title: 'Hướng dẫn quy trình', description: 'HR giới thiệu', category: 'TRAINING', isRequired: true, dueDay: 2, assignedTo: 'HR' },
                        { title: 'Tour văn phòng', description: 'Giới thiệu các phòng ban', category: 'INTRODUCTION', isRequired: true, dueDay: 1 },
                        { title: 'Ký hợp đồng', description: 'HĐLĐ thử việc', category: 'ADMIN', isRequired: true, dueDay: 1 },
                    ]
                }
            },
            include: { tasks: true },
        });

        return NextResponse.json(onboarding, { status: 201 });
    } catch (error) {
        console.error('POST /api/onboarding error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
