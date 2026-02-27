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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Pencil, Briefcase, Loader2 } from 'lucide-react';

const levelLabels: Record<string, { label: string; color: string }> = {
    INTERN: { label: 'Thực tập', color: 'bg-gray-100 text-gray-700' },
    JUNIOR: { label: 'Junior', color: 'bg-blue-100 text-blue-700' },
    SENIOR: { label: 'Senior', color: 'bg-green-100 text-green-700' },
    LEAD: { label: 'Lead', color: 'bg-purple-100 text-purple-700' },
    MANAGER: { label: 'Manager', color: 'bg-orange-100 text-orange-700' },
    DIRECTOR: { label: 'Director', color: 'bg-red-100 text-red-700' },
};

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

interface Position {
    id: string;
    code: string;
    name: string;
    level: string;
    minSalary: number;
    maxSalary: number;
    departmentId: string | null;
    departmentName: string | null;
    isActive: boolean;
    employeeCount: number;
}

export default function AdminPositionsPage() {
    const [search, setSearch] = useState('');
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPositions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/positions');
            const json = await res.json();
            setPositions(json.data || []);
        } catch {
            setPositions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPositions(); }, []);

    const filteredPositions = positions.filter((pos) =>
        pos.name.toLowerCase().includes(search.toLowerCase()) ||
        pos.code.toLowerCase().includes(search.toLowerCase())
    );

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
                    <h1 className="text-2xl font-bold">Quản lý chức vụ</h1>
                    <p className="text-muted-foreground">Danh mục vị trí và mức lương</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm chức vụ
                </Button>
            </div>

            {/* Summary by Level */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(levelLabels).map(([level, info]) => {
                    const count = positions.filter(p => p.level === level).length;
                    return (
                        <Card key={level}>
                            <CardContent className="pt-4 pb-4 text-center">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${info.color}`}>
                                    {info.label}
                                </span>
                                <p className="text-2xl font-bold mt-2">{count}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm chức vụ..."
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
                                <TableHead>Tên chức vụ</TableHead>
                                <TableHead>Cấp bậc</TableHead>
                                <TableHead>Lương tối thiểu</TableHead>
                                <TableHead>Lương tối đa</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPositions.map((pos) => {
                                const levelStyle = levelLabels[pos.level] || { label: pos.level, color: 'bg-gray-100' };
                                return (
                                    <TableRow key={pos.id}>
                                        <TableCell className="font-mono">{pos.code}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{pos.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${levelStyle.color}`}>
                                                {levelStyle.label}
                                            </span>
                                        </TableCell>
                                        <TableCell>{formatCurrency(pos.minSalary)}</TableCell>
                                        <TableCell>{formatCurrency(pos.maxSalary)}</TableCell>
                                        <TableCell>
                                            <Badge variant={pos.isActive ? 'default' : 'secondary'}>
                                                {pos.isActive ? 'Hoạt động' : 'Ngừng'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedPosition(pos);
                                                    setEditDialogOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    {selectedPosition && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Chỉnh sửa chức vụ</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Mã</Label>
                                        <Input defaultValue={selectedPosition.code} />
                                    </div>
                                    <div>
                                        <Label>Tên chức vụ</Label>
                                        <Input defaultValue={selectedPosition.name} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Lương tối thiểu</Label>
                                        <Input type="number" defaultValue={selectedPosition.minSalary} />
                                    </div>
                                    <div>
                                        <Label>Lương tối đa</Label>
                                        <Input type="number" defaultValue={selectedPosition.maxSalary} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Hủy</Button>
                                <Button onClick={() => {
                                    setEditDialogOpen(false);
                                    toast.success('Đã cập nhật chức vụ!');
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
                        <DialogTitle>Thêm chức vụ mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Mã chức vụ</Label>
                                <Input placeholder="VD: DEV" />
                            </div>
                            <div>
                                <Label>Tên chức vụ</Label>
                                <Input placeholder="VD: Lập trình viên" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Lương tối thiểu</Label>
                                <Input type="number" placeholder="10000000" />
                            </div>
                            <div>
                                <Label>Lương tối đa</Label>
                                <Input type="number" placeholder="25000000" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={() => {
                            setCreateDialogOpen(false);
                            toast.success('Đã tạo chức vụ mới!');
                        }}>Tạo</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
