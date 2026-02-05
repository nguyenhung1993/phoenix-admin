'use client';

import { usePathname } from 'next/navigation';

export function PublicShell({
    children,
    header,
    footer
}: {
    children: React.ReactNode;
    header: React.ReactNode;
    footer: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            {header}
            <main className="flex-1">{children}</main>
            {footer}
        </>
    );
}
