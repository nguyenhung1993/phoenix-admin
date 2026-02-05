import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-4">
            <div className="text-center space-y-6 max-w-md mx-auto">
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                        <FileQuestion className="h-12 w-12 text-muted-foreground" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">404</h1>
                    <h2 className="text-2xl font-semibold">Trang không tìm thấy</h2>
                    <p className="text-muted-foreground">
                        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                    </p>
                </div>
                <div className="flex justify-center gap-4">
                    <Button asChild variant="default">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Trang chủ
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin">
                            HRM Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
