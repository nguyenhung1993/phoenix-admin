'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    ArrowLeft,
    Star,
    Send,
    Save,
    User,
    CheckCircle,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EvaluationCriteria {
    id: string;
    name: string;
    description?: string;
    weight: number;
    maxScore?: number;
    ratingScale: {
        type: string;
        min?: number;
        max?: number;
        options?: { value: number; label: string }[];
    };
}

interface EvaluationSection {
    id: string;
    name: string;
    weight: number;
    criteria: EvaluationCriteria[];
}

interface EvaluationTemplate {
    id: string;
    name: string;
    description: string | null;
    sections: EvaluationSection[];
}

interface CriteriaResponse {
    criteriaId: string;
    score: number;
    comment: string;
}

// Star Rating Component
function StarRating({ value, maxStars = 5, onChange }: { value: number; maxStars?: number; onChange: (value: number) => void }) {
    const [hoverValue, setHoverValue] = useState(0);

    return (
        <div className="flex gap-1">
            {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
                <button
                    key={star}
                    type="button"
                    className="p-1 transition-transform hover:scale-110"
                    onMouseEnter={() => setHoverValue(star)}
                    onMouseLeave={() => setHoverValue(0)}
                    onClick={() => onChange(star)}
                >
                    <Star
                        className={`h-6 w-6 transition-colors ${star <= (hoverValue || value)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                    />
                </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
                {value > 0 ? `${value}/${maxStars}` : 'Chưa chọn'}
            </span>
        </div>
    );
}

// Criteria Input Component
function CriteriaInput({
    criteria,
    response,
    onScoreChange,
    onCommentChange,
}: {
    criteria: EvaluationCriteria;
    response: CriteriaResponse;
    onScoreChange: (score: number) => void;
    onCommentChange: (comment: string) => void;
}) {
    const renderInput = () => {
        switch (criteria.ratingScale?.type) {
            case 'NUMERIC':
                return (
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <Slider
                                value={[response.score]}
                                onValueChange={([value]) => onScoreChange(value)}
                                max={criteria.ratingScale.max || 100}
                                min={criteria.ratingScale.min || 0}
                                step={1}
                                className="flex-1"
                            />
                            <span className="w-16 text-center font-bold text-lg">
                                {response.score}/{criteria.ratingScale.max || 100}
                            </span>
                        </div>
                    </div>
                );
            case 'STARS':
                return (
                    <StarRating
                        value={response.score}
                        maxStars={criteria.ratingScale.max || 5}
                        onChange={onScoreChange}
                    />
                );
            case 'OPTIONS':
                return (
                    <RadioGroup
                        value={response.score.toString()}
                        onValueChange={(value) => onScoreChange(parseInt(value))}
                        className="space-y-2"
                    >
                        {criteria.ratingScale.options?.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value.toString()} id={`${criteria.id}-${option.value}`} />
                                <Label htmlFor={`${criteria.id}-${option.value}`} className="cursor-pointer">
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 border rounded-lg space-y-4 bg-card">
            <div>
                <h4 className="font-medium">{criteria.name}</h4>
                <p className="text-sm text-muted-foreground">{criteria.description}</p>
                <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">Trọng số: {criteria.weight}%</Badge>
                    {criteria.maxScore && <Badge variant="outline" className="text-xs">Điểm tối đa: {criteria.maxScore}</Badge>}
                </div>
            </div>
            {renderInput()}
            <div>
                <Label htmlFor={`comment-${criteria.id}`} className="text-sm text-muted-foreground">
                    Nhận xét (tùy chọn)
                </Label>
                <Textarea
                    id={`comment-${criteria.id}`}
                    placeholder="Nhập nhận xét cho tiêu chí này..."
                    value={response.comment || ''}
                    onChange={(e) => onCommentChange(e.target.value)}
                    className="mt-1"
                    rows={2}
                />
            </div>
        </div>
    );
}

export default function ReviewPage() {
    const params = useParams();
    const router = useRouter();
    const reviewId = params.id as string;

    const [template, setTemplate] = useState<EvaluationTemplate | null>(null);
    const [responses, setResponses] = useState<CriteriaResponse[]>([]);
    const [generalComments, setGeneralComments] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [evalInfo, setEvalInfo] = useState<{ targetEmployeeName: string; reviewerName: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch templates
                const tplRes = await fetch('/api/evaluation-templates');
                const tplJson = await tplRes.json();
                const templates = tplJson.data || [];

                // Use first active template as fallback (in real app, would be linked to evaluation)
                const activeTemplate = templates.find((t: any) => t.status === 'ACTIVE') || templates[0];
                if (activeTemplate) {
                    setTemplate(activeTemplate);

                    // Initialize responses
                    const allCriteria = (activeTemplate.sections || []).flatMap((s: EvaluationSection) => s.criteria || []);
                    setResponses(allCriteria.map((c: EvaluationCriteria) => ({
                        criteriaId: c.id,
                        score: 0,
                        comment: '',
                    })));
                }

                setEvalInfo({
                    targetEmployeeName: 'Nhân viên',
                    reviewerName: 'Quản lý',
                });
            } catch {
                setTemplate(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reviewId]);

    const handleScoreChange = (criteriaId: string, score: number) => {
        setResponses(prev =>
            prev.map(r => r.criteriaId === criteriaId ? { ...r, score } : r)
        );
    };

    const handleCommentChange = (criteriaId: string, comment: string) => {
        setResponses(prev =>
            prev.map(r => r.criteriaId === criteriaId ? { ...r, comment } : r)
        );
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/admin/evaluations');
        }, 1000);
    };

    const calculateProgress = () => {
        if (!template) return 0;
        const allCriteria = (template.sections || []).flatMap((s: EvaluationSection) => s.criteria || []);
        const filled = responses.filter(r => r.score > 0).length;
        return allCriteria.length > 0 ? Math.round((filled / allCriteria.length) * 100) : 0;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Không tìm thấy mẫu đánh giá</p>
                    <Button variant="link" asChild className="mt-2">
                        <Link href="/admin/evaluations">← Quay lại danh sách</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const progress = calculateProgress();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/evaluations">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Đánh giá 360°</h1>
                    <p className="text-muted-foreground">{template.name}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" disabled={isSubmitting}>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu nháp
                    </Button>
                    <Button onClick={() => setConfirmOpen(true)} disabled={progress < 100 || isSubmitting}>
                        <Send className="h-4 w-4 mr-2" />
                        Nộp đánh giá
                    </Button>
                </div>
            </div>

            {/* Target Employee Info */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="text-xl">NV</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-semibold">{evalInfo?.targetEmployeeName}</h2>
                                <p className="text-muted-foreground">Nhân viên được đánh giá</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Tiến độ hoàn thành</span>
                            <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Evaluation Sections */}
            {(template.sections || []).map((section: EvaluationSection) => (
                <Card key={section.id}>
                    <CardHeader>
                        <CardTitle>{section.name}</CardTitle>
                        <CardDescription>
                            Trọng số: {section.weight}% tổng điểm
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(section.criteria || []).map((criteria: EvaluationCriteria) => {
                            const response = responses.find(r => r.criteriaId === criteria.id) ||
                                { criteriaId: criteria.id, score: 0, comment: '' };
                            return (
                                <CriteriaInput
                                    key={criteria.id}
                                    criteria={criteria}
                                    response={response}
                                    onScoreChange={(score) => handleScoreChange(criteria.id, score)}
                                    onCommentChange={(comment) => handleCommentChange(criteria.id, comment)}
                                />
                            );
                        })}
                    </CardContent>
                </Card>
            ))}

            {/* General Comments */}
            <Card>
                <CardHeader>
                    <CardTitle>Nhận xét chung</CardTitle>
                    <CardDescription>
                        Đánh giá tổng quan về hiệu suất làm việc của nhân viên
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Nhập nhận xét chung..."
                        value={generalComments}
                        onChange={(e) => setGeneralComments(e.target.value)}
                        rows={4}
                    />
                </CardContent>
            </Card>

            {/* Submit Confirmation */}
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận nộp đánh giá</AlertDialogTitle>
                        <AlertDialogDescription>
                            Sau khi nộp, bạn sẽ không thể chỉnh sửa đánh giá này.
                            Bạn có chắc chắn muốn nộp?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>
                            Xác nhận nộp
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
