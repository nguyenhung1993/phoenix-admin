'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icon } from '@/components/ui/icon';
import { getNavigationForRole, Role } from '@/lib/rbac';
import { Menu } from 'lucide-react';

interface SidebarProps {
    role: Role;
    isMobile?: boolean;
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const navGroups = getNavigationForRole(role);

    return (
        <div className="relative flex-col bg-muted/20 pb-12 lg:flex h-full border-r">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Icon name="Briefcase" className="h-6 w-6 text-primary" />
                    <span className="hidden lg:inline-block">Phoenix HRM</span>
                </Link>
            </div>
            <ScrollArea className="flex-1 py-4">
                <nav className="grid items-start gap-4 px-2 lg:px-4">
                    {navGroups.map((group, index) => (
                        <div key={index} className="py-2">
                            <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {group.title}
                            </h4>
                            <div className="grid gap-1">
                                {group.items.map((item, itemIndex) => {
                                    const isActive = item.matchExact
                                        ? pathname === item.href
                                        : pathname.startsWith(item.href);

                                    return (
                                        <Button
                                            key={itemIndex}
                                            variant={isActive ? 'secondary' : 'ghost'}
                                            className={cn(
                                                'w-full justify-start gap-2',
                                                isActive && 'font-medium'
                                            )}
                                            asChild
                                        >
                                            <Link href={item.href}>
                                                <Icon name={item.icon} className="h-4 w-4" />
                                                {item.label}
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </ScrollArea>
        </div>
    );
}

export function MobileSidebar({ role }: SidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-64">
                <Sidebar role={role} />
            </SheetContent>
        </Sheet>
    );
}
