'use client';

import { useState, Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    getMockAssets,
    addAsset,
    updateAsset,
    deleteAsset,
    Asset,
    assetStatusLabels,
    assetTypeLabels,
} from '@/lib/mocks/assets';
import { mockEmployees, formatCurrency, formatDate } from '@/lib/mocks';
import {
    Search,
    Plus,
    Eye,
    Pencil,
    Monitor,
    Laptop,
    Smartphone,
    Armchair,
    Car,
    Package,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AssetsPage() {
    return (
        <Suspense fallback={<AssetsPageSkeleton />}>
            <AssetsPageContent />
        </Suspense>
    );
}

function AssetsPageSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
        </div>
    );
}

function AssetsPageContent() {
    // Data State
    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
        setAssets(getMockAssets());
    }, []);

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal State
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Asset>>({
        code: '',
        name: '',
        type: 'LAPTOP',
        status: 'AVAILABLE',
        price: 0,
        purchaseDate: new Date().toISOString().split('T')[0],
        holderId: 'none',
        description: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    // Filter Logic
    const filteredAssets = assets.filter((asset) => {
        const matchesSearch =
            asset.name.toLowerCase().includes(search.toLowerCase()) ||
            asset.code.toLowerCase().includes(search.toLowerCase()) ||
            (asset.holderName && asset.holderName.toLowerCase().includes(search.toLowerCase()));

        const matchesType = typeFilter === 'ALL' || asset.type === typeFilter;
        const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    // Stats Logic
    const stats = {
        total: assets.length,
        inUse: assets.filter(a => a.status === 'IN_USE').length,
        available: assets.filter(a => a.status === 'AVAILABLE').length,
        broken: assets.filter(a => a.status === 'BROKEN' || a.status === 'MAINTENANCE').length,
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'LAPTOP': return Laptop;
            case 'MONITOR': return Monitor;
            case 'PHONE': return Smartphone;
            case 'FURNITURE': return Armchair;
            case 'VEHICLE': return Car;
            default: return Package;
        }
    };

    // Actions
    const handleOpenCreate = () => {
        setIsEditing(false);
        setFormData({
            code: `AST${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            name: '',
            type: 'LAPTOP',
            status: 'AVAILABLE',
            price: 0,
            purchaseDate: new Date().toISOString().split('T')[0],
            holderId: 'none',
            description: '',
        });
        setCreateDialogOpen(true);
    };

    const handleOpenEdit = (asset: Asset) => {
        setIsEditing(true);
        setFormData({
            ...asset,
            holderId: asset.holderId || 'none',
        });
        setSelectedAsset(asset); // Keep track of original
        setCreateDialogOpen(true);
        setDetailDialogOpen(false); // Close detail if open
    };

    const handleSave = () => {
        if (!formData.name || !formData.code || !formData.type || !formData.status) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        // Handle Holder logic
        let holderName = undefined;
        let assignedDate = undefined;
        let status = formData.status;

        if (formData.holderId && formData.holderId !== 'none') {
            const employee = mockEmployees.find(e => e.id === formData.holderId);
            if (employee) {
                holderName = employee.fullName;
                status = 'IN_USE'; // Auto set to IN_USE if assigned
                if (!isEditing || selectedAsset?.holderId !== formData.holderId) {
                    assignedDate = new Date().toISOString().split('T')[0];
                } else {
                    assignedDate = formData.assignedDate;
                }
            }
        } else {
            // If removing holder, set status to AVAILABLE if it was IN_USE
            if (status === 'IN_USE') {
                status = 'AVAILABLE';
            }
        }

        const assetData = {
            ...formData,
            status,
            holderName,
            assignedDate,
            price: Number(formData.price),
        } as any;

        if (assetData.holderId === 'none') {
            delete assetData.holderId;
            delete assetData.holderName;
            delete assetData.assignedDate;
        }

        if (isEditing && selectedAsset) {
            const success = updateAsset(selectedAsset.id, assetData);
            if (success) {
                toast.success('Cập nhật tài sản thành công');
            } else {
                toast.error('Cập nhật thất bại');
            }
        } else {
            addAsset(assetData);
            toast.success('Thêm tài sản mới thành công');
        }

        setAssets(getMockAssets()); // Refresh
        setCreateDialogOpen(false);
    };

    const handleDeleteClick = (asset: Asset) => {
        setAssetToDelete(asset);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (assetToDelete) {
            deleteAsset(assetToDelete.id);
            setAssets(getMockAssets());
            toast.success(`Đã xóa tài sản ${assetToDelete.code}`);
            setDeleteDialogOpen(false);
            setAssetToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Tài sản</h1>
                    <p className="text-muted-foreground">Theo dõi và quản lý thiết bị, tài sản công ty</p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm tài sản
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng tài sản</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang sử dụng</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.inUse}</p>
                            </div>
                            <Laptop className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Sẵn sàng</p>
                                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                            </div>
                            <Package className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Bảo trì / Hỏng</p>
                                <p className="text-2xl font-bold text-red-600">{stats.broken}</p>
                            </div>
                            <Monitor className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">Bộ lọc & Tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm theo tên, mã hoặc người giữ..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Loại tài sản" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả loại</SelectItem>
                                {Object.entries(assetTypeLabels).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                                {Object.entries(assetStatusLabels).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Assets Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Mã TS</TableHead>
                                <TableHead>Tên tài sản</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Người giữ</TableHead>
                                <TableHead>Giá trị</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssets.map((asset) => {
                                const StatusBadge = assetStatusLabels[asset.status];
                                const TypeIcon = getTypeIcon(asset.type);

                                return (
                                    <TableRow key={asset.id}>
                                        <TableCell className="font-mono font-medium">{asset.code}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-muted rounded-md">
                                                    <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <span className="font-medium">{asset.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{assetTypeLabels[asset.type]}</TableCell>
                                        <TableCell>
                                            {asset.holderName ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-xs">
                                                            {asset.holderName.split(' ').map(n => n[0]).join('').slice(-2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{asset.holderName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm italic">-- Kho --</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{formatCurrency(asset.price)}</TableCell>
                                        <TableCell>
                                            <Badge variant={StatusBadge.variant}>{StatusBadge.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedAsset(asset);
                                                        setDetailDialogOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleOpenEdit(asset)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDeleteClick(asset)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredAssets.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Không tìm thấy tài sản nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-lg">
                    {selectedAsset && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {selectedAsset.name}
                                    <Badge variant="outline" className="ml-2 font-mono">{selectedAsset.code}</Badge>
                                </DialogTitle>
                                <DialogDescription>
                                    Chi tiết thông tin tài sản
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground text-xs">Loại tài sản</Label>
                                        <p className="font-medium">{assetTypeLabels[selectedAsset.type]}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-xs">Giá trị</Label>
                                        <p className="font-medium">{formatCurrency(selectedAsset.price)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-xs">Ngày mua</Label>
                                        <p className="font-medium">{formatDate(selectedAsset.purchaseDate)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-xs">Trạng thái</Label>
                                        <div className="mt-1">
                                            <Badge variant={assetStatusLabels[selectedAsset.status].variant}>
                                                {assetStatusLabels[selectedAsset.status].label}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <Label className="text-muted-foreground text-xs">Người đang giữ</Label>
                                    {selectedAsset.holderName ? (
                                        <div className="flex items-center gap-3 mt-1 p-2 bg-muted/50 rounded-lg">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {selectedAsset.holderName.split(' ').map(n => n[0]).join('').slice(-2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{selectedAsset.holderName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Từ ngày: {selectedAsset.assignedDate ? formatDate(selectedAsset.assignedDate) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-1 text-sm">Chưa giao cho ai (Đang trong kho)</p>
                                    )}
                                </div>

                                {selectedAsset.description && (
                                    <>
                                        <Separator />
                                        <div>
                                            <Label className="text-muted-foreground text-xs">Ghi chú</Label>
                                            <p className="text-sm mt-1">{selectedAsset.description}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
                                <Button onClick={() => handleOpenEdit(selectedAsset)}>Chỉnh sửa</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Create/Edit Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Chỉnh sửa tài sản' : 'Thêm tài sản mới'}</DialogTitle>
                        <DialogDescription>Nhập thông tin tài sản để quản lý</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Mã tài sản</Label>
                                <Input
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Loại</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(assetTypeLabels).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tên tài sản</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ví dụ: MacBook Pro M3"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Giá trị</Label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày mua</Label>
                                <Input
                                    type="date"
                                    value={formData.purchaseDate}
                                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Trạng thái</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(assetStatusLabels).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Người sử dụng</Label>
                                <Select
                                    value={formData.holderId}
                                    onValueChange={(val) => setFormData({ ...formData, holderId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn nhân viên" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Không giao --</SelectItem>
                                        {mockEmployees.map(emp => (
                                            <SelectItem key={emp.id} value={emp.id}>{emp.fullName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Ghi chú</Label>
                            <Input
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSave}>Lưu tài sản</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa tài sản <strong>{assetToDelete?.name}</strong>?
                            Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Xóa tài sản</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
