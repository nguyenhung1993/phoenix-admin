'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
    mockTrainingMaterials,
    mockCourses,
    materialTypeLabels,
    TrainingMaterial,
    MaterialType,
} from '@/lib/mocks';
import {
    FileText,
    Video,
    File,
    Link,
    Presentation,
    Upload,
    Search,
    Download,
    Eye,
    Trash2,
    FolderOpen,
} from 'lucide-react';

// Icon mapping for material types
const materialIcons: Record<MaterialType, React.ReactNode> = {
    PDF: <FileText className="h-5 w-5 text-red-500" />,
    VIDEO: <Video className="h-5 w-5 text-blue-500" />,
    DOCUMENT: <File className="h-5 w-5 text-gray-500" />,
    SLIDE: <Presentation className="h-5 w-5 text-orange-500" />,
    LINK: <Link className="h-5 w-5 text-green-500" />,
};

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function MaterialsPage() {
    const [courseFilter, setCourseFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMaterials = mockTrainingMaterials.filter((mat) => {
        const matchesCourse = courseFilter === 'ALL' || mat.courseId === courseFilter;
        const matchesSearch = mat.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCourse && matchesSearch;
    });

    const stats = {
        total: mockTrainingMaterials.length,
        pdf: mockTrainingMaterials.filter(m => m.type === 'PDF').length,
        video: mockTrainingMaterials.filter(m => m.type === 'VIDEO').length,
        other: mockTrainingMaterials.filter(m => !['PDF', 'VIDEO'].includes(m.type)).length,
    };

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
                                <p className="text-sm text-muted-foreground">Khác</p>
                                <p className="text-2xl font-bold">{stats.other}</p>
                            </div>
                            <File className="h-8 w-8 text-muted-foreground" />
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
                        {mockCourses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                                {course.name}
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
                                <TableHead>Người tải lên</TableHead>
                                <TableHead>Ngày tải</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMaterials.map((material) => (
                                <TableRow key={material.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {materialIcons[material.type]}
                                            <span className="font-medium">{material.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{material.courseName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{materialTypeLabels[material.type].label}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm">
                                        {material.size ? formatFileSize(material.size) : '-'}
                                    </TableCell>
                                    <TableCell>{material.uploadedBy}</TableCell>
                                    <TableCell>{new Date(material.uploadedAt).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-600">
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
