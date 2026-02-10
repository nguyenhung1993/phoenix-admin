'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NotificationDropdown } from '@/components/admin/layout/notification-dropdown';
import { NotificationProvider } from '@/lib/contexts/notification-context';
import {
    LayoutDashboard,
    User,
    Calendar,
    FileCheck,
    LogOut,
    Menu,
    Building,
    Settings,
    ChevronDown,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigation = [
    { name: 'Dashboard', href: '/portal', icon: LayoutDashboard },
    { name: 'Hồ sơ cá nhân', href: '/portal/profile', icon: User },
    { name: 'Bảng công & Lương', href: '/portal/timesheet', icon: Calendar },
    { name: 'Yêu cầu của tôi', href: '/portal/requests', icon: FileCheck },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const getInitials = (name: string | undefined | null) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    const UserNav = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 sm:px-4">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image || undefined} />
                        <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{session?.user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div>
                        <p>{session?.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/portal/profile">
                        <User className="mr-2 h-4 w-4" />
                        Hồ sơ cá nhân
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="ml-2">Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <NotificationProvider>
            <div className="min-h-screen bg-background flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b bg-background">
                    <div className="container flex h-16 items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                                    <nav className="flex flex-col gap-4 mt-8">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-2 text-lg font-medium ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                                                    }`}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                            <Link href="/portal" className="flex items-center gap-2 font-bold text-xl">
                                <Building className="h-6 w-6 text-primary" />
                                <span>Phoenix Portal</span>
                            </Link>

                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center gap-6 ml-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="flex items-center gap-2">
                            <NotificationDropdown />
                            <ThemeToggle />
                            <UserNav />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 container py-6 md:py-10">
                    {children}
                </main>
            </div>
        </NotificationProvider>
    );
}
