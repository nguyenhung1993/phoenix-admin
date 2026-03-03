"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

interface UseOptimisticActionOptions<TData, TResult> {
    /** The async action to perform */
    action: (data: TData) => Promise<TResult>;
    /** Called immediately before the action — apply optimistic state here */
    onOptimistic?: (data: TData) => void;
    /** Called on success */
    onSuccess?: (result: TResult, data: TData) => void;
    /** Called on error — revert optimistic state here */
    onError?: (error: Error, data: TData) => void;
    /** Success toast message */
    successMessage?: string;
    /** Error toast message */
    errorMessage?: string;
}

export function useOptimisticAction<TData, TResult = unknown>(
    options: UseOptimisticActionOptions<TData, TResult>
) {
    const [isPending, setIsPending] = useState(false);
    const pendingRef = useRef(false);

    const execute = useCallback(
        async (data: TData) => {
            if (pendingRef.current) return;

            pendingRef.current = true;
            setIsPending(true);

            // Apply optimistic update immediately
            options.onOptimistic?.(data);

            try {
                const result = await options.action(data);
                options.onSuccess?.(result, data);
                if (options.successMessage) {
                    toast.success(options.successMessage);
                }
                return result;
            } catch (error) {
                const err = error instanceof Error ? error : new Error("Unknown error");
                options.onError?.(err, data);
                toast.error(options.errorMessage || "Đã xảy ra lỗi, vui lòng thử lại");
            } finally {
                pendingRef.current = false;
                setIsPending(false);
            }
        },
        [options]
    );

    return { execute, isPending };
}
