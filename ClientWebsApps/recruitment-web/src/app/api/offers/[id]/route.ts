import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { getOfferEmailTemplate } from '@/lib/templates';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// GET /api/offers/:id
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const offer = await prisma.offer.findUnique({
            where: { id },
            include: {
                candidate: { select: { id: true, name: true, email: true, phone: true } },
                job: { select: { id: true, title: true } },
            },
        });

        if (!offer) {
            return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
        }

        return NextResponse.json(offer);
    } catch (error) {
        console.error('GET /api/offers/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/offers/:id
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const updateData: Record<string, unknown> = {};

        if (body.status) updateData.status = body.status;
        if (body.salaryBase !== undefined) updateData.salaryBase = body.salaryBase;
        if (body.salaryBonus !== undefined) updateData.salaryBonus = body.salaryBonus;
        if (body.salaryAllowance !== undefined) updateData.salaryAllowance = body.salaryAllowance;
        if (body.startDate) updateData.startDate = new Date(body.startDate);
        if (body.expiryDate) updateData.expiryDate = new Date(body.expiryDate);
        if (body.benefits !== undefined) updateData.benefits = body.benefits;
        if (body.notes !== undefined) updateData.notes = body.notes;

        // Handle status transitions
        if (body.status === 'SENT') {
            updateData.sentAt = new Date();
        }
        if (body.status === 'ACCEPTED' || body.status === 'REJECTED') {
            updateData.respondedAt = new Date();
        }

        const offer = await prisma.offer.update({
            where: { id },
            data: updateData,
            include: {
                candidate: { select: { id: true, name: true, email: true } },
                job: { select: { id: true, title: true } },
            },
        });

        // Send Offer Email if status is SENT
        if (body.status === 'SENT' && offer.candidate.email) {
            const formattedDate = format(new Date(offer.startDate), 'dd/MM/yyyy', { locale: vi });
            // Format currency
            const formattedSalary = new Intl.NumberFormat('vi-VN').format(offer.salaryBase);

            const emailHtml = getOfferEmailTemplate(
                offer.candidate.name,
                offer.job.title,
                formattedSalary,
                formattedDate
            );

            // Non-blocking email sending
            sendEmail(offer.candidate.email, `Thư mời nhận việc - ${offer.job.title}`, emailHtml)
                .catch(err => console.error('Failed to send offer email:', err));
        }

        // Update candidate status when offer is accepted
        if (body.status === 'ACCEPTED') {
            await prisma.candidate.update({
                where: { id: offer.candidateId },
                data: { status: 'HIRED' },
            });
        }

        return NextResponse.json(offer);
    } catch (error) {
        console.error('PATCH /api/offers/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/offers/:id
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.offer.delete({ where: { id } });

        return NextResponse.json({ message: 'Offer deleted' });
    } catch (error) {
        console.error('DELETE /api/offers/[id] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
