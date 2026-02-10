'use client';

import { usePathname } from 'next/navigation';
import { Header, Footer } from "@/components/layout";
import { PublicShell } from "@/components/layout/public-shell";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicPage = !pathname.startsWith('/portal') && !pathname.startsWith('/admin');

    if (isPublicPage) {
        return (
            <PublicShell
                header={<Header />}
                footer={<Footer />}
            >
                {children}
            </PublicShell>
        );
    }

    return <>{children}</>;
}
