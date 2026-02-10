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
    mockEvaluation360s,
    mockEvaluationTemplates,
    reviewerTypeLabels,
    Review360,
    EvaluationTemplate,
    EvaluationSection,
    EvaluationCriteria,
    CriteriaResponse,
} from '@/lib/mocks';
import {
    ArrowLeft,
    Star,
    Send,
    Save,
    User,
    CheckCircle,
    AlertCircle,
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
        switch (criteria.ratingScale.type) {
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
                    <Badge variant="outline" className="text-xs">Điểm tối đa: {criteria.maxScore}</Badge>
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

    const [review, setReview] = useState<Review360 | null>(null);
    const [evaluation, setEvaluation] = useState<typeof mockEvaluation360s[0] | null>(null);
    const [template, setTemplate] = useState<EvaluationTemplate | null>(null);
    const [responses, setResponses] = useState<CriteriaResponse[]>([]);
    const [generalComments, setGeneralComments] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Find review and evaluation data
    useEffect(() => {
        for (const eval360 of mockEvaluation360s) {
            const foundReview = eval360.reviews.find(r => r.id === reviewId);
            if (foundReview) {
                setReview(foundReview);
                setEvaluation(eval360);
                setGeneralComments(foundReview.comments || '');

                // Find template
                const foundTemplate = mockEvaluationTemplates.find(t => t.id === eval360.templateId);
                if (foundTemplate) {
                    setTemplate(foundTemplate);

                    // Initialize responses for all criteria
                    const allCriteria = foundTemplate.sections.flatMap(s => s.criteria);
                    const initialResponses = allCriteria.map(c => {
                        const existing = foundReview.responses.find(r => r.criteriaId === c.id);
                        return existing || { criteriaId: c.id, score: 0, comment: '' };
                    });
                    setResponses(initialResponses);
                }
                break;
            }
        }
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
        // In real app, call API here
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/admin/evaluations');
        }, 1000);
    };

    const calculateProgress = () => {
        if (!template) return 0;
        const allCriteria = template.sections.flatMap(s => s.criteria);
        const filled = responses.filter(r => r.score > 0).length;
        return Math.round((filled / allCriteria.length) * 100);
    };

    if (!review || !evaluation || !template) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Không tìm thấy đánh giá</p>
                    <Button variant="link" asChild className="mt-2">
                        <Link href="/admin/evaluations">← Quay lại danh sách</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (review.status === 'SUBMITTED') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">Bạn đã hoàn thành đánh giá này</p>
                    <p className="text-muted-foreground">Ngày nộp: {review.submittedAt}</p>
                    <Button variant="link" asChild className="mt-2">
                        <Link href="/admin/evaluations">← Quay lại danh sách</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const typeInfo = reviewerTypeLabels[review.reviewerType];
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
                    <p className="text-muted-foreground">
                        {evaluation.periodName} • {template.name}
                    </p>
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
                                <AvatarFallback className="text-xl">
                                    {evaluation.targetEmployeeName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-semibold">{evaluation.targetEmployeeName}</h2>
                                <p className="text-muted-foreground">Nhân viên được đánh giá</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge className={`bg-${typeInfo.color}-100 text-${typeInfo.color}-700`}>
                                <User className="h-3 w-3 mr-1" />
                                {typeInfo.label}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                                Người đánh giá: {review.reviewerName}
                            </p>
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
            {template.sections.map((section) => (
                <Card key={section.id}>
                    <CardHeader>
                        <CardTitle>{section.name}</CardTitle>
                        <CardDescription>
                            Trọng số: {section.weight}% tổng điểm
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {section.criteria.map((criteria) => {
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
