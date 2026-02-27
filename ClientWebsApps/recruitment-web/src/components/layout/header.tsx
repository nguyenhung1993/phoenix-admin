'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserNav } from '@/components/ui/user-nav';
import { Menu, Briefcase, Home, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/about', label: 'Về chúng tôi', icon: Info },
    { href: '/careers', label: 'Tuyển dụng', icon: Briefcase },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">Phoenix VN</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex items-center gap-2 pl-4 border-l">
                        <ThemeToggle />
                        <UserNav />
                    </div>
                    <Button asChild>
                        <Link href="/careers">Ứng tuyển ngay</Link>
                    </Button>
                </nav>

                {/* Mobile Navigation */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <UserNav />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] flex flex-col p-6">
                            <SheetHeader className="text-left border-b pb-4 mb-4">
                                <SheetTitle className="flex items-center gap-2 text-xl font-bold text-primary">
                                    <Briefcase className="h-6 w-6" />
                                    Phoenix VN
                                </SheetTitle>
                                <SheetDescription>
                                    Hệ thống tuyển dụng trực tuyến
                                </SheetDescription>
                            </SheetHeader>

                            <nav className="flex-1 flex flex-col gap-2">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href;

                                    return (
                                        <SheetClose key={link.href} asChild>
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-md transition-all hover:bg-muted group",
                                                    isActive ? "bg-primary/10 text-primary font-medium" : "text-foreground/80"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                                    {link.label}
                                                </div>
                                                <ChevronRight className={cn("h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-50 group-hover:translate-x-0", isActive && "opacity-100 translate-x-0")} />
                                            </Link>
                                        </SheetClose>
                                    );
                                })}
                            </nav>

                            <SheetFooter className="mt-auto border-t pt-4">
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="rounded-lg bg-muted p-4">
                                        <h4 className="font-semibold mb-1">Tìm kiếm cơ hội?</h4>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Khám phá các vị trí đang mở và gia nhập đội ngũ của chúng tôi.
                                        </p>
                                        <SheetClose asChild>
                                            <Button asChild className="w-full">
                                                <Link href="/careers">Xem vị trí tuyển dụng</Link>
                                            </Button>
                                        </SheetClose>
                                    </div>
                                    <p className="text-center text-xs text-muted-foreground">
                                        © 2024 Phoenix VN. All rights reserved.
                                    </p>
                                </div>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}


