import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                        <ShieldX className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Không có quyền truy cập</CardTitle>
                    <CardDescription>
                        Bạn không có quyền truy cập trang quản trị. Vui lòng liên hệ admin nếu bạn cần quyền truy cập.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Button asChild>
                            <Link href="/">Về trang chủ</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/careers">Xem vị trí tuyển dụng</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
