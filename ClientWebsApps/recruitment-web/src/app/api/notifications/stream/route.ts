import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// SSE endpoint for real-time notifications
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const encoder = new TextEncoder();
    let closed = false;

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: string, data: unknown) => {
                if (closed) return;
                try {
                    controller.enqueue(
                        encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
                    );
                } catch {
                    closed = true;
                }
            };

            // Send initial data
            try {
                const [notifications, unreadCount] = await Promise.all([
                    prisma.notification.findMany({
                        where: { userId },
                        orderBy: { createdAt: 'desc' },
                        take: 50,
                    }),
                    prisma.notification.count({
                        where: { userId, isRead: false },
                    }),
                ]);

                send('connected', { notifications, unreadCount });
            } catch (error) {
                console.error('SSE initial fetch error:', error);
                send('error', { message: 'Failed to fetch notifications' });
            }

            // Poll for new notifications every 5 seconds
            let lastCheck = new Date();
            const interval = setInterval(async () => {
                if (closed) {
                    clearInterval(interval);
                    return;
                }

                try {
                    const newNotifications = await prisma.notification.findMany({
                        where: {
                            userId,
                            createdAt: { gt: lastCheck },
                        },
                        orderBy: { createdAt: 'desc' },
                    });

                    if (newNotifications.length > 0) {
                        const unreadCount = await prisma.notification.count({
                            where: { userId, isRead: false },
                        });

                        send('new-notifications', {
                            notifications: newNotifications,
                            unreadCount,
                        });

                        lastCheck = new Date();
                    }
                } catch (error) {
                    console.error('SSE poll error:', error);
                }
            }, 5000);

            // Keep-alive ping every 30 seconds
            const pingInterval = setInterval(() => {
                if (closed) {
                    clearInterval(pingInterval);
                    return;
                }
                try {
                    controller.enqueue(encoder.encode(': ping\n\n'));
                } catch {
                    closed = true;
                    clearInterval(pingInterval);
                    clearInterval(interval);
                }
            }, 30000);
        },

        cancel() {
            closed = true;
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
