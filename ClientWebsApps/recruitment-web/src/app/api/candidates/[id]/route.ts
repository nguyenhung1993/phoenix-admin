import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/candidates/[id] - Get single candidate with relations
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const candidate = await prisma.candidate.findUnique({
            where: { id },
            include: {
                job: { select: { id: true, title: true, slug: true } },
                activities: { orderBy: { createdAt: 'desc' } },
                interviews: { orderBy: { scheduledAt: 'desc' } },
                offers: { orderBy: { createdAt: 'desc' } },
            },
        });

        if (!candidate) {
            return NextResponse.json({ error: 'Không tìm thấy ứng viên' }, { status: 404 });
        }

        return NextResponse.json(candidate);
    } catch (error) {
        console.error('Error fetching candidate:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/candidates/[id] - Update candidate (status, notes, rating, etc.)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const existing = await prisma.candidate.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Không tìm thấy ứng viên' }, { status: 404 });
        }

        // Build update data
        const updateData: Record<string, unknown> = {};
        if (body.status !== undefined) updateData.status = body.status;
        if (body.notes !== undefined) updateData.notes = body.notes;
        if (body.rating !== undefined) updateData.rating = body.rating ? parseInt(body.rating) : null;
        if (body.name !== undefined) updateData.name = body.name;
        if (body.email !== undefined) updateData.email = body.email;
        if (body.phone !== undefined) updateData.phone = body.phone;
        if (body.source !== undefined) updateData.source = body.source;
        if (body.cvUrl !== undefined) updateData.cvUrl = body.cvUrl;

        const updated = await prisma.candidate.update({
            where: { id },
            data: updateData,
            include: {
                job: { select: { id: true, title: true, slug: true } },
                activities: { orderBy: { createdAt: 'desc' } },
            },
        });

        // Auto-create activity log for status change
        if (body.status && body.status !== existing.status) {
            await prisma.candidateActivity.create({
                data: {
                    candidateId: id,
                    type: 'STATUS_CHANGE',
                    title: 'Thay đổi trạng thái',
                    content: `Trạng thái chuyển từ ${existing.status} sang ${body.status}`,
                    createdBy: body.updatedBy || 'Admin',
                },
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating candidate:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/candidates/[id] - Delete candidate  
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const existing = await prisma.candidate.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Không tìm thấy ứng viên' }, { status: 404 });
        }

        await prisma.candidate.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
