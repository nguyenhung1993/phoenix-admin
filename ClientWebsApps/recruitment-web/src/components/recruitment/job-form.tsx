'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    JobItem,
    JobTypeValues,
    JobStatusValues,
    jobTypeLabels,
    jobStatusLabels,
} from '@/lib/schemas/recruitment';

interface Department {
    id: string;
    name: string;
    code: string;
}

interface JobFormProps {
    initialData?: JobItem;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function JobForm({ initialData }: JobFormProps) {
    const router = useRouter();
    const isEditing = !!initialData;
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);

    // Form state
    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [departmentId, setDepartmentId] = useState(initialData?.departmentId || '');
    const [location, setLocation] = useState(initialData?.location || '');
    const [type, setType] = useState<string>(initialData?.type || 'FULL_TIME');
    const [experienceLevel, setExperienceLevel] = useState(initialData?.experienceLevel || '');
    const [salaryMin, setSalaryMin] = useState(initialData?.salaryMin?.toString() || '');
    const [salaryMax, setSalaryMax] = useState(initialData?.salaryMax?.toString() || '');
    const [status, setStatus] = useState<string>(initialData?.status || 'DRAFT');
    const [description, setDescription] = useState(initialData?.description || '');
    const [requirements, setRequirements] = useState<string[]>(initialData?.requirements || ['']);
    const [benefits, setBenefits] = useState<string[]>(initialData?.benefits || ['']);

    // Auto-generate slug from title
    useEffect(() => {
        if (!isEditing && title) {
            setSlug(slugify(title));
        }
    }, [title, isEditing]);

    // Fetch departments
    useEffect(() => {
        fetch('/api/departments')
            .then(res => res.json())
            .then(data => setDepartments(Array.isArray(data) ? data : data.data || data.departments || []))
            .catch(() => console.warn('Could not load departments'));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !slug.trim()) {
            toast.error('Vui lòng nhập tiêu đề và slug');
            return;
        }

        try {
            setLoading(true);
            const body = {
                title: title.trim(),
                slug: slug.trim(),
                departmentId: departmentId || null,
                location: location.trim() || null,
                type,
                experienceLevel: experienceLevel.trim() || null,
                salaryMin: salaryMin ? parseFloat(salaryMin) : null,
                salaryMax: salaryMax ? parseFloat(salaryMax) : null,
                status,
                description: description.trim() || null,
                requirements: requirements.filter(r => r.trim()),
                benefits: benefits.filter(b => b.trim()),
            };

            const url = isEditing ? `/api/jobs/${initialData.id}` : '/api/jobs';
            const method = isEditing ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Có lỗi xảy ra');
            }

            toast.success(isEditing ? 'Đã cập nhật vị trí' : 'Đã tạo vị trí mới');
            router.push('/admin/jobs');
            router.refresh();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, '']);
    };

    const updateListItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
        value: string
    ) => {
        setter(prev => prev.map((item, i) => (i === index ? value : item)));
    };

    const removeListItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number
    ) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/jobs">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">
                        {isEditing ? 'Chỉnh sửa vị trí' : 'Tạo vị trí mới'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditing ? `Đang chỉnh sửa: ${initialData.title}` : 'Điền thông tin để đăng tin tuyển dụng'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Tiêu đề vị trí *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="VD: Senior Frontend Developer"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    placeholder="senior-frontend-developer"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Phòng ban</Label>
                                <Select value={departmentId} onValueChange={setDepartmentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phòng ban" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(d => (
                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Loại hình</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JobTypeValues.map(t => (
                                            <SelectItem key={t} value={t}>{jobTypeLabels[t]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Trạng thái</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JobStatusValues.map(s => (
                                            <SelectItem key={s} value={s}>
                                                <Badge variant={jobStatusLabels[s].variant} className="mr-2">
                                                    {jobStatusLabels[s].label}
                                                </Badge>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Địa điểm</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="TP. Hồ Chí Minh"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">Kinh nghiệm</Label>
                                <Input
                                    id="experience"
                                    value={experienceLevel}
                                    onChange={e => setExperienceLevel(e.target.value)}
                                    placeholder="3-5 năm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salaryMin">Lương tối thiểu (VNĐ)</Label>
                                <Input
                                    id="salaryMin"
                                    type="number"
                                    value={salaryMin}
                                    onChange={e => setSalaryMin(e.target.value)}
                                    placeholder="20000000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salaryMax">Lương tối đa (VNĐ)</Label>
                                <Input
                                    id="salaryMax"
                                    type="number"
                                    value={salaryMax}
                                    onChange={e => setSalaryMax(e.target.value)}
                                    placeholder="40000000"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mô tả công việc</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Mô tả chi tiết về vị trí tuyển dụng..."
                            rows={5}
                        />
                    </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Yêu cầu</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => addListItem(setRequirements)}>
                            <Plus className="h-4 w-4 mr-1" /> Thêm
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {requirements.map((req, i) => (
                            <div key={i} className="flex gap-2">
                                <Input
                                    value={req}
                                    onChange={e => updateListItem(setRequirements, i, e.target.value)}
                                    placeholder={`Yêu cầu ${i + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeListItem(setRequirements, i)}
                                    className="shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Benefits */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Quyền lợi</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => addListItem(setBenefits)}>
                            <Plus className="h-4 w-4 mr-1" /> Thêm
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {benefits.map((ben, i) => (
                            <div key={i} className="flex gap-2">
                                <Input
                                    value={ben}
                                    onChange={e => updateListItem(setBenefits, i, e.target.value)}
                                    placeholder={`Quyền lợi ${i + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeListItem(setBenefits, i)}
                                    className="shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {isEditing ? 'Cập nhật' : 'Tạo vị trí'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Hủy
                    </Button>
                </div>
            </form>
        </div>
    );
}
