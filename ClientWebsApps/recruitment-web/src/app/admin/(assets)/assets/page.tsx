'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Search, Plus, Eye, Pencil, Monitor, Laptop, Smartphone, Armchair, Car, Package, Trash2, Loader2, QrCode, Upload, ScanLine
} from 'lucide-react';
import { toast } from 'sonner';
import { QRScanner } from '@/components/QRScanner';

const assetStatusLabels: Record<string, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    AVAILABLE: { label: 'Sẵn sàng', variant: 'default' },
    IN_USE: { label: 'Đang dùng', variant: 'destructive' },
    BROKEN: { label: 'Hỏng', variant: 'secondary' },
    MAINTENANCE: { label: 'Bảo trì', variant: 'outline' },
    LIQUIDATED: { label: 'Thanh lý', variant: 'secondary' },
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('vi-VN');

interface Asset {
    id: string;
    code: string;
    name: string;
    type: string;
    status: string;
    purchaseDate: string;
    price: number;
    description?: string | null;
    holderId?: string | null;
    holderName?: string | null;
    assignedDate?: string | null;
    companyId?: string | null;
    departmentId?: string | null;
}

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
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);
    const [scanDialogOpen, setScanDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [qrAsset, setQrAsset] = useState<Asset | null>(null);
    const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
    const [employees, setEmployees] = useState<{ id: string; fullName: string }[]>([]);

    // Legal Entity logic
    const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
    const [departments, setDepartments] = useState<{ id: string; name: string; companyId: string }[]>([]);
    const [activeCompanyId, setActiveCompanyId] = useState<string>('ALL');
    const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

    const [formData, setFormData] = useState<Partial<Asset>>({
        code: '', name: '', type: 'LAPTOP', status: 'AVAILABLE',
        price: 0, purchaseDate: new Date().toISOString().split('T')[0],
        holderId: 'none', description: '', companyId: 'none', departmentId: 'none'
    });
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows: any[] = XLSX.utils.sheet_to_json(firstSheet);

                const assetsToImport = rows.map((row) => ({
                    code: row['Mã TS'] || `AST${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    name: row['Tên tài sản'] || 'Tài sản mới',
                    type: row['Loại'] || 'OTHER',
                    status: 'AVAILABLE',
                    price: Number(row['Giá trị'] || 0),
                    purchaseDate: new Date().toISOString(),
                    description: row['Ghi chú'] || null,
                }));

                await fetch('/api/assets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(assetsToImport),
                });
                toast.success(`Đã import ${assetsToImport.length} tài sản thành công`);
                setImportDialogOpen(false);
                fetchAssets();
            } catch (error) {
                toast.error('Lỗi khi import file Excel');
            }
        };
        reader.readAsArrayBuffer(file);

        // Reset file input after reading
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDownloadTemplate = () => {
        const templateData = [
            {
                'Mã TS': 'AST001',
                'Tên tài sản': 'MacBook Pro M3',
                'Loại': 'LAPTOP',
                'Giá trị': 45000000,
                'Ghi chú': 'Máy mới 100%'
            },
            {
                'Mã TS': 'AST002',
                'Tên tài sản': 'Màn hình Dell Ultrasharp',
                'Loại': 'MONITOR',
                'Giá trị': 8500000,
                'Ghi chú': ''
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(templateData);

        // Define column widths
        worksheet['!cols'] = [
            { wch: 15 }, // Mã TS
            { wch: 30 }, // Tên
            { wch: 15 }, // Loại
            { wch: 15 }, // Giá
            { wch: 40 }, // Ghi chú
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
        XLSX.writeFile(workbook, "Asset_Import_Template.xlsx");
    };

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const [assetRes, empRes, compRes, deptRes] = await Promise.all([
                fetch('/api/assets'),
                fetch('/api/employees'),
                fetch('/api/companies'),
                fetch('/api/departments')
            ]);
            const assetJson = await assetRes.json();
            const empJson = await empRes.json();
            const compJson = await compRes.json();
            const deptJson = await deptRes.json();

            setAssets(assetJson.data || []);
            setEmployees((empJson.data || []).map((e: any) => ({ id: e.id, fullName: e.fullName })));
            setCompanies(compJson.data || []);
            setDepartments(deptJson.data || []);
        } catch {
            setAssets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAssets(); }, []);

    // Support dynamic asset types extracted from the current assets list
    const uniqueAssetTypes = Array.from(new Set(assets.map(a => a.type).filter(Boolean)));

    const filteredAssets = assets.filter((asset) => {
        const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
            asset.code.toLowerCase().includes(search.toLowerCase()) ||
            (asset.holderName && asset.holderName.toLowerCase().includes(search.toLowerCase()));
        const matchesType = typeFilter === 'ALL' || asset.type === typeFilter;
        const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;
        // @ts-ignore
        const matchesCompany = activeCompanyId === 'ALL' || asset.companyId === activeCompanyId;
        // @ts-ignore
        const matchesDept = departmentFilter === 'ALL' || asset.departmentId === departmentFilter;

        return matchesSearch && matchesType && matchesStatus && matchesCompany && matchesDept;
    });

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

    const handleOpenCreate = (prefillCode?: string) => {
        setIsEditing(false);
        setFormData({
            code: prefillCode || `AST${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            name: '', type: 'LAPTOP', status: 'AVAILABLE', price: 0,
            purchaseDate: new Date().toISOString().split('T')[0],
            holderId: 'none', description: '', companyId: 'none', departmentId: 'none'
        });
        setCreateDialogOpen(true);
    };

    const handleScanSuccess = (decodedText: string) => {
        setScanDialogOpen(false);

        // Extract code if it's a URL
        let scannedCode = decodedText;
        if (decodedText.includes('search=')) {
            scannedCode = decodedText.split('search=')[1].split('&')[0];
        }

        const foundAsset = assets.find(a => a.code.toLowerCase() === scannedCode.toLowerCase());

        if (foundAsset) {
            toast.success(`Đã tìm thấy tài sản: ${foundAsset.name}`);
            handleOpenEdit(foundAsset);
        } else {
            toast.info(`Mã mới: ${scannedCode}. Vui lòng nhập thông tin.`);
            handleOpenCreate(scannedCode);
        }
    };

    const handleOpenEdit = (asset: Asset) => {
        setIsEditing(true);
        setFormData({ ...asset, holderId: asset.holderId || 'none' });
        setSelectedAsset(asset);
        setCreateDialogOpen(true);
        setDetailDialogOpen(false);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.code || !formData.type || !formData.status) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        let holderName: string | undefined = undefined;
        let assignedDate = formData.assignedDate;
        let status = formData.status;

        if (formData.holderId && formData.holderId !== 'none') {
            const employee = employees.find(e => e.id === formData.holderId);
            if (employee) {
                holderName = employee.fullName;
                if (!isEditing || selectedAsset?.holderId !== formData.holderId) {
                    assignedDate = new Date().toISOString();
                }
            }
        }

        const assetData: any = {
            code: formData.code, name: formData.name, type: formData.type,
            status, price: Number(formData.price),
            purchaseDate: new Date(formData.purchaseDate!).toISOString(),
            description: formData.description || null,
            // @ts-ignore
            companyId: formData.companyId === 'none' ? null : formData.companyId,
            // @ts-ignore
            departmentId: formData.departmentId === 'none' ? null : formData.departmentId,
            holderId: formData.holderId === 'none' ? null : formData.holderId,
            holderName: holderName || null,
            assignedDate: assignedDate || null,
        };

        try {
            if (isEditing && selectedAsset) {
                await fetch('/api/assets', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: selectedAsset.id, ...assetData }),
                });
                toast.success('Cập nhật tài sản thành công');
            } else {
                await fetch('/api/assets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(assetData),
                });
                toast.success('Thêm tài sản mới thành công');
            }
            setCreateDialogOpen(false);
            fetchAssets();
        } catch {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleDeleteClick = (asset: Asset) => {
        setAssetToDelete(asset);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (assetToDelete) {
            try {
                await fetch(`/api/assets?id=${assetToDelete.id}`, { method: 'DELETE' });
                toast.success(`Đã xóa tài sản ${assetToDelete.code}`);
                setDeleteDialogOpen(false);
                setAssetToDelete(null);
                fetchAssets();
            } catch {
                toast.error('Có lỗi xảy ra');
            }
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
                    <h1 className="text-2xl font-bold">Quản lý Tài sản</h1>
                    <p className="text-muted-foreground">Theo dõi và quản lý thiết bị, tài sản công ty</p>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => setImportDialogOpen(true)} className="w-full sm:w-auto">
                        <Upload className="mr-2 h-4 w-4" />
                        Nhập Excel
                    </Button>
                    <Button variant="outline" onClick={() => setScanDialogOpen(true)} className="w-full sm:w-auto">
                        <ScanLine className="mr-2 h-4 w-4" /> Quét mã QR
                    </Button>
                    <Button onClick={() => handleOpenCreate()} className="col-span-2 sm:col-span-1 w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm tài sản
                    </Button>
                </div>
            </div>



            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">Tổng tài sản</p><p className="text-2xl font-bold">{stats.total}</p></div><div className="p-3 bg-slate-100 rounded-full"><Package className="h-5 w-5 text-slate-500" /></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">Đang sử dụng</p><p className="text-2xl font-bold text-blue-600">{stats.inUse}</p></div><div className="p-3 bg-blue-50 rounded-full"><Laptop className="h-5 w-5 text-blue-500" /></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">Sẵn sàng</p><p className="text-2xl font-bold text-green-600">{stats.available}</p></div><div className="p-3 bg-green-50 rounded-full"><Package className="h-5 w-5 text-green-500" /></div></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">Bảo trì / Hỏng</p><p className="text-2xl font-bold text-red-600">{stats.broken}</p></div><div className="p-3 bg-red-50 rounded-full"><Monitor className="h-5 w-5 text-red-500" /></div></div></CardContent></Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base font-medium">Bộ lọc & Tìm kiếm</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm theo tên, mã hoặc người giữ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                        </div>
                        <Select value={activeCompanyId} onValueChange={(val) => {
                            setActiveCompanyId(val);
                            setDepartmentFilter('ALL');
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pháp nhân" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả pháp nhân</SelectItem>
                                {companies.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {activeCompanyId !== 'ALL' && (
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Bộ phận" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Tất cả bộ phận</SelectItem>
                                    {departments.filter(d => d.companyId === activeCompanyId).map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Loại tài sản" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả loại</SelectItem>
                                {uniqueAssetTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger><SelectContent><SelectItem value="ALL">Tất cả trạng thái</SelectItem>{Object.entries(assetStatusLabels).map(([key, value]) => (<SelectItem key={key} value={key}>{value.label}</SelectItem>))}</SelectContent></Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
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
                                const StatusBadge = assetStatusLabels[asset.status] || { label: asset.status, variant: 'outline' as const };
                                const TypeIcon = getTypeIcon(asset.type);
                                return (
                                    <TableRow key={asset.id}>
                                        <TableCell className="font-mono font-medium">{asset.code}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-muted rounded-md"><TypeIcon className="h-4 w-4 text-muted-foreground" /></div>
                                                <span className="font-medium">{asset.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{asset.type}</TableCell>
                                        <TableCell>
                                            {asset.holderName ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{asset.holderName.split(' ').map(n => n[0]).join('').slice(-2)}</AvatarFallback></Avatar>
                                                    <span className="text-sm">{asset.holderName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm italic">-- Kho --</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{formatCurrency(asset.price)}</TableCell>
                                        <TableCell><Badge variant={StatusBadge.variant}>{StatusBadge.label}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => { setQrAsset(asset); setQrDialogOpen(true); }}><QrCode className="h-4 w-4 text-blue-500" /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => { setSelectedAsset(asset); setDetailDialogOpen(true); }}><Eye className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(asset)}><Pencil className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(asset)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredAssets.length === 0 && (
                                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Không tìm thấy tài sản nào</TableCell></TableRow>
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
                                <DialogTitle className="flex items-center gap-2">{selectedAsset.name}<Badge variant="outline" className="ml-2 font-mono">{selectedAsset.code}</Badge></DialogTitle>
                                <DialogDescription>Chi tiết thông tin tài sản</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label className="text-muted-foreground text-xs">Loại tài sản</Label><p className="font-medium">{selectedAsset.type}</p></div>
                                    <div><Label className="text-muted-foreground text-xs">Giá trị</Label><p className="font-medium">{formatCurrency(selectedAsset.price)}</p></div>
                                    <div><Label className="text-muted-foreground text-xs">Ngày mua</Label><p className="font-medium">{formatDate(selectedAsset.purchaseDate)}</p></div>
                                    <div><Label className="text-muted-foreground text-xs">Trạng thái</Label><div className="mt-1"><Badge variant={assetStatusLabels[selectedAsset.status]?.variant || 'outline'}>{assetStatusLabels[selectedAsset.status]?.label || selectedAsset.status}</Badge></div></div>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="text-muted-foreground text-xs">Người đang giữ</Label>
                                    {selectedAsset.holderName ? (
                                        <div className="flex items-center gap-3 mt-1 p-2 bg-muted/50 rounded-lg">
                                            <Avatar className="h-8 w-8"><AvatarFallback>{selectedAsset.holderName.split(' ').map(n => n[0]).join('').slice(-2)}</AvatarFallback></Avatar>
                                            <div><p className="font-medium text-sm">{selectedAsset.holderName}</p><p className="text-xs text-muted-foreground">Từ ngày: {selectedAsset.assignedDate ? formatDate(selectedAsset.assignedDate) : 'N/A'}</p></div>
                                        </div>
                                    ) : (<p className="mt-1 text-sm">Chưa giao cho ai (Đang trong kho)</p>)}
                                </div>
                                {selectedAsset.description && (<><Separator /><div><Label className="text-muted-foreground text-xs">Ghi chú</Label><p className="text-sm mt-1">{selectedAsset.description}</p></div></>)}
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
                            <div className="space-y-2"><Label>Pháp nhân (Công ty)</Label><Select value={formData.companyId || 'none'} onValueChange={(val) => setFormData({ ...formData, companyId: val, departmentId: 'none' })}><SelectTrigger><SelectValue placeholder="Chọn Pháp nhân" /></SelectTrigger><SelectContent><SelectItem value="none">-- Không chọn --</SelectItem>{companies.map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent></Select></div>
                            <div className="space-y-2"><Label>Bộ phận</Label><Select value={formData.departmentId || 'none'} onValueChange={(val) => setFormData({ ...formData, departmentId: val })} disabled={!formData.companyId || formData.companyId === 'none'}><SelectTrigger><SelectValue placeholder="Chọn Bộ phận" /></SelectTrigger><SelectContent><SelectItem value="none">-- Không chọn --</SelectItem>{departments.filter(d => d.companyId === formData.companyId).map(d => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent></Select></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Mã tài sản</Label><Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} /></div>
                            <div className="space-y-2">
                                <Label>Loại</Label>
                                <Input
                                    list="asset-types"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    placeholder="Ví dụ: Laptop, Màn hình, Bàn ghế..."
                                />
                                <datalist id="asset-types">
                                    {uniqueAssetTypes.map(type => (
                                        <option key={type} value={type} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Tên tài sản</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ví dụ: MacBook Pro M3" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Giá trị</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} /></div>
                            <div className="space-y-2"><Label>Ngày mua</Label><Input type="date" value={typeof formData.purchaseDate === 'string' ? formData.purchaseDate.split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Trạng thái</Label>
                                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                    <SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(assetStatusLabels).map(([key, value]) => (<SelectItem key={key} value={key}>{value.label}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Người sử dụng</Label>
                                <Select value={formData.holderId || 'none'} onValueChange={(val) => setFormData({ ...formData, holderId: val })}>
                                    <SelectTrigger><SelectValue placeholder="Chọn nhân viên" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Không giao --</SelectItem>
                                        {employees.map(emp => (<SelectItem key={emp.id} value={emp.id}>{emp.fullName}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Ghi chú</Label><Input value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSave}>Lưu tài sản</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>Bạn có chắc chắn muốn xóa tài sản <strong>{assetToDelete?.name}</strong>? Hành động này không thể hoàn tác.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Xóa tài sản</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* QR Code Dialog */}
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
                <DialogContent className="sm:max-w-sm flex flex-col items-center justify-center p-8">
                    <DialogHeader className="text-center w-full">
                        <DialogTitle className="text-center">{qrAsset?.name}</DialogTitle>
                        <DialogDescription className="text-center">Mã: {qrAsset?.code}</DialogDescription>
                    </DialogHeader>
                    {qrAsset && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border mt-4">
                            <QRCodeSVG value={`${window.location.origin}/admin/assets?search=${qrAsset.code}`} size={200} level="H" />
                        </div>
                    )}
                    <Button variant="outline" className="mt-6 w-full" onClick={() => window.print()}>In mã QR</Button>
                </DialogContent>
            </Dialog>

            {/* Scan QR Dialog */}
            <Dialog open={scanDialogOpen} onOpenChange={setScanDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Quét mã QR</DialogTitle>
                        <DialogDescription>
                            Đưa mã QR của tài sản vào khung hình để tự động nhận dạng.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {scanDialogOpen && (
                            <QRScanner
                                onScanSuccess={handleScanSuccess}
                                onScanError={(err) => console.log('Scan error:', err)}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Import Excel Dialog */}
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nhập danh sách tài sản (Import Excel)</DialogTitle>
                        <DialogDescription>
                            Tải lên tệp Excel (.xlsx, .xls) chứa danh sách tài sản. Vui lòng đảm bảo các cột khớp với file mẫu.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-slate-50 p-4 border rounded-md text-sm space-y-2">
                            <h4 className="font-semibold text-slate-800">Quy tắc định dạng tự động:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                <li><strong>Mã TS:</strong> (Ví dụ: AST101). Nếu để trống, hệ thống sẽ tự động tạo mã ngẫu nhiên.</li>
                                <li><strong>Tên tài sản:</strong> Tên cấu hình thiết bị (Ví dụ: iPhone 15 Pro, Màn hình rời...).</li>
                                <li><strong>Loại:</strong> Phân loại (Ví dụ: LAPTOP, MONITOR...). Nhập loại mới cũng được.</li>
                                <li><strong>Giá trị:</strong> Nhập số tiền mua thiết bị (chỉ nhập số).</li>
                                <li><strong>Ghi chú:</strong> Không bắt buộc (như cấu hình máy, tình trạng mua...).</li>
                            </ul>
                        </div>

                        <div className="flex gap-4 w-full pt-4">
                            <Button variant="outline" className="flex-1" onClick={handleDownloadTemplate}>
                                Tải file mẫu .xlsx
                            </Button>

                            <div className="flex-1">
                                <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls" onChange={handleImportExcel} />
                                <Button className="w-full" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="mr-2 h-4 w-4" /> Tải lên và Import
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
