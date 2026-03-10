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
import { Search, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AssetMaintenancePage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Đang tải...</div>}>
            <AssetMaintenanceContent />
        </Suspense>
    );
}

const maintenanceTypeLabels: Record<string, string> = {
    REPAIR: 'Sửa chữa',
    UPGRADE: 'Nâng cấp',
    INSPECTION: 'Kiểm tra định kỳ',
    OTHER: 'Khác',
};

function AssetMaintenanceContent() {
    const [maintenances, setMaintenances] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // Form data
    const [selectedAssetId, setSelectedAssetId] = useState('');
    const [type, setType] = useState('REPAIR');
    const [cost, setCost] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [maintRes, assetRes] = await Promise.all([
                fetch('/api/asset-maintenances'),
                fetch('/api/assets')
            ]);

            if (!maintRes.ok || !assetRes.ok) throw new Error('Failed to fetch data');

            const maintJson = await maintRes.json();
            const assetJson = await assetRes.json();

            setMaintenances(maintJson.data || []);
            setAssets(assetJson.data || []);
        } catch {
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredMaintenances = maintenances.filter(m => {
        const searchLower = search.toLowerCase();
        return m.asset?.name.toLowerCase().includes(searchLower) ||
            m.asset?.code.toLowerCase().includes(searchLower);
    });

    const handleSave = async () => {
        if (!selectedAssetId) {
            toast.error('Vui lòng chọn tài sản');
            return;
        }

        try {
            const res = await fetch('/api/asset-maintenances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assetId: selectedAssetId,
                    maintenanceType: type,
                    cost: Number(cost),
                    date: new Date(date).toISOString(),
                    note,
                }),
            });

            if (!res.ok) throw new Error('API Error');

            toast.success('Thêm lịch sử bảo trì thành công');
            setCreateDialogOpen(false);

            // Reset form
            setSelectedAssetId('');
            setType('REPAIR');
            setCost(0);
            setDate(new Date().toISOString().split('T')[0]);
            setNote('');

            fetchData();
        } catch {
            toast.error('Lỗi lưu lịch sử bảo trì');
        }
    };

    if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground mr-2" /> Đang tải dữ liệu...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Lịch sử Bảo trì</h1>
                    <p className="text-muted-foreground">Theo dõi và quản lý các hoạt động bảo trì, sửa chữa tài sản</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm lịch sử bảo vệ
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">Danh sách bảo trì</CardTitle>
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
                                <TableHead>Loại bảo trì</TableHead>
                                <TableHead>Ngày thực hiện</TableHead>
                                <TableHead>Chi phí</TableHead>
                                <TableHead>Ghi chú</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMaintenances.map(maint => (
                                <TableRow key={maint.id}>
                                    <TableCell>
                                        <p className="font-medium">{maint.asset?.name}</p>
                                        <p className="text-xs text-muted-foreground">{maint.asset?.code}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{maintenanceTypeLabels[maint.maintenanceType] || maint.maintenanceType}</Badge>
                                    </TableCell>
                                    <TableCell>{new Date(maint.date).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(maint.cost)}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={maint.note}>{maint.note}</TableCell>
                                </TableRow>
                            ))}
                            {filteredMaintenances.length === 0 && (
                                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Chưa có lịch sử bảo trì nào</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm lịch sử bảo trì</DialogTitle>
                        <DialogDescription>Ghi nhận hoạt động sửa chữa, nâng cấp tài sản.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Tài sản</Label>
                            <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn tài sản..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {assets.map(a => (
                                        <SelectItem key={a.id} value={a.id}>{a.name} ({a.code}) - {a.status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Loại hoạt động</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(maintenanceTypeLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày thực hiện</Label>
                                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Chi phí (VNĐ)</Label>
                                <Input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Ghi chú</Label>
                            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Chi tiết sửa chữa..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSave}>Lưu thông tin</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
