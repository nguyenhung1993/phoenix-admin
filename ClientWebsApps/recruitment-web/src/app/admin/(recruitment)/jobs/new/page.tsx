'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function NewJobPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: 'FULLTIME',
        workMode: 'ONSITE',
        salary: '',
        description: '',
        requirements: '',
        benefits: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        router.push('/admin/jobs');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/jobs">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Thêm vị trí mới</h1>
                    <p className="text-muted-foreground">Tạo tin tuyển dụng mới</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Tên vị trí *</Label>
                                    <Input
                                        id="title"
                                        required
                                        placeholder="VD: Store Manager"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Phòng ban *</Label>
                                        <Select
                                            value={formData.department}
                                            onValueChange={(value) => setFormData({ ...formData, department: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn phòng ban" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Retail">Retail</SelectItem>
                                                <SelectItem value="Marketing">Marketing</SelectItem>
                                                <SelectItem value="Human Resources">Human Resources</SelectItem>
                                                <SelectItem value="IT">IT</SelectItem>
                                                <SelectItem value="Finance">Finance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Địa điểm *</Label>
                                        <Select
                                            value={formData.location}
                                            onValueChange={(value) => setFormData({ ...formData, location: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn địa điểm" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                                                <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                                                <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Loại hình *</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="FULLTIME">Toàn thời gian</SelectItem>
                                                <SelectItem value="PARTTIME">Bán thời gian</SelectItem>
                                                <SelectItem value="INTERNSHIP">Thực tập</SelectItem>
                                                <SelectItem value="CONTRACT">Hợp đồng</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="workMode">Hình thức làm việc *</Label>
                                        <Select
                                            value={formData.workMode}
                                            onValueChange={(value) => setFormData({ ...formData, workMode: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ONSITE">Tại văn phòng</SelectItem>
                                                <SelectItem value="REMOTE">Từ xa</SelectItem>
                                                <SelectItem value="HYBRID">Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="salary">Mức lương</Label>
                                    <Input
                                        id="salary"
                                        placeholder="VD: 15-25 triệu VNĐ hoặc Thương lượng"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Mô tả chi tiết</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="description">Mô tả công việc *</Label>
                                    <Textarea
                                        id="description"
                                        required
                                        rows={5}
                                        placeholder="Mô tả công việc, trách nhiệm..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="requirements">Yêu cầu ứng viên *</Label>
                                    <Textarea
                                        id="requirements"
                                        required
                                        rows={5}
                                        placeholder="- Kinh nghiệm...\n- Kỹ năng..."
                                        value={formData.requirements}
                                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="benefits">Quyền lợi</Label>
                                    <Textarea
                                        id="benefits"
                                        rows={5}
                                        placeholder="- Lương thưởng...\n- Bảo hiểm..."
                                        value={formData.benefits}
                                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hành động</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        'Đăng tuyển'
                                    )}
                                </Button>
                                <Button type="button" variant="outline" className="w-full">
                                    Lưu nháp
                                </Button>
                                <Button type="button" variant="ghost" className="w-full" asChild>
                                    <Link href="/admin/jobs">Hủy</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
