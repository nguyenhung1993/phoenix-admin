'use client';

import { usePathname } from 'next/navigation';
import { MobileSidebar } from '@/components/layout/admin-sidebar';
import { UserNav } from '@/components/ui/user-nav';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Role } from '@/lib/rbac';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface AdminHeaderProps {
    role: Role;
}

export function AdminHeader({ role }: AdminHeaderProps) {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    // Filter out 'admin' from breadcrumbs if it's the root admin path, unless it's just /admin
    const breadcrumbs = paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const label = path.charAt(0).toUpperCase() + path.slice(1);
        const isLast = index === paths.length - 1;

        return { href, label, isLast };
    });

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <MobileSidebar role={role} />
            <div className="w-full flex-1">
                <nav className="flex items-center text-sm font-medium text-muted-foreground">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                            {index > 0 && <ChevronRight className="mx-2 h-4 w-4" />}
                            <span className={crumb.isLast ? 'text-foreground' : ''}>
                                {/* Map specific paths to friendly labels if needed */}
                                {crumb.label === 'Admin' ? 'Dashboard' : crumb.label}
                            </span>
                        </React.Fragment>
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserNav />
            </div>
        </header>
    );
}
