'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    mockLessons,
    mockCourses,
    mockQuizQuestions,
    lessonTypeLabels,
    Lesson,
    QuizQuestion,
} from '@/lib/mocks';
import {
    Play,
    Video,
    FileText,
    FileQuestion,
    Clock,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    RotateCcw,
    Trophy,
    Lock,
} from 'lucide-react';

// Dynamic import for VideoPlayer to avoid SSR issues
const VideoPlayer = dynamic(() => import('@/components/training/VideoPlayer'), {
    ssr: false,
    loading: () => (
        <div className="aspect-video bg-muted animate-pulse rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Đang tải video...</span>
        </div>
    ),
});

// Icon mapping
const lessonIcons: Record<string, React.ReactNode> = {
    VIDEO: <Video className="h-5 w-5 text-blue-500" />,
    DOCUMENT: <FileText className="h-5 w-5 text-orange-500" />,
    QUIZ: <FileQuestion className="h-5 w-5 text-purple-500" />,
};

// Quiz Component
interface QuizComponentProps {
    questions: QuizQuestion[];
    onComplete: (score: number, passed: boolean) => void;
}

function QuizComponent({ questions, onComplete }: QuizComponentProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
        new Array(questions.length).fill(null)
    );
    const [showResults, setShowResults] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const question = questions[currentQuestion];
    const selectedAnswer = selectedAnswers[currentQuestion];

    const handleSelectAnswer = (optionIndex: number) => {
        if (showExplanation) return;

        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = optionIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleCheckAnswer = () => {
        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        setShowExplanation(false);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            const correctCount = selectedAnswers.filter(
                (answer, index) => answer === questions[index].correctAnswer
            ).length;
            const score = Math.round((correctCount / questions.length) * 100);
            setShowResults(true);
            onComplete(score, score >= 70);
        }
    };

    const handleRetry = () => {
        setCurrentQuestion(0);
        setSelectedAnswers(new Array(questions.length).fill(null));
        setShowResults(false);
        setShowExplanation(false);
    };

    const correctCount = selectedAnswers.filter(
        (answer, index) => answer === questions[index].correctAnswer
    ).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70;

    if (showResults) {
        return (
            <div className="text-center py-8 space-y-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${passed ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    {passed ? (
                        <Trophy className="h-10 w-10 text-green-600" />
                    ) : (
                        <XCircle className="h-10 w-10 text-red-600" />
                    )}
                </div>

                <div>
                    <h3 className="text-2xl font-bold mb-2">
                        {passed ? 'Chúc mừng!' : 'Chưa đạt yêu cầu'}
                    </h3>
                    <p className="text-muted-foreground">
                        Bạn đã trả lời đúng {correctCount}/{questions.length} câu hỏi
                    </p>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary">{score}%</p>
                        <p className="text-sm text-muted-foreground">Điểm số</p>
                    </div>
                    <div className="h-12 w-px bg-border" />
                    <div className="text-center">
                        <p className="text-4xl font-bold">70%</p>
                        <p className="text-sm text-muted-foreground">Điểm đạt</p>
                    </div>
                </div>

                <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={handleRetry}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Làm lại
                    </Button>
                    {passed && (
                        <Button className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Hoàn thành khóa học
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Câu hỏi {currentQuestion + 1}/{questions.length}</span>
                    <span className="font-medium">
                        {Math.round(((currentQuestion + (showExplanation ? 1 : 0)) / questions.length) * 100)}%
                    </span>
                </div>
                <Progress value={((currentQuestion + (showExplanation ? 1 : 0)) / questions.length) * 100} />
            </div>

            <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">{question.question}</h3>

                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === question.correctAnswer;

                        let optionClass = 'border-2 p-4 rounded-lg cursor-pointer transition-all ';

                        if (showExplanation) {
                            if (isCorrect) {
                                optionClass += 'border-green-500 bg-green-50';
                            } else if (isSelected && !isCorrect) {
                                optionClass += 'border-red-500 bg-red-50';
                            } else {
                                optionClass += 'border-gray-200 opacity-50';
                            }
                        } else {
                            optionClass += isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-primary/50';
                        }

                        return (
                            <div
                                key={index}
                                className={optionClass}
                                onClick={() => handleSelectAnswer(index)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium text-sm ${showExplanation && isCorrect
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : showExplanation && isSelected && !isCorrect
                                            ? 'border-red-500 bg-red-500 text-white'
                                            : isSelected
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-300'
                                        }`}>
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    <span className="flex-1">{option}</span>
                                    {showExplanation && isCorrect && (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    )}
                                    {showExplanation && isSelected && !isCorrect && (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {showExplanation && question.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>Giải thích:</strong> {question.explanation}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3">
                {!showExplanation ? (
                    <Button
                        onClick={handleCheckAnswer}
                        disabled={selectedAnswer === null}
                    >
                        Kiểm tra đáp án
                    </Button>
                ) : (
                    <Button onClick={handleNextQuestion}>
                        {currentQuestion < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}

// Lesson progress type for tracking
interface LessonProgressState {
    [lessonId: string]: {
        progress: number;
        completed: boolean;
    };
}

export default function ELearningPage() {
    const { data: session } = useSession();
    const [selectedCourse, setSelectedCourse] = useState(mockCourses[0]?.id || '');
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [lessonProgress, setLessonProgress] = useState<LessonProgressState>({});

    const courseLessons = mockLessons
        .filter(l => l.courseId === selectedCourse)
        .sort((a, b) => a.order - b.order);

    const currentLessonIndex = selectedLesson
        ? courseLessons.findIndex(l => l.id === selectedLesson.id)
        : -1;

    const lessonQuestions = useMemo(() => {
        if (!selectedLesson || selectedLesson.type !== 'QUIZ') return [];
        return mockQuizQuestions.filter(q => q.lessonId === selectedLesson.id);
    }, [selectedLesson]);

    const handleLessonSelect = (lesson: Lesson) => {
        setSelectedLesson(lesson);
    };

    const handleVideoProgress = (progress: number) => {
        if (!selectedLesson) return;

        setLessonProgress(prev => ({
            ...prev,
            [selectedLesson.id]: {
                progress,
                completed: progress >= 80 || prev[selectedLesson.id]?.completed || false,
            },
        }));
    };

    const handleVideoComplete = () => {
        if (!selectedLesson) return;

        setLessonProgress(prev => ({
            ...prev,
            [selectedLesson.id]: {
                progress: 100,
                completed: true,
            },
        }));
    };

    const handleQuizComplete = (score: number, passed: boolean) => {
        if (!selectedLesson) return;

        setLessonProgress(prev => ({
            ...prev,
            [selectedLesson.id]: {
                progress: 100,
                completed: passed,
            },
        }));
    };

    const handleMarkComplete = () => {
        if (!selectedLesson) return;

        setLessonProgress(prev => ({
            ...prev,
            [selectedLesson.id]: {
                progress: 100,
                completed: true,
            },
        }));
    };

    const goToNextLesson = () => {
        if (currentLessonIndex < courseLessons.length - 1) {
            handleLessonSelect(courseLessons[currentLessonIndex + 1]);
        }
    };

    const goToPrevLesson = () => {
        if (currentLessonIndex > 0) {
            handleLessonSelect(courseLessons[currentLessonIndex - 1]);
        }
    };

    const getCurrentLessonProgress = () => {
        if (!selectedLesson) return { progress: 0, completed: false };
        return lessonProgress[selectedLesson.id] || { progress: 0, completed: false };
    };

    const currentProgress = getCurrentLessonProgress();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">E-Learning</h1>
                    <p className="text-muted-foreground">Học trực tuyến với video và bài kiểm tra</p>
                </div>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Chọn khóa học" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockCourses.filter(c => c.status === 'ACTIVE').map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                                {course.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lesson List */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Danh sách bài học
                            </CardTitle>
                            <CardDescription>
                                {courseLessons.length} bài học • {Object.values(lessonProgress).filter(p => p.completed).length} đã hoàn thành
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {courseLessons.map((lesson, index) => {
                                const progress = lessonProgress[lesson.id];
                                const isCompleted = progress?.completed;
                                const progressPercent = progress?.progress || 0;

                                return (
                                    <button
                                        key={lesson.id}
                                        onClick={() => handleLessonSelect(lesson)}
                                        className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedLesson?.id === lesson.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-transparent hover:bg-muted'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${isCompleted
                                                ? 'bg-green-100 text-green-600'
                                                : progressPercent > 0
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-muted'
                                                }`}>
                                                {isCompleted ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    index + 1
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    {lessonIcons[lesson.type]}
                                                    <span className="font-medium truncate">{lesson.title}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{lesson.duration} phút</span>
                                                    {progressPercent > 0 && !isCompleted && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {progressPercent}%
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}

                            {courseLessons.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    Không có bài học nào
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Content Player */}
                <div className="lg:col-span-2">
                    {selectedLesson ? (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{selectedLesson.title}</CardTitle>
                                        <CardDescription>{selectedLesson.description}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentProgress.completed && (
                                            <Badge className="bg-green-100 text-green-700">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Hoàn thành
                                            </Badge>
                                        )}
                                        <Badge variant="outline">
                                            Bài {currentLessonIndex + 1}/{courseLessons.length}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Video Player with Progress Tracking */}
                                {selectedLesson.type === 'VIDEO' && selectedLesson.videoUrl && (
                                    <VideoPlayer
                                        url={selectedLesson.videoUrl}
                                        onProgress={handleVideoProgress}
                                        onComplete={handleVideoComplete}
                                        requiredProgress={80}
                                        savedProgress={currentProgress.progress}
                                        userEmail={session?.user?.email || ''}
                                    />
                                )}

                                {/* Document Content */}
                                {selectedLesson.type === 'DOCUMENT' && (
                                    <div className="prose prose-sm max-w-none p-6 bg-muted/50 rounded-lg">
                                        <div className="whitespace-pre-wrap">
                                            {selectedLesson.content || 'Nội dung tài liệu sẽ được hiển thị ở đây.'}
                                        </div>
                                    </div>
                                )}

                                {/* Quiz Content */}
                                {selectedLesson.type === 'QUIZ' && (
                                    lessonQuestions.length > 0 ? (
                                        <QuizComponent
                                            questions={lessonQuestions}
                                            onComplete={handleQuizComplete}
                                        />
                                    ) : (
                                        <div className="text-center py-12 bg-muted/50 rounded-lg">
                                            <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <h3 className="font-semibold mb-2">Bài kiểm tra</h3>
                                            <p className="text-muted-foreground">
                                                Chưa có câu hỏi cho bài kiểm tra này
                                            </p>
                                        </div>
                                    )
                                )}

                                {/* Progress Bar for Video */}
                                {selectedLesson.type === 'VIDEO' && (
                                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                                        <div className="flex justify-between text-sm">
                                            <span>Tiến độ xem</span>
                                            <span className="font-medium">
                                                {currentProgress.progress}%
                                                {currentProgress.progress < 80 && (
                                                    <span className="text-muted-foreground"> (cần 80% để hoàn thành)</span>
                                                )}
                                            </span>
                                        </div>
                                        <Progress value={currentProgress.progress} className="h-2" />
                                    </div>
                                )}

                                {/* Navigation */}
                                {selectedLesson.type !== 'QUIZ' && (
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            onClick={goToPrevLesson}
                                            disabled={currentLessonIndex <= 0}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-2" />
                                            Bài trước
                                        </Button>

                                        {selectedLesson.type === 'DOCUMENT' && !currentProgress.completed && (
                                            <Button
                                                variant="ghost"
                                                className="text-green-600"
                                                onClick={handleMarkComplete}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Đánh dấu hoàn thành
                                            </Button>
                                        )}

                                        <Button
                                            onClick={goToNextLesson}
                                            disabled={currentLessonIndex >= courseLessons.length - 1}
                                        >
                                            Bài tiếp
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Chọn bài học để bắt đầu</h3>
                                <p className="text-muted-foreground">
                                    Chọn một bài học từ danh sách bên trái để xem nội dung
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
