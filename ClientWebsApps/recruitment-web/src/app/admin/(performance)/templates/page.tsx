'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    mockEvaluationTemplates,
    templateTypeLabels,
    templateStatusLabels,
    EvaluationTemplate,
} from '@/lib/mocks';
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

export default function TemplatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<EvaluationTemplate | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

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
                {mockEvaluationTemplates.map((template) => {
                    const typeInfo = templateTypeLabels[template.type];
                    const statusInfo = templateStatusLabels[template.status];
                    const totalCriteria = template.sections.reduce(
                        (sum, section) => sum + section.criteria.length,
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
                                        {template.sections.length} phần
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
                                {selectedTemplate.sections.map((section, sIndex) => (
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
                                                {section.criteria.map((criteria) => (
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
                                                                {getRatingScaleIcon(criteria.ratingScale.type)}
                                                                <span className="text-sm">
                                                                    {criteria.ratingScale.type === 'STARS' && `${criteria.ratingScale.max} sao`}
                                                                    {criteria.ratingScale.type === 'NUMERIC' && `${criteria.ratingScale.min}-${criteria.ratingScale.max}`}
                                                                    {criteria.ratingScale.type === 'OPTIONS' && `${criteria.ratingScale.options?.length} lựa chọn`}
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
