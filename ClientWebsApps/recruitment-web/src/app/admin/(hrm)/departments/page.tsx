'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { buildDeptTree } from '@/lib/tree-utils';
import OrgChart from '@/components/admin/org-chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Search,
    Plus,
    Pencil,
    Building,
    Users,
    User,
    ChevronRight,
    List,
    Network,
    Loader2,
} from 'lucide-react';

interface Department {
    id: string;
    code: string;
    name: string;
    parentId: string | null;
    managerId: string | null;
    isActive: boolean;
    employeeCount: number;
    managerName: string | null;
}

export default function AdminDepartmentsPage() {
    const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
    const [search, setSearch] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    // Create form state
    const [newCode, setNewCode] = useState('');
    const [newName, setNewName] = useState('');

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/departments');
            const json = await res.json();
            setDepartments(json.data || []);
        } catch {
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDepartments(); }, []);

    const filteredDepartments = departments.filter((dept) =>
        dept.name.toLowerCase().includes(search.toLowerCase()) ||
        dept.code.toLowerCase().includes(search.toLowerCase())
    );

    const totalEmployees = departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0);
    const chartData = buildDeptTree(departments as any);

    const handleCreate = async () => {
        if (!newCode || !newName) {
            toast.error('Vui lòng nhập mã và tên phòng ban');
            return;
        }
        try {
            const res = await fetch('/api/departments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: newCode, name: newName }),
            });
            if (res.ok) {
                setCreateDialogOpen(false);
                setNewCode('');
                setNewName('');
                toast.success('Đã tạo phòng ban mới thành công!');
                fetchDepartments();
            } else {
                const err = await res.json();
                toast.error(err.error || 'Lỗi tạo phòng ban');
            }
        } catch {
            toast.error('Lỗi kết nối server');
        }
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
                    <h1 className="text-2xl font-bold">Quản lý phòng ban</h1>
                    <p className="text-muted-foreground">Cơ cấu tổ chức công ty</p>
                </div>
                <div className="flex items-center gap-2">
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'chart')}>
                        <TabsList>
                            <TabsTrigger value="list" className="gap-2">
                                <List className="h-4 w-4" />
                                <span className="hidden sm:inline">Danh sách</span>
                            </TabsTrigger>
                            <TabsTrigger value="chart" className="gap-2">
                                <Network className="h-4 w-4" />
                                <span className="hidden sm:inline">Sơ đồ</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Thêm phòng ban</span>
                    </Button>
                </div>
            </div>

            {/* Summary - Only show in list view */}
            {viewMode === 'list' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Tổng phòng ban</p>
                                    <p className="text-2xl font-bold">{departments.length}</p>
                                </div>
                                <Building className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Tổng nhân viên</p>
                                    <p className="text-2xl font-bold">{totalEmployees}</p>
                                </div>
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">TB nhân viên/PB</p>
                                    <p className="text-2xl font-bold">{departments.length > 0 ? Math.round(totalEmployees / departments.length) : 0}</p>
                                </div>
                                <User className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {viewMode === 'chart' ? (
                <OrgChart data={chartData} />
            ) : (
                <div className="space-y-6">
                    {/* Department Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDepartments.map((dept) => (
                            <Card key={dept.id} className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                    setSelectedDepartment(dept);
                                    setEditDialogOpen(true);
                                }}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Building className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{dept.name}</h3>
                                                <p className="text-sm text-muted-foreground">{dept.code}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>{dept.employeeCount} nhân viên</span>
                                        </div>
                                        {dept.managerName && (
                                            <span className="text-sm">{dept.managerName}</span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Table View */}
                    <Card>
                        <CardHeader>
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm phòng ban..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã</TableHead>
                                        <TableHead>Tên phòng ban</TableHead>
                                        <TableHead>Trưởng phòng</TableHead>
                                        <TableHead>Số nhân viên</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDepartments.map((dept) => (
                                        <TableRow key={dept.id}>
                                            <TableCell className="font-mono">{dept.code}</TableCell>
                                            <TableCell className="font-medium">{dept.name}</TableCell>
                                            <TableCell>{dept.managerName || '-'}</TableCell>
                                            <TableCell>{dept.employeeCount}</TableCell>
                                            <TableCell>
                                                <Badge variant={dept.isActive ? 'default' : 'secondary'}>
                                                    {dept.isActive ? 'Hoạt động' : 'Ngừng'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedDepartment(dept);
                                                        setEditDialogOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    {selectedDepartment && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Chỉnh sửa phòng ban</DialogTitle>
                                <DialogDescription>{selectedDepartment.code}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Mã phòng ban</Label>
                                    <Input defaultValue={selectedDepartment.code} />
                                </div>
                                <div>
                                    <Label>Tên phòng ban</Label>
                                    <Input defaultValue={selectedDepartment.name} />
                                </div>
                                <div>
                                    <Label>Trưởng phòng</Label>
                                    <Input defaultValue={selectedDepartment.managerName || ''} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Hủy</Button>
                                <Button onClick={() => {
                                    setEditDialogOpen(false);
                                    toast.success('Đã cập nhật phòng ban thành công!');
                                }}>Lưu</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm phòng ban mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Mã phòng ban</Label>
                            <Input placeholder="VD: SALES" value={newCode} onChange={(e) => setNewCode(e.target.value)} />
                        </div>
                        <div>
                            <Label>Tên phòng ban</Label>
                            <Input placeholder="VD: Kinh doanh" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleCreate}>Tạo</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
