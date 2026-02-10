'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    Calendar,
    Clock,
    FileCheck,
    ArrowUpRight,
    User,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export default function PortalDashboard() {
    const { data: session } = useSession();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Xin chào, {session?.user?.name} 👋</h1>
                    <p className="text-muted-foreground">Chào mừng bạn trở lại làm việc. Chúc bạn một ngày tốt lành!</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/portal/requests">
                            <FileCheck className="mr-2 h-4 w-4" />
                            Tạo yêu cầu
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ngày phép còn lại</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12.0</div>
                        <p className="text-xs text-muted-foreground">ngày cho năm 2026</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Công tháng này</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">20.5</div>
                        <p className="text-xs text-muted-foreground">/ 22 ngày công chuẩn</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Yêu cầu chờ duyệt</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">yêu cầu nghỉ phép</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trạng thái hồ sơ</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Hoàn tất</div>
                        <p className="text-xs text-muted-foreground">Đã cập nhật đầy đủ</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Activity / Announcements */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Thông báo mới nhất</CardTitle>
                        <CardDescription>Cập nhật tin tức nội bộ từ công ty</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: 'Thông báo nghỉ lễ 30/4 - 1/5', date: '2 ngày trước', type: 'NOTICE' },
                                { title: 'Cập nhật chính sách bảo hiểm mới', date: '5 ngày trước', type: 'POLICY' },
                                { title: 'Chào mừng nhân viên mới tháng 2', date: '1 tuần trước', type: 'EVENT' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:pb-0 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                    <Badge variant="secondary">{item.type}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Access */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Truy cập nhanh</CardTitle>
                        <CardDescription>Các chức năng thường dùng</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                            <Link href="/portal/profile">
                                <User className="mr-4 h-5 w-5 text-primary" />
                                <div className="text-left">
                                    <div className="font-semibold">Hồ sơ của tôi</div>
                                    <div className="text-xs text-muted-foreground">Cập nhật thông tin liên hệ</div>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                            </Link>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                            <Link href="/portal/timesheet">
                                <Calendar className="mr-4 h-5 w-5 text-primary" />
                                <div className="text-left">
                                    <div className="font-semibold">Bảng chấm công</div>
                                    <div className="text-xs text-muted-foreground">Xem chi tiết ngày công</div>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                            </Link>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                            <Link href="/portal/requests">
                                <FileCheck className="mr-4 h-5 w-5 text-primary" />
                                <div className="text-left">
                                    <div className="font-semibold">Gửi yêu cầu</div>
                                    <div className="text-xs text-muted-foreground">Nghỉ phép, tăng ca, công tác</div>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
