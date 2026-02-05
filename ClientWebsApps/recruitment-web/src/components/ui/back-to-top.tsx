'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) return null;

    return (
        <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Back to top"
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    );
}
