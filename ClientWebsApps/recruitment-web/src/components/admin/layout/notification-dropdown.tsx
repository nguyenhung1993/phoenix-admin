"use client";

import { useState } from 'react';
import { useNotifications } from '@/lib/contexts/notification-context';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, Check, Clock, Calendar, AlertTriangle, Info, Mail } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [open, setOpen] = useState(false);

    const getIcon = (type: string) => {
        switch (type) {
            case 'LEAVE_REQUEST': return <Calendar className="h-4 w-4 text-orange-500" />;
            case 'OVERTIME_REQUEST': return <Clock className="h-4 w-4 text-purple-500" />;
            case 'CONTRACT_EXPIRY': return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case 'SYSTEM_ALERT': return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case 'BIRTHDAY': return <span className="text-lg">🎂</span>;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background ring-0" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96">
                <DropdownMenuLabel className="flex items-center justify-between py-3">
                    <span className="font-bold">Thông báo ({unreadCount})</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 text-xs text-primary"
                            onClick={markAllAsRead}
                        >
                            Đánh dấu đã đọc
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Không có thông báo mới</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        "flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-accent/50",
                                        !notification.isRead && "bg-accent/20 border-l-2 border-primary"
                                    )}
                                    onClick={() => {
                                        markAsRead(notification.id);
                                        // If there is an action URL, we could navigate differently, 
                                        // but Link component inside isn't ideal for DropdownMenuItem interaction.
                                        // For now, onClick just marks as read.
                                    }}
                                >
                                    <div className="flex items-start gap-3 w-full">
                                        <div className={cn(
                                            "mt-1 p-2 rounded-full shrink-0",
                                            "bg-muted"
                                        )}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className={cn("text-sm font-medium leading-none", !notification.isRead && "text-primary")}>
                                                    {notification.title}
                                                </p>
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                    {formatTime(notification.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            {notification.actionUrl && (
                                                <Link
                                                    href={notification.actionUrl}
                                                    className="inline-flex items-center text-xs font-medium text-primary hover:underline mt-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent Dropdown close immediately if needed, or let it close
                                                        markAsRead(notification.id);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    Xem chi tiết
                                                </Link>
                                            )}
                                        </div>
                                        {!notification.isRead && (
                                            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-center cursor-pointer text-xs text-muted-foreground py-3">
                    Xem tất cả thông báo
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
