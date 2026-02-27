import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Briefcase, GraduationCap, Clock, MapPin, Calendar, Heart,
    Send, Bookmark, ChevronRight, ExternalLink
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { jobTypeLabels } from '@/lib/schemas/recruitment';
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

    const description = job.description?.substring(0, 160) || 'Chi tiết vị trí tuyển dụng tại Phoenix...';

    return {
        title: `${job.title} | Tuyển dụng`,
        description: description,
        openGraph: {
            title: `${job.title} | Phoenix Careers`,
            description: description,
            type: 'article',
            url: `/careers/${slug}`,
            images: [
                {
                    url: '/og-image-job.png', // Fallback to global if not available
                    width: 1200,
                    height: 630,
                    alt: `Tuyển dụng ${job.title}`,
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: job.title,
            description: description,
        }
    };
}

// Helper: render text with line breaks as bullet list
function renderTextAsList(text: string | null) {
    if (!text) return null;
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length <= 1) return <p className="text-[15px] leading-relaxed">{text}</p>;
    return (
        <ul className="space-y-2">
            {lines.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {line.replace(/^[-•*]\s*/, '')}
                </li>
            ))}
        </ul>
    );
}

// Helper: render string array as bullet list
function renderArrayAsList(items: string[]) {
    if (!items || items.length === 0) return <p className="text-muted-foreground">Đang cập nhật</p>;
    return (
        <ul className="space-y-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {item}
                </li>
            ))}
        </ul>
    );
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const { slug } = await params;
    const job = await getJob(slug);

    if (!job) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Main Content Card */}
            <div className="container max-w-4xl py-6">
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-5 border-b">
                        <div className="flex items-center justify-between mb-1">
                            <h1 className="text-xl font-bold text-gray-900">Chi tiết tin tuyển dụng</h1>
                            <Link
                                href="/careers"
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Gửi tới việc làm tương tự
                            </Link>
                        </div>
                    </div>

                    {/* Info Bar */}
                    <div className="px-6 py-4 border-b bg-gray-50/80">
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            {job.experienceLevel && (
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Yêu cầu:</span>
                                    <Link href="#" className="text-blue-600 hover:underline font-medium">
                                        {job.experienceLevel}
                                    </Link>
                                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                </div>
                            )}
                            {job.educationLevel && (
                                <div className="flex items-center gap-2">
                                    <Link href="#" className="text-blue-600 hover:underline font-medium">
                                        {job.educationLevel}
                                    </Link>
                                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                    <Link href="#" className="text-blue-600 hover:underline font-medium">Xem thêm</Link>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mt-2">
                            {(job.salaryMin || job.salaryMax) && (
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Quyền lợi:</span>
                                    <span className="font-medium">
                                        {job.salaryMin && job.salaryMax
                                            ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`
                                            : job.salaryMin ? `Từ ${formatCurrency(job.salaryMin)}` : `Đến ${formatCurrency(job.salaryMax!)}`
                                        }
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Nghề thứ {1}:</span>
                                <Link href="#" className="text-blue-600 hover:underline font-medium">Xem thêm</Link>
                            </div>
                        </div>
                    </div>

                    {/* Specialization Tags */}
                    {job.specialization && job.specialization.length > 0 && (
                        <div className="px-6 py-3 border-b">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-muted-foreground font-medium">Chuyên môn:</span>
                                {job.specialization.map((spec: string, i: number) => (
                                    <Badge
                                        key={i}
                                        variant="secondary"
                                        className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-medium"
                                    >
                                        {spec}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Sections */}
                    <div className="px-6 py-6 space-y-8">
                        {/* Mô tả công việc */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-emerald-600" />
                                Mô tả công việc
                            </h2>
                            <div className="pl-1">
                                {renderTextAsList(job.description)}
                            </div>
                        </section>

                        <Separator />

                        {/* Yêu cầu ứng viên */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-emerald-600" />
                                Yêu cầu ứng viên
                            </h2>
                            <div className="pl-1">
                                {renderArrayAsList(job.requirements)}
                            </div>
                        </section>

                        <Separator />

                        {/* Ưu tiên */}
                        {job.benefits && job.benefits.length > 0 && (
                            <>
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-emerald-600" />
                                        Quyền lợi
                                    </h2>
                                    <div className="pl-1">
                                        {renderArrayAsList(job.benefits)}
                                    </div>
                                </section>

                                <Separator />
                            </>
                        )}

                        {/* Địa điểm làm việc */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-emerald-600" />
                                Địa điểm làm việc
                            </h2>
                            <div className="pl-1 text-[15px] leading-relaxed space-y-1">
                                <p className="text-sm text-muted-foreground italic mb-2">
                                    (đã được cập nhật theo Danh mục Hành chính mới - thêm quận/huyện có tương ứng dữ đã đang tra cứu)
                                </p>
                                {job.workAddress ? (
                                    <div className="whitespace-pre-line">{job.workAddress}</div>
                                ) : job.location ? (
                                    <p>{job.location}</p>
                                ) : (
                                    <p className="text-muted-foreground">Đang cập nhật</p>
                                )}
                            </div>
                        </section>

                        <Separator />

                        {/* Thời gian làm việc */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-emerald-600" />
                                Thời gian làm việc
                            </h2>
                            <div className="pl-1 text-[15px] leading-relaxed">
                                {job.workSchedule ? (
                                    <div className="whitespace-pre-line">{job.workSchedule}</div>
                                ) : (
                                    <p>{jobTypeLabels[job.type] || job.type} - {workModeLabels[job.workMode] || job.workMode}</p>
                                )}
                            </div>
                        </section>

                        <Separator />

                        {/* Cách thức ứng tuyển */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Send className="h-5 w-5 text-emerald-600" />
                                Cách thức ứng tuyển
                            </h2>
                            <div className="pl-1 text-[15px] leading-relaxed">
                                {job.applicationMethod ? (
                                    <div className="whitespace-pre-line">{job.applicationMethod}</div>
                                ) : (
                                    <p>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm <strong>Ứng tuyển ngay</strong> dưới đây.</p>
                                )}
                            </div>
                        </section>

                        {/* Hạn nộp hồ sơ */}
                        {job.deadline && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                                <Calendar className="h-4 w-4" />
                                <span>Hạn nộp hồ sơ: <strong className="text-foreground">{new Date(job.deadline).toLocaleDateString('vi-VN')}</strong></span>
                            </div>
                        )}
                    </div>

                    {/* Sticky Bottom Bar */}
                    <div className="sticky bottom-0 px-6 py-4 border-t bg-white/95 backdrop-blur-sm flex items-center gap-3">
                        <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700" asChild>
                            <Link href={`/careers/${job.slug}/apply`}>
                                <Send className="h-4 w-4" />
                                Ứng tuyển ngay
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="gap-2">
                            <Bookmark className="h-4 w-4" />
                            Lưu tin
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
