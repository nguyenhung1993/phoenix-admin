"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Notification } from '@/lib/types/notification';
import { toast } from 'sonner';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    connectionStatus: ConnectionStatus;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Map DB notification to client format
    const mapNotification = (n: Record<string, unknown>): Notification => ({
        id: n.id as string,
        title: n.title as string,
        message: n.message as string,
        type: n.type as Notification['type'],
        priority: (n.priority as Notification['priority']) || 'MEDIUM',
        isRead: n.isRead as boolean,
        createdAt: n.createdAt as string,
        actionUrl: n.actionUrl as string | undefined,
        sender: n.senderName
            ? { name: n.senderName as string, avatar: n.senderAvatar as string | undefined }
            : undefined,
    });

    // Fallback: fetch notifications via REST API
    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch('/api/notifications');
            if (!res.ok) return;
            const data = await res.json();
            if (data.items) {
                setNotifications(data.items.map(mapNotification));
                setUnreadCount(data.unreadCount ?? 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, []);

    // Connect to SSE stream
    const connectSSE = useCallback(() => {
        // Close existing connection
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        setConnectionStatus('connecting');

        const eventSource = new EventSource('/api/notifications/stream');
        eventSourceRef.current = eventSource;

        eventSource.addEventListener('connected', (event) => {
            setConnectionStatus('connected');
            try {
                const data = JSON.parse(event.data);
                if (data.notifications) {
                    setNotifications(data.notifications.map(mapNotification));
                    setUnreadCount(data.unreadCount ?? 0);
                }
            } catch (error) {
                console.error('SSE connected event parse error:', error);
            }
        });

        eventSource.addEventListener('new-notifications', (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.notifications && data.notifications.length > 0) {
                    const newNotifs = data.notifications.map(mapNotification);

                    setNotifications(prev => {
                        const existingIds = new Set(prev.map(n => n.id));
                        const uniqueNew = newNotifs.filter((n: Notification) => !existingIds.has(n.id));
                        return [...uniqueNew, ...prev];
                    });

                    setUnreadCount(data.unreadCount ?? 0);

                    // Show toast for new notifications
                    newNotifs.forEach((n: Notification) => {
                        toast(n.title, {
                            description: n.message,
                            action: n.actionUrl
                                ? { label: 'Xem', onClick: () => window.location.assign(n.actionUrl!) }
                                : undefined,
                        });
                    });
                }
            } catch (error) {
                console.error('SSE new-notifications parse error:', error);
            }
        });

        eventSource.onerror = () => {
            setConnectionStatus('disconnected');
            eventSource.close();
            eventSourceRef.current = null;

            // Reconnect after 10 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
                connectSSE();
            }, 10000);
        };
    }, []);

    // Start fallback polling when SSE is disconnected
    useEffect(() => {
        if (connectionStatus === 'disconnected') {
            // Poll every 30 seconds as fallback
            pollingIntervalRef.current = setInterval(fetchNotifications, 30000);
            // Also fetch immediately
            fetchNotifications();
        } else {
            // Clear polling when SSE is active
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        }

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [connectionStatus, fetchNotifications]);

    // Initialize SSE on mount
    useEffect(() => {
        connectSSE();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [connectSSE]);

    // Mark single notification as read — persists to DB
    const markAsRead = useCallback(async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
            if (!res.ok) {
                // Revert on failure
                setNotifications(prev => prev.map(n =>
                    n.id === id ? { ...n, isRead: false } : n
                ));
                setUnreadCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    // Mark all as read — persists to DB
    const markAllAsRead = useCallback(async () => {
        const previousNotifications = notifications;
        const previousUnread = unreadCount;

        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success("Đã đánh dấu tất cả là đã đọc");

        try {
            const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' });
            if (!res.ok) {
                // Revert on failure
                setNotifications(previousNotifications);
                setUnreadCount(previousUnread);
                toast.error("Không thể đánh dấu đã đọc");
            }
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            setNotifications(previousNotifications);
            setUnreadCount(previousUnread);
        }
    }, [notifications, unreadCount]);

    // Add notification locally (for immediate UI feedback)
    const addNotification = useCallback((data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
        const newNotification: Notification = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            isRead: false
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        toast(data.title, {
            description: data.message,
            action: data.actionUrl
                ? { label: 'Xem', onClick: () => window.location.assign(data.actionUrl!) }
                : undefined,
        });
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => {
            const target = prev.find(n => n.id === id);
            if (target && !target.isRead) {
                setUnreadCount(c => Math.max(0, c - 1));
            }
            return prev.filter(n => n.id !== id);
        });
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            connectionStatus,
            markAsRead,
            markAllAsRead,
            addNotification,
            removeNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
