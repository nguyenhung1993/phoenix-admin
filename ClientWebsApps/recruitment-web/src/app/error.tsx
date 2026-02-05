'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-4">
            <div className="text-center space-y-6 max-w-md mx-auto">
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Đã xảy ra lỗi!</h1>
                    <p className="text-muted-foreground">
                        Hệ thống gặp sự cố khi xử lý yêu cầu của bạn.
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-4 bg-muted rounded-lg text-left text-xs font-mono overflow-auto max-h-48">
                            {error.message}
                        </div>
                    )}
                </div>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => reset()} variant="default">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Thử lại
                    </Button>
                    <Button onClick={() => window.location.href = '/admin'} variant="outline">
                        Về Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
