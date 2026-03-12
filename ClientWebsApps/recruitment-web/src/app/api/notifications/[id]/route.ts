import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) {
            return NextResponse.json({ error: 'Không tìm thấy thông báo' }, { status: 404 });
        }

        if (notification.userId !== session.user.id) {
            return NextResponse.json({ error: 'Bị từ chối truy cập' }, { status: 403 });
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json(
            { error: 'Lỗi cập nhật notification' },
            { status: 500 }
        );
    }
}
