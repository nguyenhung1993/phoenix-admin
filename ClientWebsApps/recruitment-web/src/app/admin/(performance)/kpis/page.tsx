'use client';

import { useState, useEffect } from 'react';
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
import { Plus, Search, Edit, Trash2, Filter, Loader2 } from 'lucide-react';
import { KPIDialog } from '@/components/admin/performance/kpi-dialog';

const kpiCategoryLabels: Record<string, string> = {
    FINANCIAL: 'Tài chính',
    CUSTOMER: 'Khách hàng',
    INTERNAL: 'Quy trình nội bộ',
    LEARNING: 'Đào tạo & Phát triển',
};

interface KPI {
    id: string;
    code: string;
    name: string;
    description: string | null;
    unit: string;
    target: number;
    weight: number;
    category: string;
    departmentId: string | null;
    departmentName: string;
}

export default function KPIsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [kpiToEdit, setKpiToEdit] = useState<KPI | null>(null);
    const [kpis, setKpis] = useState<KPI[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchKpis = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/kpis');
            const json = await res.json();
            setKpis(json.data || []);
        } catch {
            setKpis([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchKpis(); }, []);

    const filteredKPIs = kpis.filter(kpi => {
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
                                        <div className="text-xs text-muted-foreground line-clamp-1" title={kpi.description || ''}>
                                            {kpi.description}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{kpiCategoryLabels[kpi.category] || kpi.category}</Badge>
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
                                    {kpi.departmentName}
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
                {filteredKPIs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">Không có KPI nào</div>
                )}
            </div>

            <KPIDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                kpiToEdit={kpiToEdit as any}
            />
        </div>
    );
}
