'use client';

import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Loader2 } from 'lucide-react';

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanError?: (errorMessage: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Must wait for document to be ready
        if (typeof document === 'undefined') return;

        // Initialize scanner
        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scannerRef.current.render(
            (decodedText) => {
                // To avoid multiple scans firing rapidly, we pause scanning briefly or let the parent handle it
                scannerRef.current?.pause(true);
                onScanSuccess(decodedText);
                // Optionally resume after a delay if needed, 
                // but usually the parent closes the dialog so cleanup runs.
            },
            (error) => {
                if (onScanError) onScanError(error);
            }
        );

        // Cleanup
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, [onScanSuccess, onScanError]);

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[300px] relative rounded-md overflow-hidden bg-slate-50 border">
            <div id="reader" className="w-full max-w-sm border-none shadow-none"></div>
            <div className="absolute inset-0 flex items-center justify-center -z-10">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        </div>
    );
}
