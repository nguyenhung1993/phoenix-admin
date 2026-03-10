'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Clock, BookOpen, GraduationCap } from 'lucide-react';
import { PageHeaderSkeleton, CardGridSkeleton } from '@/components/ui/skeletons';

interface TrainingEnrollment {
    id: string;
    classId: string;
    courseId: string;
    courseName: string;
    courseLevel: string;
    thumbnail: string | null;
    className: string;
    instructor: string | null;
    startDate: string;
    endDate: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    progress: number;
    score: number | null;
}

export default function PortalTrainingPage() {
    const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                const res = await fetch('/api/portal/training');
                const json = await res.json();
                if (json.data) {
                    setEnrollments(json.data);
                }
            } catch (error) {
                console.error('Failed to fetch training:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTraining();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge className="bg-green-500 hover:bg-green-600">Hoàn thành</Badge>;
            case 'IN_PROGRESS':
                return <Badge className="bg-blue-500 hover:bg-blue-600">Đang học</Badge>;
            case 'FAILED':
                return <Badge variant="destructive">Chưa đạt</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeaderSkeleton hasActions={false} />
                <CardGridSkeleton count={4} />
            </div>
        );
    }

    if (enrollments.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Khóa học của tôi</h1>
                    <p className="text-muted-foreground">Theo dõi và tham gia các khóa đào tạo nội bộ</p>
                </div>
                <Card className="flex flex-col items-center justify-center py-16 text-center">
                    <GraduationCap className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <CardTitle className="mb-2">Chưa có khóa học nào</CardTitle>
                    <CardDescription>
                        Bạn chưa được phân công tham gia khóa đào tạo nào trong hệ thống.
                    </CardDescription>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Khóa học của tôi
                </h1>
                <p className="text-muted-foreground">Theo dõi và tham gia các khóa đào tạo nội bộ</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.map((eng) => (
                    <Card key={eng.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                        <div className="aspect-video w-full bg-muted relative">
                            {eng.thumbnail ? (
                                <img src={eng.thumbnail} alt={eng.courseName} className="object-cover w-full h-full" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-primary/5">
                                    <BookOpen className="h-10 w-10 mb-2 opacity-50" />
                                    <span className="text-sm font-medium">{eng.courseLevel} COURSE</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                {getStatusBadge(eng.status)}
                            </div>
                        </div>

                        <CardHeader className="p-4 pb-2 grow">
                            <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors">
                                {eng.courseName}
                            </CardTitle>
                            <CardDescription className="flex flex-col gap-1.5 mt-2">
                                <span className="flex items-center gap-1.5 text-sm">
                                    <BookOpen className="h-3.5 w-3.5" /> Lớp: {eng.className}
                                </span>
                                {eng.instructor && (
                                    <span className="flex items-center gap-1.5 text-sm">
                                        <Clock className="h-3.5 w-3.5" /> Giảng viên: {eng.instructor}
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-4 pt-2">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tiến độ</span>
                                    <span className="font-medium">{eng.progress}%</span>
                                </div>
                                <Progress value={eng.progress} className="h-2" />
                            </div>

                            {eng.status === 'COMPLETED' && eng.score !== null && (
                                <div className="mt-3 text-sm flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-100 dark:border-green-900/50">
                                    <span className="font-medium text-green-700 dark:text-green-400">Điểm thi: {eng.score}</span>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="p-4 pt-0">
                            <Button asChild className="w-full" variant={eng.status === 'COMPLETED' ? 'outline' : 'default'}>
                                <Link href={`/portal/training/${eng.classId}`}>
                                    {eng.status === 'COMPLETED' ? 'Xem lại bài giảng' : (
                                        <>
                                            <PlayCircle className="mr-2 h-4 w-4" /> Tiếp tục học
                                        </>
                                    )}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
