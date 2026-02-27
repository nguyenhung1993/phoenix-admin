import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/jobs/[id] - Get single job
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                department: { select: { id: true, name: true, code: true } },
                _count: { select: { candidates: true, interviews: true, offers: true } },
            },
        });

        if (!job) {
            return NextResponse.json({ error: 'Không tìm thấy tin tuyển dụng' }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/jobs/[id] - Update job
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Check if job exists
        const existing = await prisma.job.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Không tìm thấy tin tuyển dụng' }, { status: 404 });
        }

        // Check slug uniqueness if changed
        if (body.slug && body.slug !== existing.slug) {
            const slugExists = await prisma.job.findUnique({ where: { slug: body.slug } });
            if (slugExists) {
                return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 });
            }
        }

        const updated = await prisma.job.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                departmentId: body.departmentId || null,
                location: body.location || null,
                type: body.type,
                experienceLevel: body.experienceLevel || null,
                educationLevel: body.educationLevel || null,
                specialization: body.specialization || [],
                deadline: body.deadline ? new Date(body.deadline) : null,
                salaryMin: body.salaryMin ? parseFloat(body.salaryMin) : null,
                salaryMax: body.salaryMax ? parseFloat(body.salaryMax) : null,
                status: body.status,
                description: body.description || null,
                requirements: body.requirements || [],
                benefits: body.benefits || [],
                workAddress: body.workAddress || null,
                workSchedule: body.workSchedule || null,
                applicationMethod: body.applicationMethod || null,
            },
            include: {
                department: { select: { id: true, name: true } },
            },
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error('Error updating job:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/jobs/[id] - Delete job
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const existing = await prisma.job.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Không tìm thấy tin tuyển dụng' }, { status: 404 });
        }

        await prisma.job.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting job:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
