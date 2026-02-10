'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { mockKPIs, KPI, kpiCategoryLabels } from '@/lib/mocks/performance';
import { KPIDialog } from '@/components/admin/performance/kpi-dialog';
import { mockDepartments } from '@/lib/mocks/hrm';

export default function KPIsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [kpiToEdit, setKpiToEdit] = useState<KPI | null>(null);

    const filteredKPIs = mockKPIs.filter(kpi => {
        const matchesSearch = kpi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            kpi.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || kpi.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (kpi: KPI) => {
        setKpiToEdit(kpi);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setKpiToEdit(null);
        setDialogOpen(true);
    };

    const getDepartmentName = (id?: string) => {
        if (!id || id === 'ALL') return 'Chung';
        return mockDepartments.find(d => d.id === id)?.name || id;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Thư viện KPI</h1>
                    <p className="text-muted-foreground">Quản lý danh sách các chỉ số đánh giá</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm KPI mới
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo tên, mã KPI..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[200px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Nhóm chỉ số" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả nhóm</SelectItem>
                        <SelectItem value="FINANCIAL">Tài chính</SelectItem>
                        <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                        <SelectItem value="INTERNAL">Quy trình nội bộ</SelectItem>
                        <SelectItem value="LEARNING">Đào tạo & Phát triển</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Mã</TableHead>
                            <TableHead>Tên chỉ số KPI</TableHead>
                            <TableHead>Nhóm (BSC)</TableHead>
                            <TableHead>Đơn vị</TableHead>
                            <TableHead>Mục tiêu</TableHead>
                            <TableHead>Trọng số</TableHead>
                            <TableHead>Phòng ban</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredKPIs.map((kpi) => (
                            <TableRow key={kpi.id}>
                                <TableCell className="font-medium">{kpi.code}</TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{kpi.name}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1" title={kpi.description}>
                                            {kpi.description}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{kpiCategoryLabels[kpi.category]}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{kpi.unit}</TableCell>
                                <TableCell>
                                    {kpi.unit === 'CURRENCY'
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(kpi.target)
                                        : kpi.target
                                    }
                                </TableCell>
                                <TableCell>{kpi.weight}%</TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {getDepartmentName(kpi.departmentId)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(kpi)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <KPIDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                kpiToEdit={kpiToEdit}
            />
        </div>
    );
}
