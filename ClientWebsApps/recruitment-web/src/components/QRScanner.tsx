'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Loader2, Camera, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanError?: (errorMessage: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [hasCameras, setHasCameras] = useState(true);
    const [permissionError, setPermissionError] = useState(false);

    const startScanner = async () => {
        try {
            setPermissionError(false);
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length) {
                const html5QrCode = new Html5Qrcode("reader", {
                    formatsToSupport: [
                        Html5QrcodeSupportedFormats.QR_CODE,
                        Html5QrcodeSupportedFormats.CODE_128,
                        Html5QrcodeSupportedFormats.CODE_39,
                        Html5QrcodeSupportedFormats.EAN_13,
                        Html5QrcodeSupportedFormats.EAN_8,
                        Html5QrcodeSupportedFormats.UPC_A,
                        Html5QrcodeSupportedFormats.UPC_E,
                    ],
                    experimentalFeatures: {
                        useBarCodeDetectorIfSupported: true
                    },
                    verbose: false
                });
                scannerRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        videoConstraints: {
                            facingMode: "environment",
                        }
                    },
                    (decodedText) => {
                        html5QrCode.pause();
                        setIsScanning(false);
                        onScanSuccess(decodedText);
                    },
                    (error) => {
                        if (onScanError) onScanError(error);
                    }
                );
                setIsScanning(true);
            } else {
                setHasCameras(false);
            }
        } catch (err) {
            console.error(err);
            setPermissionError(true);
            setHasCameras(false);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                setIsScanning(false);
            } catch (err) {
                console.error("Failed to stop scanner", err);
            }
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center w-full min-h-[350px] space-y-4">
            <style jsx global>{`
                #reader video {
                    object-fit: cover !important;
                    width: 100% !important;
                    height: 100% !important;
                }
            `}</style>
            <div className="relative w-full max-w-sm aspect-square bg-slate-100 border-2 border-dashed rounded-lg overflow-hidden flex flex-col items-center justify-center">
                <div id="reader" className="w-full h-full absolute inset-0 z-10 overscroll-none touch-none"></div>

                {!isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-100">
                        {permissionError ? (
                            <div className="text-center p-4">
                                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                                <p className="text-sm font-medium text-destructive">Không thể truy cập camera</p>
                                <p className="text-xs text-muted-foreground mt-1">Vui lòng cấp quyền sử dụng camera trong cài đặt trình duyệt của bạn.</p>
                            </div>
                        ) : !hasCameras ? (
                            <div className="text-center p-4">
                                <XCircle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                                <p className="text-sm font-medium">Không tìm thấy camera</p>
                                <p className="text-xs text-muted-foreground mt-1">Thiết bị của bạn có vẻ không có camera hoặc đang bị ứng dụng khác sử dụng.</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">Nhấn nút bên dưới để bắt đầu quét</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex gap-2 w-full max-w-sm">
                {!isScanning ? (
                    <Button onClick={startScanner} className="w-full flex-1">
                        <Camera className="mr-2 w-4 h-4" /> Bật Camera & Quét
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={stopScanner} className="w-full flex-1">
                        <XCircle className="mr-2 w-4 h-4" /> Dừng quét
                    </Button>
                )}
            </div>
            <p className="text-xs text-center text-muted-foreground max-w-sm">
                * Lưu ý: Hãy đảm bảo bạn đã cấp quyền sử dụng Camera cho trình duyệt (Đặc biệt trên iOS/Safari).
            </p>
        </div>
    );
}
