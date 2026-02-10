"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, NotificationType, NotificationPriority } from '@/lib/types/notification';
import { mockNotifications } from '@/lib/mocks/notifications';
import { toast } from 'sonner';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Load mock data on mount
        setNotifications(mockNotifications);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("Đã đánh dấu tất cả là đã đọc");
    };

    const addNotification = (data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
        const newNotification: Notification = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            isRead: false
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Show toast for new notification
        toast(data.title, {
            description: data.message,
            action: {
                label: 'Xem',
                onClick: () => { }
            },
        });
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
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
