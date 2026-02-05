'use client';

import { useState, useCallback } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    GripVertical,
    Plus,
    Trash2,
    Star,
    Hash,
    ListChecks,
    Edit,
    Copy,
    ChevronDown,
    ChevronUp,
    Save,
    Eye,
    ArrowLeft,
} from 'lucide-react';

// ========== TYPES ==========
export type RatingScaleType = 'NUMERIC' | 'STARS' | 'OPTIONS';

export interface RatingScale {
    type: RatingScaleType;
    min?: number;
    max?: number;
    options?: { value: number; label: string }[];
}

export interface FormCriteria {
    id: string;
    name: string;
    description: string;
    weight: number;
    ratingScale: RatingScale;
}

export interface FormSection {
    id: string;
    name: string;
    weight: number;
    expanded: boolean;
    criteria: FormCriteria[];
}

export interface FormBuilderData {
    name: string;
    description: string;
    type: 'PERFORMANCE' | 'COMPETENCY' | 'MIXED';
    sections: FormSection[];
}

// ========== DRAGGABLE COMPONENTS ==========
interface SortableCriteriaProps {
    criteria: FormCriteria;
    onEdit: () => void;
    onDelete: () => void;
}

function SortableCriteria({ criteria, onEdit, onDelete }: SortableCriteriaProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: criteria.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getRatingIcon = (type: string) => {
        switch (type) {
            case 'STARS': return <Star className="h-4 w-4 text-yellow-500" />;
            case 'NUMERIC': return <Hash className="h-4 w-4 text-blue-500" />;
            case 'OPTIONS': return <ListChecks className="h-4 w-4 text-green-500" />;
            default: return null;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-transparent hover:border-primary/20 transition-colors"
        >
            <button
                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{criteria.name}</span>
                    {getRatingIcon(criteria.ratingScale.type)}
                </div>
                <p className="text-xs text-muted-foreground truncate">{criteria.description}</p>
            </div>
            <Badge variant="outline">{criteria.weight}%</Badge>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

interface SortableSectionProps {
    section: FormSection;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onAddCriteria: () => void;
    onEditCriteria: (criteriaId: string) => void;
    onDeleteCriteria: (criteriaId: string) => void;
}

function SortableSection({
    section,
    onToggle,
    onEdit,
    onDelete,
    onAddCriteria,
    onEditCriteria,
    onDeleteCriteria,
}: SortableSectionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card ref={setNodeRef} style={style} className="border-2">
            <CardHeader className="py-3">
                <div className="flex items-center gap-3">
                    <button
                        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="h-5 w-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base flex items-center gap-2">
                            {section.name}
                            <Badge variant="secondary">{section.weight}%</Badge>
                            <Badge variant="outline">{section.criteria.length} tiêu chí</Badge>
                        </CardTitle>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
                            {section.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={onDelete}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            {section.expanded && (
                <CardContent className="pt-0 space-y-2">
                    <SortableContext
                        items={section.criteria.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {section.criteria.map((criteria) => (
                            <SortableCriteria
                                key={criteria.id}
                                criteria={criteria}
                                onEdit={() => onEditCriteria(criteria.id)}
                                onDelete={() => onDeleteCriteria(criteria.id)}
                            />
                        ))}
                    </SortableContext>
                    <Button
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={onAddCriteria}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm tiêu chí
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}

// ========== MAIN COMPONENT ==========
interface FormBuilderProps {
    initialData?: FormBuilderData;
    onSave?: (data: FormBuilderData) => void;
    onCancel?: () => void;
}

export default function FormBuilder({ initialData, onSave, onCancel }: FormBuilderProps) {
    const [formData, setFormData] = useState<FormBuilderData>(
        initialData || {
            name: '',
            description: '',
            type: 'PERFORMANCE',
            sections: [],
        }
    );

    const [activeId, setActiveId] = useState<string | null>(null);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [editingCriteriaId, setEditingCriteriaId] = useState<string | null>(null);
    const [editingInSectionId, setEditingInSectionId] = useState<string | null>(null);

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Generate unique ID
    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // ========== SECTION HANDLERS ==========
    const handleAddSection = () => {
        const newSection: FormSection = {
            id: generateId(),
            name: `Phần ${formData.sections.length + 1}`,
            weight: 0,
            expanded: true,
            criteria: [],
        };
        setFormData(prev => ({
            ...prev,
            sections: [...prev.sections, newSection],
        }));
    };

    const handleUpdateSection = (sectionId: string, updates: Partial<FormSection>) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId ? { ...s, ...updates } : s
            ),
        }));
    };

    const handleDeleteSection = (sectionId: string) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== sectionId),
        }));
    };

    const handleToggleSection = (sectionId: string) => {
        handleUpdateSection(sectionId, {
            expanded: !formData.sections.find(s => s.id === sectionId)?.expanded,
        });
    };

    // ========== CRITERIA HANDLERS ==========
    const handleAddCriteria = (sectionId: string) => {
        const newCriteria: FormCriteria = {
            id: generateId(),
            name: 'Tiêu chí mới',
            description: '',
            weight: 0,
            ratingScale: { type: 'STARS', max: 5 },
        };
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? { ...s, criteria: [...s.criteria, newCriteria] }
                    : s
            ),
        }));
        setEditingCriteriaId(newCriteria.id);
        setEditingInSectionId(sectionId);
    };

    const handleUpdateCriteria = (sectionId: string, criteriaId: string, updates: Partial<FormCriteria>) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? {
                        ...s,
                        criteria: s.criteria.map(c =>
                            c.id === criteriaId ? { ...c, ...updates } : c
                        ),
                    }
                    : s
            ),
        }));
    };

    const handleDeleteCriteria = (sectionId: string, criteriaId: string) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? { ...s, criteria: s.criteria.filter(c => c.id !== criteriaId) }
                    : s
            ),
        }));
    };

    // ========== DRAG HANDLERS ==========
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        // Check if dragging sections
        const activeSection = formData.sections.find(s => s.id === active.id);
        const overSection = formData.sections.find(s => s.id === over.id);

        if (activeSection && overSection) {
            // Reorder sections
            const oldIndex = formData.sections.findIndex(s => s.id === active.id);
            const newIndex = formData.sections.findIndex(s => s.id === over.id);
            setFormData(prev => ({
                ...prev,
                sections: arrayMove(prev.sections, oldIndex, newIndex),
            }));
            return;
        }

        // Otherwise, check criteria dragging within same section
        for (const section of formData.sections) {
            const activeCriteria = section.criteria.find(c => c.id === active.id);
            const overCriteria = section.criteria.find(c => c.id === over.id);

            if (activeCriteria && overCriteria) {
                const oldIndex = section.criteria.findIndex(c => c.id === active.id);
                const newIndex = section.criteria.findIndex(c => c.id === over.id);
                setFormData(prev => ({
                    ...prev,
                    sections: prev.sections.map(s =>
                        s.id === section.id
                            ? { ...s, criteria: arrayMove(s.criteria, oldIndex, newIndex) }
                            : s
                    ),
                }));
                break;
            }
        }
    };

    // Get currently editing criteria
    const getEditingCriteria = () => {
        if (!editingCriteriaId || !editingInSectionId) return null;
        const section = formData.sections.find(s => s.id === editingInSectionId);
        return section?.criteria.find(c => c.id === editingCriteriaId);
    };

    const editingCriteria = getEditingCriteria();

    // Calculate total weight
    const totalSectionWeight = formData.sections.reduce((sum, s) => sum + s.weight, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {onCancel && (
                        <Button variant="ghost" onClick={onCancel}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">Form Builder</h1>
                        <p className="text-muted-foreground">Kéo thả để sắp xếp các phần và tiêu chí</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem trước
                    </Button>
                    <Button onClick={() => onSave?.(formData)}>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu mẫu
                    </Button>
                </div>
            </div>

            {/* Form Info */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tên mẫu đánh giá</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="VD: Đánh giá hiệu suất quý"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Loại đánh giá</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'PERFORMANCE' | 'COMPETENCY' | 'MIXED' }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PERFORMANCE">Hiệu suất</SelectItem>
                                    <SelectItem value="COMPETENCY">Năng lực</SelectItem>
                                    <SelectItem value="MIXED">Kết hợp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Mô tả</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Mô tả mục đích và phạm vi của mẫu đánh giá"
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Weight Summary */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">Tổng trọng số các phần:</span>
                <Badge variant={totalSectionWeight === 100 ? 'default' : 'destructive'}>
                    {totalSectionWeight}% / 100%
                </Badge>
            </div>

            {/* Sections */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={formData.sections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {formData.sections.map((section) => (
                            <SortableSection
                                key={section.id}
                                section={section}
                                onToggle={() => handleToggleSection(section.id)}
                                onEdit={() => setEditingSectionId(section.id)}
                                onDelete={() => handleDeleteSection(section.id)}
                                onAddCriteria={() => handleAddCriteria(section.id)}
                                onEditCriteria={(criteriaId) => {
                                    setEditingCriteriaId(criteriaId);
                                    setEditingInSectionId(section.id);
                                }}
                                onDeleteCriteria={(criteriaId) => handleDeleteCriteria(section.id, criteriaId)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Add Section Button */}
            <Button
                variant="outline"
                className="w-full border-dashed h-16 text-muted-foreground"
                onClick={handleAddSection}
            >
                <Plus className="h-5 w-5 mr-2" />
                Thêm phần mới
            </Button>

            {/* Edit Section Dialog */}
            <Dialog open={!!editingSectionId} onOpenChange={() => setEditingSectionId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa phần</DialogTitle>
                    </DialogHeader>
                    {editingSectionId && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Tên phần</Label>
                                <Input
                                    value={formData.sections.find(s => s.id === editingSectionId)?.name || ''}
                                    onChange={(e) => handleUpdateSection(editingSectionId, { name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Trọng số (%)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.sections.find(s => s.id === editingSectionId)?.weight || 0}
                                    onChange={(e) => handleUpdateSection(editingSectionId, { weight: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setEditingSectionId(null)}>Xong</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Criteria Dialog */}
            <Dialog
                open={!!editingCriteriaId}
                onOpenChange={() => {
                    setEditingCriteriaId(null);
                    setEditingInSectionId(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa tiêu chí</DialogTitle>
                    </DialogHeader>
                    {editingCriteria && editingInSectionId && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Tên tiêu chí</Label>
                                <Input
                                    value={editingCriteria.name}
                                    onChange={(e) => handleUpdateCriteria(editingInSectionId, editingCriteria.id, { name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Mô tả</Label>
                                <Textarea
                                    value={editingCriteria.description}
                                    onChange={(e) => handleUpdateCriteria(editingInSectionId, editingCriteria.id, { description: e.target.value })}
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Trọng số (%)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={editingCriteria.weight}
                                        onChange={(e) => handleUpdateCriteria(editingInSectionId, editingCriteria.id, { weight: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Loại thang điểm</Label>
                                    <Select
                                        value={editingCriteria.ratingScale.type}
                                        onValueChange={(value) => {
                                            const type = value as RatingScaleType;
                                            let newScale: RatingScale;
                                            switch (type) {
                                                case 'STARS':
                                                    newScale = { type, max: 5 };
                                                    break;
                                                case 'NUMERIC':
                                                    newScale = { type, min: 0, max: 100 };
                                                    break;
                                                case 'OPTIONS':
                                                    newScale = {
                                                        type,
                                                        options: [
                                                            { value: 1, label: 'Kém' },
                                                            { value: 2, label: 'Trung bình' },
                                                            { value: 3, label: 'Khá' },
                                                            { value: 4, label: 'Tốt' },
                                                            { value: 5, label: 'Xuất sắc' },
                                                        ],
                                                    };
                                                    break;
                                            }
                                            handleUpdateCriteria(editingInSectionId, editingCriteria.id, { ratingScale: newScale });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="STARS">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-4 w-4" />
                                                    Sao (1-5)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="NUMERIC">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="h-4 w-4" />
                                                    Số (0-100)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="OPTIONS">
                                                <div className="flex items-center gap-2">
                                                    <ListChecks className="h-4 w-4" />
                                                    Lựa chọn
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                setEditingCriteriaId(null);
                                setEditingInSectionId(null);
                            }}
                        >
                            Xong
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
