'use client';

// Note: In Next.js App Router, dynamic routes receive params.
// We need to use `useParams` or props.

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { mockCourses, Course, CourseModule, Lesson } from '@/lib/mocks/training';
import {
    ChevronLeft,
    PlayCircle,
    FileText,
    HelpCircle,
    CheckCircle2,
    Circle,
    Menu,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CourseLearnPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);

    useEffect(() => {
        // Mock fetch course
        const foundCourse = mockCourses.find(c => c.id === courseId);
        if (foundCourse) {
            setCourse(foundCourse);
            // Default select first lesson of first module
            if (foundCourse.modules.length > 0 && foundCourse.modules[0].lessons.length > 0) {
                setActiveLesson(foundCourse.modules[0].lessons[0]);
                setExpandedModules([foundCourse.modules[0].id]);
            }
        }
    }, [courseId]);

    if (!course) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải khóa học...</div>;
    }

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleLessonSelect = (lesson: Lesson) => {
        setActiveLesson(lesson);
    };

    const handleCompleteLesson = () => {
        if (activeLesson && !completedLessons.includes(activeLesson.id)) {
            setCompletedLessons(prev => [...prev, activeLesson.id]);
            toast.success('Đã hoàn thành bài học!');
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden -m-6">
            {/* Sidebar - Course Content */}
            <div className="w-full md:w-80 border-r bg-background flex flex-col h-full">
                <div className="p-4 border-b">
                    <Button variant="ghost" size="sm" className="-ml-2 mb-2" onClick={() => router.back()}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Quay lại
                    </Button>
                    <h2 className="font-semibold line-clamp-2">{course.title}</h2>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center"><PlayCircle className="h-3 w-3 mr-1" /> {completedLessons.length}/{course.totalLessons} bài học</span>
                        <span>•</span>
                        <span>{Math.round((completedLessons.length / course.totalLessons) * 100)}%</span>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="pb-4">
                        {course.modules.map((module) => (
                            <div key={module.id} className="border-b last:border-0">
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                                >
                                    <span className="font-medium text-sm line-clamp-1">{module.title}</span>
                                    {expandedModules.includes(module.id) ? (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </button>

                                {expandedModules.includes(module.id) && (
                                    <div className="bg-muted/20">
                                        {module.lessons.map((lesson) => {
                                            const isActive = activeLesson?.id === lesson.id;
                                            const isCompleted = completedLessons.includes(lesson.id);
                                            const Icon = lesson.type === 'VIDEO' ? PlayCircle : (lesson.type === 'QUIZ' ? HelpCircle : FileText);

                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => handleLessonSelect(lesson)}
                                                    className={cn(
                                                        "w-full flex items-start gap-3 p-3 pl-6 text-sm hover:bg-muted transition-colors text-left border-l-2 border-transparent",
                                                        isActive && "bg-blue-50/50 border-primary text-primary hover:bg-blue-50/50",
                                                        isCompleted && !isActive && "text-muted-foreground"
                                                    )}
                                                >
                                                    <div className="mt-0.5">
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={cn("line-clamp-2 font-medium", isCompleted && "opacity-80")}>
                                                            {lesson.title}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground block mt-0.5">{lesson.duration}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
                {activeLesson ? (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 md:p-8">
                            <div className="max-w-4xl mx-auto">
                                <Card className="aspect-video bg-black flex items-center justify-center mb-6 overflow-hidden">
                                    {/* Mock Video Player */}
                                    <div className="text-white text-center">
                                        <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
                                        <p className="text-lg font-medium">{activeLesson.title}</p>
                                        <p className="text-sm text-white/60">Video Placeholder for {activeLesson.type}</p>
                                    </div>
                                </Card>

                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <Badge variant="outline" className="mb-2">{activeLesson.type}</Badge>
                                        <h1 className="text-2xl font-bold">{activeLesson.title}</h1>
                                        <p className="text-muted-foreground mt-1">Mô tả bài học đang cập nhật...</p>
                                    </div>
                                    <Button
                                        size="lg"
                                        onClick={handleCompleteLesson}
                                        disabled={completedLessons.includes(activeLesson.id)}
                                        variant={completedLessons.includes(activeLesson.id) ? "secondary" : "default"}
                                    >
                                        {completedLessons.includes(activeLesson.id) ? (
                                            <>
                                                <CheckCircle2 className="mr-2 h-5 w-5" /> Đã hoàn thành
                                            </>
                                        ) : (
                                            "Hoàn thành & Tiếp tục"
                                        )}
                                    </Button>
                                </div>

                                <Separator className="my-6" />

                                <div className="prose max-w-none">
                                    <h3>Tài liệu tham khảo</h3>
                                    <ul>
                                        <li>Slide bài giảng (PDF)</li>
                                        <li>Bài tập thực hành</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Chọn một bài học để bắt đầu
                    </div>
                )}
            </div>
        </div>
    );
}
