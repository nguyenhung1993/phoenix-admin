'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

export function CompanyProfile() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companyInfo, setCompanyInfo] = useState({
        companyName: 'Phoenix Corp',
        companyEmail: 'hr@phoenix.com',
        companyPhone: '028 3939 6868',
        address: 'Tòa nhà Bitexco, Q1, TP.HCM',
        website: 'https://phoenix-hrm.com',
        timezone: 'GMT+7:00',
        currency: 'VND',
        dateFormat: 'DD/MM/YYYY'
    });

    const handleSave = async () => {
        setIsSubmitting(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        toast.success('Đã lưu cấu hình thành công!');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Hồ sơ doanh nghiệp</h3>
                    <p className="text-sm text-muted-foreground">Thông tin chung về doanh nghiệp hiển thị trên hệ thống và báo cáo.</p>
                </div>
            </div>
            <Separator />
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Tên doanh nghiệp</Label>
                            <Input value={companyInfo.companyName} onChange={e => setCompanyInfo({ ...companyInfo, companyName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Website</Label>
                            <Input value={companyInfo.website} onChange={e => setCompanyInfo({ ...companyInfo, website: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email liên hệ</Label>
                            <Input value={companyInfo.companyEmail} onChange={e => setCompanyInfo({ ...companyInfo, companyEmail: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Hotline</Label>
                            <Input value={companyInfo.companyPhone} onChange={e => setCompanyInfo({ ...companyInfo, companyPhone: e.target.value })} />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label>Địa chỉ trụ sở</Label>
                            <Input value={companyInfo.address} onChange={e => setCompanyInfo({ ...companyInfo, address: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Múi giờ mặc định</Label>
                            <Input value={companyInfo.timezone} readOnly className="bg-muted" />
                            <p className="text-[10px] text-muted-foreground">Cài đặt mặc định cho toàn hệ thống</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Đơn vị tiền tệ</Label>
                            <Input value={companyInfo.currency} readOnly className="bg-muted" />
                        </div>
                    </div>
                    <div className="flex justify-start pt-4">
                        <Button onClick={handleSave} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Lưu thay đổi
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
