'use client';

import { useState, Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, Plus, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AssetAllocationsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Đang tải...</div>}>
            <AssetAllocationsContent />
        </Suspense>
    );
}

function AssetAllocationsContent() {
    const [allocations, setAllocations] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // Form data for allocation
    const [selectedAssetId, setSelectedAssetId] = useState('');
    const [selectedCompanyId, setSelectedCompanyId] = useState('ALL');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('ALL');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [notes, setNotes] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [allocRes, assetRes, empRes, compRes, deptRes] = await Promise.all([
                fetch('/api/asset-allocations'),
                fetch('/api/assets'), // Fetch all assets instead of just AVAILABLE, to filter client-side
                fetch('/api/employees?limit=1000'), // fetch more to avoid pagination for dropdown
                fetch('/api/companies'),
                fetch('/api/departments')
            ]);

            if (!allocRes.ok || !assetRes.ok || !empRes.ok) throw new Error('Failed to fetch data');

            const allocJson = await allocRes.json();
            const assetJson = await assetRes.json();
            const empJson = await empRes.json();
            const compJson = compRes.ok ? await compRes.json() : { data: [] };
            const deptJson = deptRes.ok ? await deptRes.json() : { data: [] };

            setAllocations(allocJson.data || []);
            // Filter client side to allow both AVAILABLE and MAINTENANCE
            const assignableAssets = (assetJson.data || []).filter((a: any) =>
                a.status === 'AVAILABLE' || a.status === 'MAINTENANCE'
            );
            setAssets(assignableAssets);
            setEmployees((empJson.data || []).map((e: any) => ({
                id: e.id,
                fullName: e.fullName,
                departmentId: e.department?.id,
                companyId: e.department?.companyId
            })));
            setCompanies(compJson.data || []);
            setDepartments(deptJson.data || []);
        } catch {
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredAllocations = allocations.filter(a => {
        const searchLower = search.toLowerCase();
        return a.asset?.name.toLowerCase().includes(searchLower) ||
            a.asset?.code.toLowerCase().includes(searchLower) ||
            a.employee?.fullName.toLowerCase().includes(searchLower);
    });

    const handleAllocate = async () => {
        if (!selectedAssetId || !selectedEmployeeId) {
            toast.error('Vui lòng chọn tài sản và nhân viên');
            return;
        }

        try {
            const res = await fetch('/api/asset-allocations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assetId: selectedAssetId,
                    employeeId: selectedEmployeeId,
                    status: 'ALLOCATED',
                    notes,
                }),
            });

            if (!res.ok) throw new Error('API error');

            toast.success('Cấp phát tài sản thành công');
            setCreateDialogOpen(false);
            setSelectedAssetId('');
            setSelectedEmployeeId('');
            setNotes('');
            fetchData();
        } catch {
            toast.error('Lỗi cấp phát tài sản');
        }
    };

    const handleReturn = async (id: string) => {
        if (!confirm('Xác nhận thu hồi tài sản này?')) return;
        try {
            const res = await fetch('/api/asset-allocations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    status: 'RETURNED',
                    returnedDate: new Date().toISOString(),
                }),
            });

            if (!res.ok) throw new Error('API error');

            toast.success('Thu hồi tài sản thành công');
            fetchData();
        } catch {
            toast.error('Lỗi thu hồi tài sản');
        }
    };

    if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground mr-2" /> Đang tải dữ liệu...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Cấp phát & Thu hồi</h1>
                    <p className="text-muted-foreground">Quản lý giao/nhận tài sản với nhân viên</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Cấp phát mới
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">Danh sách cấp phát</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Tìm theo tên máy, mã máy..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 max-w-sm" />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tài sản</TableHead>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Ngày cấp</TableHead>
                                <TableHead>Ngày trả</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAllocations.map(alloc => (
                                <TableRow key={alloc.id}>
                                    <TableCell>
                                        <p className="font-medium">{alloc.asset?.name}</p>
                                        <p className="text-xs text-muted-foreground">{alloc.asset?.code}</p>
                                    </TableCell>
                                    <TableCell>{alloc.employee?.fullName}</TableCell>
                                    <TableCell>{new Date(alloc.allocatedDate).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell>{alloc.returnedDate ? new Date(alloc.returnedDate).toLocaleDateString('vi-VN') : '--'}</TableCell>
                                    <TableCell>
                                        <Badge variant={alloc.status === 'ALLOCATED' ? 'default' : 'secondary'}>
                                            {alloc.status === 'ALLOCATED' ? 'Đang dùng' : 'Đã thu hồi'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {alloc.status === 'ALLOCATED' && (
                                            <Button variant="outline" size="sm" onClick={() => handleReturn(alloc.id)}>
                                                <RotateCcw className="h-4 w-4 mr-2" /> Thu hồi
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredAllocations.length === 0 && (
                                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Không có dữ liệu</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cấp phát tài sản</DialogTitle>
                        <DialogDescription>Chọn tài sản và nhân viên để cấp phát.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Tài sản (Sẵn sàng hoặc Đang bảo trì)</Label>
                            <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn tài sản..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {assets.map(a => (
                                        <SelectItem key={a.id} value={a.id}>{a.name} ({a.code}) {a.status === 'MAINTENANCE' ? '- Đang bảo trì' : ''}</SelectItem>
                                    ))}
                                    {assets.length === 0 && <SelectItem value="none" disabled>Không có tài sản hợp lệ</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Pháp nhân (Công ty)</Label>
                                <Select value={selectedCompanyId} onValueChange={(val) => {
                                    setSelectedCompanyId(val);
                                    setSelectedDepartmentId('ALL');
                                    setSelectedEmployeeId('');
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn Pháp nhân" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Tất cả pháp nhân</SelectItem>
                                        {companies.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Bộ phận</Label>
                                <Select value={selectedDepartmentId} onValueChange={(val) => {
                                    setSelectedDepartmentId(val);
                                    setSelectedEmployeeId('');
                                }} disabled={selectedCompanyId === 'ALL'}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn Bộ phận" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Tất cả bộ phận</SelectItem>
                                        {departments.filter(d => d.companyId === selectedCompanyId).map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Nhân viên</Label>
                            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhân viên..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.filter(e => {
                                        if (selectedCompanyId !== 'ALL' && e.companyId !== selectedCompanyId) return false;
                                        if (selectedDepartmentId !== 'ALL' && e.departmentId !== selectedDepartmentId) return false;
                                        return true;
                                    }).map(e => (
                                        <SelectItem key={e.id} value={e.id}>{e.fullName}</SelectItem>
                                    ))}
                                    {employees.filter(e => {
                                        if (selectedCompanyId !== 'ALL' && e.companyId !== selectedCompanyId) return false;
                                        if (selectedDepartmentId !== 'ALL' && e.departmentId !== selectedDepartmentId) return false;
                                        return true;
                                    }).length === 0 && <SelectItem value="none" disabled>Không có nhân viên phù hợp</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Ghi chú / Trạng thái máy khi giao</Label>
                            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="VD: Máy mới 100%, kèm sạc..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleAllocate}>Xác nhận cấp phát</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
