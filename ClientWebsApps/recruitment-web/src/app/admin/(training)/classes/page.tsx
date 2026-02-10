'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, Eye, Calendar, MapPin, User, Clock } from 'lucide-react';
import {
    getAllClasses,
    getCourses,
    Class,
    ClassStatus,
    mockClasses as initialClasses
} from '@/lib/mocks/training';
import { toast } from 'sonner';

export default function ClassesPage() {
    const [classes, setClasses] = useState<Class[]>(initialClasses);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ClassStatus | 'ALL'>('ALL');

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Class>>({
        courseId: '',
        code: '',
        startDate: '',
        endDate: '',
        instructor: '',
        capacity: 20,
        enrolled: 0,
        status: 'scheduled',
        location: '',
    });

    const courses = getCourses();

    const filteredClasses = classes.filter(cls => {
        const matchesSearch = cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || cls.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getCourseName = (courseId: string) => {
        return courses.find(c => c.id === courseId)?.title || 'Unknown Course';
    };

    const handleOpenCreate = () => {
        setFormData({
            courseId: '',
            code: `CLS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            startDate: '',
            endDate: '',
            instructor: '',
            capacity: 20,
            enrolled: 0,
            status: 'scheduled',
            location: '',
        });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.courseId || !formData.startDate || !formData.instructor) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const newClass: Class = {
            ...formData as Class,
            id: `cls_${Math.random().toString(36).substr(2, 9)}`,
        };

        setClasses([newClass, ...classes]);
        toast.success('Lên lịch lớp học thành công');
        setIsDialogOpen(false);
    };

    const getStatusColor = (status: ClassStatus) => {
        switch (status) {
            case 'scheduled': return 'secondary';
            case 'ongoing': return 'default'; // primary/green often
            case 'completed': return 'outline';
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    const getStatusLabel = (status: ClassStatus) => {
        switch (status) {
            case 'scheduled': return 'Đã lên lịch';
            case 'ongoing': return 'Đang diễn ra';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Lớp học</h1>
                    <p className="text-muted-foreground">Lên lịch và theo dõi các lớp đào tạo</p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo lớp học mới
                </Button>
            </div>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm mã lớp, giảng viên..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ClassStatus | 'ALL')}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                        <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                        <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách lớp học ({filteredClasses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã lớp / Khóa học</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead>Địa điểm / Giảng viên</TableHead>
                                <TableHead>Sĩ số</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClasses.map((cls) => {
                                const fillRate = (cls.enrolled / cls.capacity) * 100;
                                return (
                                    <TableRow key={cls.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{cls.code}</span>
                                                <span className="text-sm text-muted-foreground">{getCourseName(cls.courseId)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    <span>{cls.startDate}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>Đến {cls.endDate}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    <span>{cls.location || 'Online'}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <User className="h-3 w-3" />
                                                    <span>{cls.instructor}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="w-[120px] space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span>{cls.enrolled}/{cls.capacity}</span>
                                                    <span>{Math.round(fillRate)}%</span>
                                                </div>
                                                <Progress value={fillRate} className="h-2" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(cls.status)}>
                                                {getStatusLabel(cls.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tạo lớp học mới</DialogTitle>
                        <DialogDescription>Lên lịch cho một khóa học cụ thể</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Khóa học</Label>
                            <Select
                                value={formData.courseId}
                                onValueChange={(val) => setFormData({ ...formData, courseId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn khóa học" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày bắt đầu</Label>
                                <Input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày kết thúc</Label>
                                <Input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Giảng viên</Label>
                            <Input
                                value={formData.instructor}
                                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                placeholder="Tên giảng viên"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Địa điểm</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Phòng họp / Link Zoom..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Sĩ số tối đa</Label>
                            <Input
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSave}>Lưu lớp học</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
