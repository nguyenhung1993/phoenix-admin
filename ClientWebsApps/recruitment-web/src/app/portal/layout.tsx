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
    Wallet,
    GraduationCap,
    Target
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navGroups = [
    { name: 'Dashboard', href: '/portal', icon: LayoutDashboard },
    {
        name: 'Hồ sơ & Yêu cầu', icon: User, items: [
            { name: 'Hồ sơ cá nhân', href: '/portal/profile', icon: User },
            { name: 'Yêu cầu của tôi', href: '/portal/requests', icon: FileCheck },
        ]
    },
    {
        name: 'Công & Lương', icon: Wallet, items: [
            { name: 'Bảng công & Lương', href: '/portal/timesheet', icon: Calendar },
            { name: 'Phiếu lương', href: '/portal/payslips', icon: Wallet },
        ]
    },
    {
        name: 'Đào tạo & KPI', icon: Target, items: [
            { name: 'Đào tạo', href: '/portal/training', icon: GraduationCap },
            { name: 'Đánh giá KPI', href: '/portal/performance', icon: Target },
        ]
    }
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
                    <Link href="/">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Trang chủ
                    </Link>
                </DropdownMenuItem>
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
                                <SheetContent side="left" className="w-[240px] sm:w-[300px] overflow-y-auto">
                                    <nav className="flex flex-col gap-5 mt-6 pb-6">
                                        {navGroups.map((group) => (
                                            group.items ? (
                                                <div key={group.name} className="space-y-3">
                                                    <div className="font-semibold text-sm text-foreground flex items-center gap-2 pb-1 border-b">
                                                        <group.icon className="h-4 w-4" />
                                                        {group.name}
                                                    </div>
                                                    <div className="pl-4 flex flex-col gap-3">
                                                        {group.items.map(item => (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                onClick={() => setMobileMenuOpen(false)}
                                                                className={`flex items-center gap-2 text-sm font-medium ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`}
                                                            >
                                                                <item.icon className="h-4 w-4" />
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <Link
                                                    key={group.href}
                                                    href={group.href!}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex items-center gap-2 text-base font-semibold ${pathname === group.href ? 'text-primary' : 'text-foreground'}`}
                                                >
                                                    <group.icon className="h-5 w-5" />
                                                    {group.name}
                                                </Link>
                                            )
                                        ))}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                            <Link href="/portal" className="flex items-center gap-2 font-bold text-xl">
                                <Building className="h-6 w-6 text-primary" />
                                <span>Phoenix Portal</span>
                            </Link>

                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 ml-4 lg:ml-6">
                                {navGroups.map((group) => (
                                    group.items ? (
                                        <DropdownMenu key={group.name}>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className={`flex items-center gap-1.5 h-9 px-3 font-medium transition-colors ${group.items.some(i => i.href === pathname) ? 'text-primary bg-primary/10 hover:text-primary hover:bg-primary/15' : 'text-muted-foreground hover:text-foreground'}`}>
                                                    <group.icon className="h-4 w-4 shrink-0 hidden lg:inline-block" />
                                                    <span className="whitespace-nowrap">{group.name}</span>
                                                    <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-52">
                                                {group.items.map(item => (
                                                    <DropdownMenuItem key={item.href} asChild>
                                                        <Link href={item.href} className={`flex items-center gap-2 cursor-pointer w-full ${pathname === item.href ? 'text-primary font-medium bg-primary/5 focus:bg-primary/5 focus:text-primary' : 'text-foreground'}`}>
                                                            <item.icon className="h-4 w-4 opacity-70" />
                                                            {item.name}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <Button key={group.href} asChild variant="ghost" size="sm" className={`flex items-center gap-1.5 h-9 px-3 ${pathname === group.href ? 'text-primary bg-primary/10 hover:text-primary hover:bg-primary/15' : 'text-muted-foreground hover:text-foreground'}`}>
                                            <Link href={group.href!}>
                                                <group.icon className="h-4 w-4 shrink-0 hidden lg:inline-block" />
                                                <span className="whitespace-nowrap">{group.name}</span>
                                            </Link>
                                        </Button>
                                    )
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
