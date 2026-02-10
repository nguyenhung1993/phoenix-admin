'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getNavigationForRole, Role, roleLabels } from '@/lib/rbac';
import { NotificationProvider } from '@/lib/contexts/notification-context';
import { NotificationDropdown } from '@/components/admin/layout/notification-dropdown';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Calendar,
    FileCheck,
    UserPlus,
    User,
    Building,
    Award,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Globe,
    Clock,
    CalendarOff,
    Timer,
    GraduationCap,
    Shield,
    FolderOpen,
    History,
    FileQuestion,
    PlayCircle,
    Target,
    ClipboardList,
    BarChart3,
    PanelLeftClose,
    PanelLeft,
    Monitor,
    BadgePercent,
    Calculator,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Briefcase,
    Users,
    Calendar,
    FileCheck,
    UserPlus,
    User,
    Building,
    Award,
    FileText,
    Settings,
    Clock,
    CalendarOff,
    Timer,
    GraduationCap,
    Shield,
    FolderOpen,
    History,
    FileQuestion,
    PlayCircle,
    Target,
    ClipboardList,
    BarChart3,
    Monitor,
    BadgePercent,
    Calculator,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Get user role with fallback
    const userRole: Role = (session?.user?.role as Role) || 'EMPLOYEE';
    const roleInfo = roleLabels[userRole];

    // Get navigation based on user role
    const navigation = getNavigationForRole(userRole);

    // Track which menu groups are expanded
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
        // Auto-expand the group that contains the current active page
        const expanded: Record<string, boolean> = {};
        navigation.forEach(group => {
            const hasActiveItem = group.items.some(item =>
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            );
            expanded[group.title] = hasActiveItem;
        });
        return expanded;
    });

    const toggleGroup = (title: string) => {
        setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
    };

    // Ref for nav container to scroll active item into view
    const navRef = useRef<HTMLElement>(null);

    // Auto-scroll to active menu item on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            if (navRef.current) {
                const activeItem = navRef.current.querySelector('[data-active="true"]');
                if (activeItem) {
                    activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [pathname]);

    const getInitials = (name: string | undefined | null) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    const NavLink = ({ href, label, iconName, collapsed = false, matchExact = false }: { href: string; label: string; iconName: string; collapsed?: boolean; matchExact?: boolean }) => {
        const isActive = matchExact
            ? pathname === href
            : pathname === href || (href !== '/admin' && pathname.startsWith(href));
        const Icon = iconMap[iconName] || LayoutDashboard;

        const linkContent = (
            <Link
                href={href}
                data-active={isActive}
                className={`flex items-center rounded-lg py-2 transition-all duration-300 ${collapsed
                    ? (isActive
                        ? 'bg-primary text-primary-foreground justify-center w-10 h-10 mx-auto'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground justify-center w-10 h-10 mx-auto')
                    : (isActive
                        ? 'text-primary font-medium gap-3 px-3'
                        : 'text-muted-foreground hover:text-foreground gap-3 px-3')
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
            </Link>
        );

        if (collapsed) {
            return (
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        {linkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                        {label}
                    </TooltipContent>
                </Tooltip>
            );
        }

        return linkContent;
    };

    const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
        <div className="flex h-full flex-col">
            <div className={`flex h-14 items-center border-b transition-all duration-300 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
                <Link href="/admin" className={`flex items-center font-semibold ${collapsed ? '' : 'gap-2'}`}>
                    <Building className="h-6 w-6 shrink-0" />
                    {!collapsed && <span>HRM Admin</span>}
                </Link>
            </div>
            <nav ref={navRef} className={`flex-1 overflow-y-auto overflow-x-hidden py-4 transition-all duration-300 ${collapsed ? 'scrollbar-none px-0' : 'scrollbar-thin px-2'}`}>
                {navigation.map((group) => {
                    const isExpanded = expandedGroups[group.title] ?? false;
                    const hasActiveItem = group.items.some(item => {
                        if (item.matchExact) {
                            return pathname === item.href;
                        }
                        return pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    });

                    if (collapsed) {
                        // Collapsed mode: show only icons for each item
                        return (
                            <div key={group.title} className="mb-2 space-y-1">
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        iconName={item.icon}
                                        collapsed={collapsed}
                                        matchExact={item.matchExact}
                                    />
                                ))}
                            </div>
                        );
                    }

                    return (
                        <div key={group.title} className="mb-2">
                            <button
                                onClick={() => toggleGroup(group.title)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${hasActiveItem
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    {group.title}
                                </span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''
                                    }`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="space-y-1">
                                    {group.items.map((item) => (
                                        <NavLink
                                            key={item.href}
                                            href={item.href}
                                            label={item.label}
                                            iconName={item.icon}
                                            collapsed={collapsed}
                                            matchExact={item.matchExact}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Toggle Button - aligned left */}
            <div className="border-t p-2 flex items-center justify-end">
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        >
                            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        {collapsed ? 'Mở rộng sidebar' : 'Thu nhỏ sidebar'}
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );

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
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${roleInfo.color}`}>
                            {roleInfo.label}
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Cài đặt
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/portal">
                        <User className="mr-2 h-4 w-4" />
                        Portal Nhân viên
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
            <TooltipProvider>
                <div className="flex min-h-screen bg-background">
                    {/* Desktop Sidebar */}
                    <aside className={`hidden md:flex md:flex-col border-r sticky top-0 h-screen overflow-hidden shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'}`}>
                        <SidebarContent collapsed={sidebarCollapsed} />
                    </aside>

                    {/* Mobile Header & Content */}
                    <div className="flex flex-1 flex-col">
                        {/* Mobile Header */}
                        <header className="flex h-14 items-center justify-between border-b px-4 md:hidden sticky top-0 bg-background z-50">
                            <div className="flex items-center gap-2">
                                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="-ml-2">
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="p-0 w-64">
                                        <div className="sr-only">
                                            <SheetTitle>Menu điều hướng</SheetTitle>
                                            <SheetDescription>Danh sách các chức năng quản trị</SheetDescription>
                                        </div>
                                        <SidebarContent />
                                    </SheetContent>
                                </Sheet>
                                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                                    <Building className="h-5 w-5" />
                                    <span>HRM</span>
                                </Link>
                            </div>
                            <div className="flex items-start gap-2">
                                <NotificationDropdown />
                                <UserNav />
                            </div>
                        </header>

                        {/* Desktop Header */}
                        <header className="hidden md:flex h-14 items-center justify-end border-b px-6 sticky top-0 bg-background z-50 gap-2">
                            <Button variant="ghost" size="icon" asChild title="Trang chủ tuyển dụng">
                                <Link href="/" target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-5 w-5" />
                                </Link>
                            </Button>

                            <NotificationDropdown />
                            <ThemeToggle />

                            <UserNav />
                        </header>

                        {/* Main Content */}
                        <main className="flex-1 p-6 min-w-0">
                            {children}
                        </main>
                    </div>
                </div >
            </TooltipProvider >
        </NotificationProvider>
    );
}
