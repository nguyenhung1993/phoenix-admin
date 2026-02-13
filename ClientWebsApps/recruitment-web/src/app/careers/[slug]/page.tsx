import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Clock, Building2, Briefcase, Calendar, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { jobTypeLabels } from '@/lib/schemas/recruitment';

// Since we are fetching from internal API in server component, we can use absolute URL if configured, 
// or import the logic directly (better for server components). 
// But to stick to "API Route" pattern proposed, we fetch via full URL (requires base URL) 
// or simply query Prisma directly in Server Component (Best Practice for Next.js App Router).
// However, the plan stated "Fetch API". Let's stick to using Prisma directly here for better performance 
// and to avoid "absolute URL" issues during build time if base URL is not set.
// Actually, re-reading the plan: "Refactor ... -> fetch API". 
// But since this is a Server Component, calling its own API route is an anti-pattern (network overhead).
// I will query Prisma directly here, which shares logic with the API. 

import prisma from '@/lib/prisma';
import { Metadata } from 'next';

interface JobDetailPageProps {
    params: Promise<{ slug: string }>;
}

const workModeLabels: Record<string, string> = {
    ONSITE: 'Tại văn phòng',
    REMOTE: 'Từ xa',
    HYBRID: 'Hybrid',
};

async function getJob(slug: string) {
    const job = await prisma.job.findUnique({
        where: { slug },
        include: {
            department: { select: { name: true } },
        },
    });

    if (!job || job.status !== 'PUBLISHED') return null;

    return {
        ...job,
        department: job.department?.name || 'N/A',
    };
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const job = await getJob(slug);

    if (!job) {
        return { title: 'Không tìm thấy' };
    }

    return {
        title: job.title,
        description: job.description || undefined,
    };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const { slug } = await params;
    const job = await getJob(slug);

    if (!job) {
        notFound();
    }

    return (
        <>
            {/* Breadcrumb */}
            <section className="py-4 border-b">
                <div className="container">
                    <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại danh sách
                    </Link>
                </div>
            </section>

            {/* Job Header */}
            <section className="py-8 md:py-12 bg-gradient-to-br from-primary/5 via-background to-background">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <Badge>{job.department}</Badge>
                                <Badge variant="secondary">{jobTypeLabels[job.type] || job.type}</Badge>
                                <Badge variant="outline">{workModeLabels[job.workMode] || job.workMode}</Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" />
                                    {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Đăng ngày {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                        <Button size="lg" className="gap-2" asChild>
                            <Link href={`/careers/${job.slug}/apply`}>
                                <Send className="h-4 w-4" />
                                Ứng tuyển ngay
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Job Content */}
            <section className="py-12">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mô tả công việc</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Yêu cầu ứng viên</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-line">{job.requirements}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quyền lợi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-muted-foreground">
                                        {job.benefits && Array.isArray(job.benefits) && job.benefits.length > 0 ? (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {job.benefits.map((benefit: string, index: number) => (
                                                    <li key={index}>{benefit}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="whitespace-pre-line">{typeof job.benefits === 'string' ? job.benefits : 'Đang cập nhật'}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Thông tin chung</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Briefcase className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Mức lương</p>
                                            <p className="font-medium">{formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Địa điểm</p>
                                            <p className="font-medium">{job.location}</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Loại hình</p>
                                            <p className="font-medium">{jobTypeLabels[job.type] || job.type}</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Hình thức</p>
                                            <p className="font-medium">{workModeLabels[job.workMode] || job.workMode}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-primary text-primary-foreground">
                                <CardContent className="pt-6 text-center">
                                    <h3 className="font-semibold text-lg mb-2">Sẵn sàng ứng tuyển?</h3>
                                    <p className="text-sm opacity-90 mb-4">
                                        Gửi CV của bạn ngay hôm nay!
                                    </p>
                                    <Button variant="secondary" className="w-full" asChild>
                                        <Link href={`/careers/${job.slug}/apply`}>
                                            Ứng tuyển ngay
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
