'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CheckCircle, Clock, BookOpen, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface CourseItem {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string;
    instructor: string | null;
    duration: string | null;
    totalModules: number;
    totalLessons: number;
    category: string;
    level: string;
    students: number;
    rating: number;
    status: string;
}

interface EnrollmentItem {
    id: string;
    courseId: string;
    courseTitle: string;
    courseThumbnail: string;
    courseCategory: string;
    courseInstructor: string | null;
    courseDuration: string | null;
    courseTotalLessons: number;
    courseLevel: string;
    progress: number;
    status: string;
}

export default function ELearningPage() {
    const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
    const [allCourses, setAllCourses] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [enrRes, courseRes] = await Promise.all([
                    fetch('/api/enrollments'),
                    fetch('/api/courses'),
                ]);
                const enrJson = await enrRes.json();
                const courseJson = await courseRes.json();
                setEnrollments(enrJson.data || []);
                setAllCourses(courseJson.data || []);
            } catch {
                setEnrollments([]);
                setAllCourses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const enrolledIds = new Set(enrollments.map(e => e.courseId));
    const otherCourses = allCourses.filter(c => !enrolledIds.has(c.id));

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">E-Learning</h1>
                    <p className="text-muted-foreground">Trung tâm học tập và phát triển kỹ năng Phoenix</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm khóa học..." className="pl-8" />
                </div>
            </div>

            {/* Resume Learning Section */}
            {enrollments.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Tiếp tục học
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {enrollments.map((enr) => (
                            <Card key={enr.id} className="flex flex-col md:flex-row overflow-hidden group hover:shadow-md transition-all">
                                <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto">
                                    <Image
                                        src={enr.courseThumbnail}
                                        alt={enr.courseTitle}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="h-12 w-12 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="secondary" className="text-xs">{enr.courseCategory}</Badge>
                                            <span className="text-xs text-muted-foreground">{enr.courseDuration}</span>
                                        </div>
                                        <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                            <Link href={`/admin/learn/${enr.courseId}`}>{enr.courseTitle}</Link>
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <BookOpen className="h-4 w-4" />
                                            <span>{Math.round(enr.courseTotalLessons * enr.progress / 100)}/{enr.courseTotalLessons} bài học</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span>Hoàn thành {Math.round(enr.progress)}%</span>
                                            {enr.progress >= 100 ? (
                                                <span className="text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Đã xong</span>
                                            ) : (
                                                <span className="text-blue-600">Đang học</span>
                                            )}
                                        </div>
                                        <Progress value={enr.progress} className="h-2" />
                                        <Button asChild className="w-full mt-2" size="sm">
                                            <Link href={`/admin/learn/${enr.courseId}`}>
                                                {enr.progress > 0 ? 'Tiếp tục học' : 'Bắt đầu ngay'}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* All Courses / Recommended */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Khám phá khóa học mới</h2>
                    <Button variant="link" className="text-primary">Xem tất cả</Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(otherCourses.length > 0 ? otherCourses : allCourses).slice(0, 4).map((course, idx) => (
                        <Link href={`/admin/learn/${course.id}`} key={`${course.id}-${idx}`} className="group block h-full">
                            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-none shadow-sm ring-1 ring-slate-200">
                                <div className="relative aspect-video overflow-hidden">
                                    <Image
                                        src={course.thumbnail}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-sm">
                                            {course.level}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="rounded-sm font-normal">{course.category}</Badge>
                                        <span>•</span>
                                        <span>{course.duration || '-'}</span>
                                    </div>
                                    <h4 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors text-base">
                                        {course.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <PlayCircle className="h-3 w-3" />
                                            {course.totalLessons} bài học
                                        </div>
                                        <div className="text-xs font-medium text-primary">
                                            Xem chi tiết
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {allCourses.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">Chưa có khóa học nào</div>
                )}
            </section>
        </div>
    );
}
