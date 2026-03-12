'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Vui lòng nhập địa chỉ email');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Có lỗi xảy ra, vui lòng thử lại sau.');
                return;
            }

            setIsSubmitted(true);
            toast.success(data.message || 'Yêu cầu đặt lại mật khẩu đã được gửi!');
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu reset mật khẩu:', error);
            toast.error('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-4"
                        onClick={() => router.push('/login')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 mt-4">
                        <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-primary">Quên mật khẩu</CardTitle>
                    <CardDescription>
                        {isSubmitted
                            ? 'Kiểm tra email của bạn để lấy liên kết khôi phục'
                            : 'Nhập email của bạn để nhận liên kết đặt lại mật khẩu'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email đăng nhập</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="pr-10"
                                    />
                                    {email && (
                                        <button
                                            type="button"
                                            onClick={() => setEmail('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Gửi yêu cầu
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6 text-center py-4">
                            <p className="text-sm text-muted-foreground">
                                Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến <strong className="text-foreground">{email}</strong>. Vui lòng kiểm tra hộp thư đến thư rác của bạn.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push('/login')}
                            >
                                Quay lại trang đăng nhập
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
