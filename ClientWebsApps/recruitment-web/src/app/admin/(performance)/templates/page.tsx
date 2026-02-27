'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ClipboardList,
    Plus,
    Eye,
    Edit,
    Copy,
    MoreHorizontal,
    Star,
    Hash,
    ListChecks,
    Layers,
    Loader2,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';

const templateTypeLabels: Record<string, { label: string; color: string }> = {
    KPI: { label: 'KPI', color: 'blue' },
    COMPETENCY: { label: 'Năng lực', color: 'green' },
    MIXED: { label: 'Tổng hợp', color: 'purple' },
};

const templateStatusLabels: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: 'Đang dùng', color: 'green' },
    DRAFT_TPL: { label: 'Nháp', color: 'gray' },
    ARCHIVED: { label: 'Lưu trữ', color: 'orange' },
};

interface EvaluationSection {
    id: string;
    name: string;
    weight: number;
    criteria: EvaluationCriteria[];
}

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

interface EvaluationTemplate {
    id: string;
    name: string;
    description: string | null;
    type: string;
    status: string;
    sections: EvaluationSection[];
}

export default function TemplatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<EvaluationTemplate | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [templates, setTemplates] = useState<EvaluationTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/evaluation-templates');
                const json = await res.json();
                setTemplates(json.data || []);
            } catch {
                setTemplates([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const getRatingScaleIcon = (type: string) => {
        switch (type) {
            case 'STARS': return <Star className="h-4 w-4" />;
            case 'NUMERIC': return <Hash className="h-4 w-4" />;
            case 'OPTIONS': return <ListChecks className="h-4 w-4" />;
            default: return null;
        }
    };

    const handlePreview = (template: EvaluationTemplate) => {
        setSelectedTemplate(template);
        setPreviewOpen(true);
    };

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ClipboardList className="h-6 w-6 text-primary" />
                        Mẫu đánh giá
                    </h1>
                    <p className="text-muted-foreground">Quản lý mẫu phiếu đánh giá nhân viên</p>
                </div>
                <Link href="/admin/templates/builder">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo mẫu mới
                    </Button>
                </Link>
            </div>

            {/* Template Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => {
                    const typeInfo = templateTypeLabels[template.type] || { label: template.type, color: 'gray' };
                    const statusInfo = templateStatusLabels[template.status] || { label: template.status, color: 'gray' };
                    const sections = template.sections || [];
                    const totalCriteria = sections.reduce(
                        (sum: number, section: EvaluationSection) => sum + (section.criteria?.length || 0),
                        0
                    );

                    return (
                        <Card key={template.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-700`}
                                    >
                                        {statusInfo.label}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handlePreview(template)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Xem trước
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Chỉnh sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Copy className="h-4 w-4 mr-2" />
                                                Nhân bản
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                <CardDescription>{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <Badge variant="secondary" className={`bg-${typeInfo.color}-100 text-${typeInfo.color}-700`}>
                                        {typeInfo.label}
                                    </Badge>
                                    <span className="flex items-center gap-1">
                                        <Layers className="h-3 w-3" />
                                        {sections.length} phần
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ClipboardList className="h-3 w-3" />
                                        {totalCriteria} tiêu chí
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={() => handlePreview(template)}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {templates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">Không có mẫu đánh giá nào</div>
            )}

            {/* Template Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    {selectedTemplate && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedTemplate.name}</DialogTitle>
                                <DialogDescription>{selectedTemplate.description}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                {(selectedTemplate.sections || []).map((section: EvaluationSection, sIndex: number) => (
                                    <div key={section.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-lg">
                                                {sIndex + 1}. {section.name}
                                            </h3>
                                            <Badge variant="outline">Trọng số: {section.weight}%</Badge>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tiêu chí</TableHead>
                                                    <TableHead className="w-[100px]">Trọng số</TableHead>
                                                    <TableHead className="w-[150px]">Thang điểm</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(section.criteria || []).map((criteria: EvaluationCriteria) => (
                                                    <TableRow key={criteria.id}>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">{criteria.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {criteria.description}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{criteria.weight}%</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                {getRatingScaleIcon(criteria.ratingScale?.type)}
                                                                <span className="text-sm">
                                                                    {criteria.ratingScale?.type === 'STARS' && `${criteria.ratingScale.max} sao`}
                                                                    {criteria.ratingScale?.type === 'NUMERIC' && `${criteria.ratingScale.min}-${criteria.ratingScale.max}`}
                                                                    {criteria.ratingScale?.type === 'OPTIONS' && `${criteria.ratingScale.options?.length} lựa chọn`}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
