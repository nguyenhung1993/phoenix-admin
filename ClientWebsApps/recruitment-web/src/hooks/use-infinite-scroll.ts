"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface UseInfiniteScrollOptions {
    /** Async function to load more items */
    loadMore: () => Promise<void>;
    /** Whether there are more items to load */
    hasMore: boolean;
    /** Whether currently loading */
    isLoading: boolean;
    /** Root margin for IntersectionObserver (default: 200px — start loading before user reaches bottom) */
    rootMargin?: string;
    /** Threshold for IntersectionObserver */
    threshold?: number;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
    const { loadMore, hasMore, isLoading, rootMargin = "200px", threshold = 0.1 } = options;
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const handleIntersection = useCallback(
        async (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMore && !isLoading && !isFetching) {
                setIsFetching(true);
                try {
                    await loadMore();
                } finally {
                    setIsFetching(false);
                }
            }
        },
        [hasMore, isLoading, isFetching, loadMore]
    );

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(handleIntersection, {
            rootMargin,
            threshold,
        });

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [handleIntersection, rootMargin, threshold]);

    return { sentinelRef, isFetching };
}
