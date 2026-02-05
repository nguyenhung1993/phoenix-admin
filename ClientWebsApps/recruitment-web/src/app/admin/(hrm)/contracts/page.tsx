'use client';

import { useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
    mockContracts,
    mockEmployees,
    contractTypeLabels,
    contractStatusLabels,
    formatCurrency,
    formatDate,
    Contract,
} from '@/lib/mocks';
import { Search, Plus, Eye, FileText, Calendar, AlertTriangle } from 'lucide-react';

export default function AdminContractsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const filteredContracts = mockContracts.filter((contract) => {
        const matchesSearch = contract.employeeName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || contract.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const contractsByStatus = {
        ALL: mockContracts.length,
        ACTIVE: mockContracts.filter((c) => c.status === 'ACTIVE').length,
        EXPIRED: mockContracts.filter((c) => c.status === 'EXPIRED').length,
    };

    const expiringContracts = mockContracts.filter((c) => {
        if (!c.endDate || c.status !== 'ACTIVE') return false;
        const daysToExpire = Math.ceil((new Date(c.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysToExpire > 0 && daysToExpire <= 30;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý hợp đồng</h1>
                    <p className="text-muted-foreground">Theo dõi hợp đồng lao động</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo hợp đồng
                </Button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng hợp đồng</p>
                                <p className="text-2xl font-bold">{contractsByStatus.ALL}</p>
                            </div>
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đang hiệu lực</p>
                                <p className="text-2xl font-bold text-green-600">{contractsByStatus.ACTIVE}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Hết hạn</p>
                                <p className="text-2xl font-bold text-gray-600">{contractsByStatus.EXPIRED}</p>
                            </div>
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className={expiringContracts.length > 0 ? 'border-orange-300 bg-orange-50' : ''}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Sắp hết hạn (30 ngày)</p>
                                <p className="text-2xl font-bold text-orange-600">{expiringContracts.length}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="ALL" onValueChange={setStatusFilter}>
                <TabsList className="gap-2">
                    <TabsTrigger value="ALL" className="gap-2">
                        Tất cả <Badge variant="secondary">{contractsByStatus.ALL}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="ACTIVE" className="gap-2">
                        Hiệu lực <Badge variant="secondary">{contractsByStatus.ACTIVE}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="EXPIRED" className="gap-2">
                        Hết hạn <Badge variant="secondary">{contractsByStatus.EXPIRED}</Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Card>
                <CardHeader>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm nhân viên..."
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
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Loại HĐ</TableHead>
                                <TableHead>Ngày bắt đầu</TableHead>
                                <TableHead>Ngày kết thúc</TableHead>
                                <TableHead>Lương</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredContracts.map((contract) => {
                                const statusStyle = contractStatusLabels[contract.status];
                                return (
                                    <TableRow key={contract.id}>
                                        <TableCell className="font-medium">{contract.employeeName}</TableCell>
                                        <TableCell>{contractTypeLabels[contract.contractType]}</TableCell>
                                        <TableCell>{formatDate(contract.startDate)}</TableCell>
                                        <TableCell>{contract.endDate ? formatDate(contract.endDate) : 'Không thời hạn'}</TableCell>
                                        <TableCell className="font-medium">{formatCurrency(contract.salary)}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedContract(contract);
                                                    setDetailDialogOpen(true);
                                                }}
                                            >
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

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent>
                    {selectedContract && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Chi tiết hợp đồng</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Nhân viên</Label>
                                        <p className="font-medium">{selectedContract.employeeName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Loại hợp đồng</Label>
                                        <p className="font-medium">{contractTypeLabels[selectedContract.contractType]}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Ngày bắt đầu</Label>
                                        <p className="font-medium">{formatDate(selectedContract.startDate)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Ngày kết thúc</Label>
                                        <p className="font-medium">{selectedContract.endDate ? formatDate(selectedContract.endDate) : 'Không thời hạn'}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <Label className="text-muted-foreground">Mức lương</Label>
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(selectedContract.salary)}</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
                                <Button>Gia hạn</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tạo hợp đồng mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nhân viên</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhân viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockEmployees.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.employeeCode} - {emp.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Loại hợp đồng</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PROBATION">Thử việc</SelectItem>
                                        <SelectItem value="FIXED_TERM">Có thời hạn</SelectItem>
                                        <SelectItem value="INDEFINITE">Không thời hạn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Mức lương</Label>
                                <Input type="number" placeholder="15000000" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Ngày bắt đầu</Label>
                                <Input type="date" />
                            </div>
                            <div>
                                <Label>Ngày kết thúc</Label>
                                <Input type="date" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={() => setCreateDialogOpen(false)}>Tạo</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
