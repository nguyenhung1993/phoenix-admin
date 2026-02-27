'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CheckCircle, BookOpen, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface EnrollmentItem {
    id: string;
    courseId: string;
    courseTitle: string;
    courseThumbnail: string;
    courseCategory: string;
    courseInstructor: string | null;
    courseDuration: string | null;
    courseTotalLessons: number;
    progress: number;
    status: string;
}

export default function MyLearningPage() {
    const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/enrollments');
                const json = await res.json();
                setEnrollments(json.data || []);
            } catch {
                setEnrollments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Khóa học của tôi</h1>
                <p className="text-muted-foreground">Tiếp tục học tập và phát triển kỹ năng</p>
            </div>

            {/* Resume Learning Section */}
            {enrollments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrollments.map((enr) => (
                        <Card key={enr.id} className="flex flex-col md:flex-row overflow-hidden">
                            <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto">
                                <Image
                                    src={enr.courseThumbnail}
                                    alt={enr.courseTitle}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <PlayCircle className="h-12 w-12 text-white" />
                                </div>
                            </div>
                            <div className="flex-1 p-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary" className="text-xs">{enr.courseCategory}</Badge>
                                        <span className="text-xs text-muted-foreground text-right">{enr.courseDuration}</span>
                                    </div>
                                    <h3 className="font-semibold text-lg line-clamp-1 mb-1">{enr.courseTitle}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                        <BookOpen className="h-4 w-4" />
                                        <span>{Math.round(enr.courseTotalLessons * enr.progress / 100)}/{enr.courseTotalLessons} bài học</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span>Hoàn thành {Math.round(enr.progress)}%</span>
                                        {enr.progress >= 100 ? (
                                            <span className="text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Đã xong</span>
                                        ) : (
                                            <span className="text-blue-600">Đang học</span>
                                        )}
                                    </div>
                                    <Progress value={enr.progress} className="h-2" />
                                    <Button asChild className="w-full mt-2">
                                        <Link href={`/admin/learn/${enr.courseId}`}>
                                            {enr.progress > 0 ? 'Tiếp tục học' : 'Bắt đầu ngay'}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {enrollments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Bạn chưa đăng ký khóa học nào</p>
                </div>
            )}
        </div>
    );
}
