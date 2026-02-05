'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, LogOut, LayoutDashboard } from 'lucide-react';

export function UserNav() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        );
    }

    if (!session) {
        return (
            <Button variant="outline" size="sm" asChild>
                <Link href="/login">Đăng nhập</Link>
            </Button>
        );
    }

    const initials = session.user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'U';

    const isAdmin = session.user?.role === 'SUPER_ADMIN'
        || session.user?.role === 'HR_MANAGER'
        || session.user?.role === 'HR_STAFF'
        || session.user?.role === 'RECRUITER';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || 'User'} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {session.user?.name && (
                            <p className="font-medium">{session.user.name}</p>
                        )}
                        {session.user?.email && (
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                {session.user.email}
                            </p>
                        )}
                    </div>
                </div>
                {isAdmin && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Admin Panel
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings" className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                Cài đặt
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => signOut({ callbackUrl: '/' })}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

