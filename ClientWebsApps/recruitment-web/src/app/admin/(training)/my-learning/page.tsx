'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { mockCourses, Course } from '@/lib/mocks/training';
import { PlayCircle, CheckCircle, Clock, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MyLearningPage() {
    // Mock: User is enrolled in first 2 courses
    const myCourses = mockCourses.slice(0, 2).map(c => ({
        ...c,
        progress: Math.floor(Math.random() * 100), // Random progress
        lastAccessed: '2026-02-08',
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Khóa học của tôi</h1>
                <p className="text-muted-foreground">Tiếp tục học tập và phát triển kỹ năng</p>
            </div>

            {/* Resume Learning Section */}
            {myCourses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myCourses.map((course) => (
                        <Card key={course.id} className="flex flex-col md:flex-row overflow-hidden">
                            <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto">
                                <Image
                                    src={course.thumbnail}
                                    alt={course.title}
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
                                        <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                                        <span className="text-xs text-muted-foreground text-right">{course.duration}</span>
                                    </div>
                                    <h3 className="font-semibold text-lg line-clamp-1 mb-1">{course.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                        <BookOpen className="h-4 w-4" />
                                        <span>{course.totalLessons - 2}/{course.totalLessons} bài học</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span>Hoàn thành {course.progress}%</span>
                                        {course.progress === 100 ? (
                                            <span className="text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Đã xong</span>
                                        ) : (
                                            <span className="text-blue-600">Đang học</span>
                                        )}
                                    </div>
                                    <Progress value={course.progress} className="h-2" />
                                    <Button asChild className="w-full mt-2">
                                        <Link href={`/admin/learn/${course.id}`}>
                                            {course.progress > 0 ? 'Tiếp tục học' : 'Bắt đầu ngay'}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Recommended / All Assigned Courses could go here */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Danh sách được giao</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Just duplicating for UI demo */}
                    {myCourses.map((course) => (
                        <Link href={`/admin/learn/${course.id}`} key={`list-${course.id}`} className="group">
                            <Card className="h-full hover:shadow-md transition-shadow">
                                <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                    <Image
                                        src={course.thumbnail}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <CardContent className="p-3">
                                    <h4 className="font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">{course.title}</h4>
                                    <p className="text-xs text-muted-foreground mb-2">{course.instructor}</p>
                                    <Progress value={course.progress} className="h-1.5" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
