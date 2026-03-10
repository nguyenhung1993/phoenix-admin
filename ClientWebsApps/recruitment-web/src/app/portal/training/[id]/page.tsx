'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
    ArrowLeft,
    CheckCircle2,
    Circle,
    FileText,
    Video,
    Link as LinkIcon,
    Presentation,
    Award,
    Activity
} from 'lucide-react';
import { PageHeaderSkeleton } from '@/components/ui/skeletons';

export default function PortalTrainingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeMaterialId, setActiveMaterialId] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/portal/training/${classId}`);
                if (!res.ok) throw new Error('Failed to fetch details');
                const json = await res.json();
                if (json.data) {
                    setData(json.data);
                    if (json.data.class.materials?.length > 0) {
                        setActiveMaterialId(json.data.class.materials[0].id);
                    }
                }
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error('Không thể tải thông tin lớp học');
                router.push('/portal/training');
            } finally {
                setLoading(false);
            }
        };

        if (classId) {
            fetchDetail();
        }
    }, [classId, router]);

    const handleUpdateProgress = async (newProgress: number) => {
        try {
            const res = await fetch(`/api/portal/training/${classId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress: newProgress }),
            });

            if (!res.ok) throw new Error('Failed to update progress');

            const json = await res.json();
            setData({ ...data, progress: json.data.progress, status: json.data.status, score: json.data.score });

            if (newProgress === 100) {
                toast.success('🎉 Xin chúc mừng! Bạn đã hoàn thành khóa học.');
            } else {
                toast.success(`Đã cập nhật tiến độ học tập: ${newProgress}%`);
            }
        } catch (error) {
            console.error('Update progress error:', error);
            toast.error('Lỗi khi cập nhật tiến độ');
        }
    };

    const markMaterialAsDone = () => {
        const materials = data.class.materials;
        const currentIndex = materials.findIndex((m: any) => m.id === activeMaterialId);

        // Simulating progress logic
        const materialWeight = Math.floor(100 / (materials.length || 1));
        const newProgress = Math.min(100, (data.progress || 0) + materialWeight);

        if (currentIndex < materials.length - 1) {
            setActiveMaterialId(materials[currentIndex + 1].id);
        }

        handleUpdateProgress(newProgress);
    };

    if (loading) {
        return <PageHeaderSkeleton />;
    }

    if (!data) return null;

    const { class: trainingClass, progress, status, score } = data;
    const { course, materials, exams } = trainingClass;
    const activeMaterial = materials.find((m: any) => m.id === activeMaterialId);

    const getIconForType = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video className="h-4 w-4" />;
            case 'PDF': return <FileText className="h-4 w-4" />;
            case 'SLIDE': return <Presentation className="h-4 w-4" />;
            case 'LINK': return <LinkIcon className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/portal/training')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{course.name}</h1>
                    <p className="text-muted-foreground">Lớp: {trainingClass.name} | Giảng viên: {trainingClass.instructor || 'Tự do'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column: Player & Content */}
                <div className="lg:col-span-3 space-y-6">
                    {activeMaterial ? (
                        <Card className="overflow-hidden">
                            <div className="aspect-video bg-black flex items-center justify-center relative">
                                {activeMaterial.type === 'VIDEO' ? (
                                    activeMaterial.url ? (
                                        activeMaterial.url.includes('youtube') || activeMaterial.url.includes('vimeo') ? (
                                            <iframe
                                                src={activeMaterial.url}
                                                className="absolute top-0 left-0 w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video
                                                controls
                                                src={activeMaterial.url}
                                                className="absolute top-0 left-0 w-full h-full object-contain"
                                            />
                                        )
                                    ) : (
                                        <p className="text-white text-sm">Video URL không khả dụng</p>
                                    )
                                ) : activeMaterial.type === 'PDF' || activeMaterial.type === 'SLIDE' ? (
                                    <div className="h-full w-full flex flex-col items-center justify-center bg-muted">
                                        <FileText className="h-16 w-16 mb-4 text-muted-foreground/50" />
                                        <p className="text-muted-foreground font-medium">Tài liệu: {activeMaterial.title}</p>
                                        {activeMaterial.url && (
                                            <Button variant="outline" className="mt-4" onClick={() => window.open(activeMaterial.url, '_blank')}>
                                                Mở tài liệu trong thẻ mới
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-white text-center p-6">
                                        <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-70" />
                                        <p className="mb-4">Liên kết mở rộng</p>
                                        {activeMaterial.url && (
                                            <a href={activeMaterial.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                Truy cập đường dẫn
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            {getIconForType(activeMaterial.type)}
                                            {activeMaterial.title}
                                        </h3>
                                        {activeMaterial.description && (
                                            <p className="text-muted-foreground mt-2">{activeMaterial.description}</p>
                                        )}
                                    </div>
                                    <Button onClick={markMaterialAsDone} disabled={progress === 100}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        {progress === 100 ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="p-12 text-center text-muted-foreground">
                            Không có tài liệu nào cho khóa học này.
                        </Card>
                    )}

                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList>
                            <TabsTrigger value="overview">Tổng quan khóa học</TabsTrigger>
                            <TabsTrigger value="exams">Bài kiểm tra ({exams.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <h4 className="font-semibold mb-2">Mô tả khóa học</h4>
                                    <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                                        {course.description || 'Không có mô tả chi tiết.'}
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="exams" className="mt-4">
                            {exams.length > 0 ? (
                                <div className="grid gap-4">
                                    {exams.map((exam: any) => (
                                        <Card key={exam.id} className="flex flex-row items-center justify-between p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-primary/10 p-3 rounded-full">
                                                    <Activity className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{exam.title}</h4>
                                                    <p className="text-sm text-muted-foreground">Thời gian: {exam.duration} phút | Pass: {exam.passScore}%</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" disabled={progress < 100}>
                                                {progress < 100 ? 'Cần học xong để thi' : 'Bắt đầu làm bài'}
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="p-8 text-center text-muted-foreground text-sm">
                                    Không có bài kiểm tra nào trong khóa học này.
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Playlist & Progress */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center justify-between">
                                Tiến độ học tập
                                <span className={status === 'COMPLETED' ? 'text-green-600' : 'text-primary'}>
                                    {progress}%
                                </span>
                            </CardTitle>
                            <Progress value={progress} className="h-2" />
                            {status === 'COMPLETED' && score && (
                                <Badge className="mt-3 bg-green-500 hover:bg-green-600 w-fit flex items-center gap-1">
                                    <Award className="h-3 w-3" /> Điểm kết khóa: {score}/100
                                </Badge>
                            )}
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Nội dung bài giảng</CardTitle>
                        </CardHeader>
                        <div className="flex flex-col">
                            {materials.map((m: any, idx: number) => {
                                const isActive = activeMaterialId === m.id;
                                // Giả lập trạng thái completed dựa trên progress 
                                const isCompleted = progress >= Math.min(100, (idx + 1) * Math.floor(100 / (materials.length || 1)));

                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => setActiveMaterialId(m.id)}
                                        className={`flex items-start gap-3 p-4 text-left border-t transition-colors hover:bg-muted/50 ${isActive ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                                            }`}
                                    >
                                        <div className="mt-0.5 min-w-[20px]">
                                            {isCompleted ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-muted-foreground/30" />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-primary' : ''}`}>
                                                {idx + 1}. {m.title}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                                {getIconForType(m.type)}
                                                <span>{m.type === 'VIDEO' ? 'Video' : m.type === 'PDF' ? 'Tài liệu PDF' : 'Slide/Link'}</span>
                                                {m.duration && <span>• {m.duration} phút</span>}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                            {materials.length === 0 && (
                                <div className="p-4 text-sm text-center text-muted-foreground">
                                    Chưa có nội dung
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
