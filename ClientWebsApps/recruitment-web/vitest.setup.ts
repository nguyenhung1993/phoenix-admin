import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup sau mỗi test
afterEach(() => {
    cleanup();
});

// Mock Next.js navigation nếu cần
vi.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
        };
    },
    usePathname() {
        return '';
    },
    useSearchParams() {
        return new URLSearchParams();
    },
    useParams() {
        return {};
    }
}));
