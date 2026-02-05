'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save } from 'lucide-react';

export default function AdminSettingsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [settings, setSettings] = useState({
        companyName: 'Li-Ning Vietnam',
        companyEmail: 'hr@lining.vn',
        companyPhone: '028 1234 5678',
        companyAddress: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        linkedinUrl: 'https://linkedin.com/company/lining-vietnam',
        facebookUrl: 'https://facebook.com/liningvietnam',
        footerText: '© 2024 Li-Ning Vietnam. All rights reserved.',
        emailSignature: 'Trân trọng,\nPhòng Nhân sự\nLi-Ning Vietnam',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        alert('Đã lưu cài đặt thành công!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Cài đặt</h1>
                <p className="text-muted-foreground">Quản lý thông tin công ty và cấu hình hệ thống</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin công ty</CardTitle>
                        <CardDescription>Thông tin hiển thị trên website</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Tên công ty</Label>
                                <Input
                                    id="companyName"
                                    value={settings.companyName}
                                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyEmail">Email liên hệ</Label>
                                <Input
                                    id="companyEmail"
                                    type="email"
                                    value={settings.companyEmail}
                                    onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyPhone">Số điện thoại</Label>
                                <Input
                                    id="companyPhone"
                                    value={settings.companyPhone}
                                    onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyAddress">Địa chỉ</Label>
                                <Input
                                    id="companyAddress"
                                    value={settings.companyAddress}
                                    onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mạng xã hội</CardTitle>
                        <CardDescription>Liên kết đến các trang mạng xã hội</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="linkedinUrl">LinkedIn</Label>
                                <Input
                                    id="linkedinUrl"
                                    placeholder="https://linkedin.com/company/..."
                                    value={settings.linkedinUrl}
                                    onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="facebookUrl">Facebook</Label>
                                <Input
                                    id="facebookUrl"
                                    placeholder="https://facebook.com/..."
                                    value={settings.facebookUrl}
                                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cấu hình Email</CardTitle>
                        <CardDescription>Nội dung email tự động gửi cho ứng viên</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="emailSignature">Chữ ký email</Label>
                            <Textarea
                                id="emailSignature"
                                rows={4}
                                value={settings.emailSignature}
                                onChange={(e) => setSettings({ ...settings, emailSignature: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Card>
                    <CardHeader>
                        <CardTitle>Footer</CardTitle>
                        <CardDescription>Nội dung hiển thị ở cuối trang</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="footerText">Dòng copyright</Label>
                            <Input
                                id="footerText"
                                value={settings.footerText}
                                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Lưu cài đặt
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
