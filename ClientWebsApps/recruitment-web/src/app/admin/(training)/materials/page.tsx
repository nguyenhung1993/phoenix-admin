'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    mockMaterials,
    getCourses,
    Material,
    MaterialType
} from '@/lib/mocks/training';
import {
    FileText,
    Video,
    File,
    Link as LinkIcon,
    Presentation,
    Upload,
    Search,
    Download,
    Eye,
    Trash2,
    FolderOpen,
} from 'lucide-react';
import { toast } from 'sonner';

// Icon mapping for material types
const materialIcons: Record<MaterialType, React.ReactNode> = {
    pdf: <FileText className="h-5 w-5 text-red-500" />,
    video: <Video className="h-5 w-5 text-blue-500" />,
    slide: <Presentation className="h-5 w-5 text-orange-500" />,
    link: <LinkIcon className="h-5 w-5 text-green-500" />,
};

const materialLabels: Record<MaterialType, string> = {
    pdf: 'Tài liệu PDF',
    video: 'Video',
    slide: 'Slide bài giảng',
    link: 'Liên kết ngoài',
};

export default function MaterialsPage() {
    const [materials, setMaterials] = useState<Material[]>(mockMaterials);
    const [courseFilter, setCourseFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const courses = getCourses();

    const filteredMaterials = materials.filter((mat) => {
        const matchesCourse = courseFilter === 'ALL' || mat.courseId === courseFilter;
        const matchesSearch = mat.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCourse && matchesSearch;
    });

    const getCourseName = (courseId: string) => {
        return courses.find(c => c.id === courseId)?.title || 'Unknown Course';
    };

    const stats = {
        total: materials.length,
        pdf: materials.filter(m => m.type === 'pdf').length,
        video: materials.filter(m => m.type === 'video').length,
        slide: materials.filter(m => m.type === 'slide').length,
    };

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
            setMaterials(materials.filter(m => m.id !== id));
            toast.success('Đã xóa tài liệu');
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Kho tài liệu</h1>
                    <p className="text-muted-foreground">Quản lý tài liệu đào tạo (PDF, Video, Slide...)</p>
                </div>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Tải lên tài liệu
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng tài liệu</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <FolderOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">PDF</p>
                                <p className="text-2xl font-bold text-red-600">{stats.pdf}</p>
                            </div>
                            <FileText className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Video</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.video}</p>
                            </div>
                            <Video className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Slides</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.slide}</p>
                            </div>
                            <Presentation className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm tài liệu..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Lọc theo khóa học" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả khóa học</SelectItem>
                        {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                                {course.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Materials Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách tài liệu</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên tài liệu</TableHead>
                                <TableHead>Khóa học</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead className="text-right">Kích thước</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMaterials.map((material) => (
                                <TableRow key={material.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {materialIcons[material.type]}
                                            <span className="font-medium">{material.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{getCourseName(material.courseId)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{materialLabels[material.type]}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm">
                                        {material.size || '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(material.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredMaterials.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không tìm thấy tài liệu nào
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
