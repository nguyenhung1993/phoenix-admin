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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    mockOffers,
    offerStatusLabels,
    formatCurrency,
    Offer,
} from '@/lib/mocks';
import {
    Search,
    Plus,
    Eye,
    Send,
    FileText,
    Calendar,
    Briefcase,
    DollarSign,
    Gift,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-react';

export default function AdminOffersPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const filteredOffers = mockOffers.filter((offer) => {
        const matchesSearch =
            offer.candidateName.toLowerCase().includes(search.toLowerCase()) ||
            offer.jobTitle.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || offer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const offersByStatus = {
        ALL: mockOffers.length,
        DRAFT: mockOffers.filter((o) => o.status === 'DRAFT').length,
        SENT: mockOffers.filter((o) => o.status === 'SENT').length,
        ACCEPTED: mockOffers.filter((o) => o.status === 'ACCEPTED').length,
        REJECTED: mockOffers.filter((o) => o.status === 'REJECTED').length,
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'REJECTED':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'SENT':
                return <Send className="h-4 w-4 text-blue-500" />;
            case 'DRAFT':
                return <FileText className="h-4 w-4 text-gray-500" />;
            default:
                return <Clock className="h-4 w-4 text-yellow-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Offer Letter</h1>
                    <p className="text-muted-foreground">Tạo và theo dõi thư mời nhận việc</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo Offer Letter
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng offer</p>
                                <p className="text-2xl font-bold">{offersByStatus.ALL}</p>
                            </div>
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đã gửi</p>
                                <p className="text-2xl font-bold text-blue-600">{offersByStatus.SENT}</p>
                            </div>
                            <Send className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Đã nhận</p>
                                <p className="text-2xl font-bold text-green-600">{offersByStatus.ACCEPTED}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tỷ lệ nhận</p>
                                <p className="text-2xl font-bold">
                                    {Math.round((offersByStatus.ACCEPTED / (offersByStatus.ACCEPTED + offersByStatus.REJECTED || 1)) * 100)}%
                                </p>
                            </div>
                            <Gift className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Tabs */}
            <Tabs defaultValue="ALL" onValueChange={setStatusFilter}>
                <TabsList className="flex-wrap h-auto gap-2">
                    <TabsTrigger value="ALL" className="gap-2">
                        Tất cả <Badge variant="secondary">{offersByStatus.ALL}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="DRAFT" className="gap-2">
                        Nháp <Badge variant="secondary">{offersByStatus.DRAFT}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="SENT" className="gap-2">
                        Đã gửi <Badge variant="secondary">{offersByStatus.SENT}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="ACCEPTED" className="gap-2">
                        Đã nhận <Badge variant="secondary">{offersByStatus.ACCEPTED}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="REJECTED" className="gap-2">
                        Từ chối <Badge variant="secondary">{offersByStatus.REJECTED}</Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm ứng viên..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ứng viên</TableHead>
                                <TableHead>Vị trí</TableHead>
                                <TableHead>Lương Cơ bản</TableHead>
                                <TableHead>Ngày bắt đầu</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOffers.map((offer) => {
                                const statusStyle = offerStatusLabels[offer.status];

                                return (
                                    <TableRow key={offer.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{offer.candidateName}</p>
                                                <p className="text-sm text-muted-foreground">{offer.candidateEmail}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p>{offer.jobTitle}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatCurrency(offer.salary.base)}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(offer.startDate).toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(offer.status)}
                                                <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedOffer(offer);
                                                        setPreviewDialogOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {offer.status === 'DRAFT' && (
                                                    <Button variant="ghost" size="icon">
                                                        <Send className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredOffers.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không có offer letter nào phù hợp
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Preview Dialog */}
            <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    {selectedOffer && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Offer Letter - {selectedOffer.candidateName}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedOffer.jobTitle}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Candidate Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Họ tên</Label>
                                        <p className="font-medium">{selectedOffer.candidateName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Email</Label>
                                        <p className="font-medium">{selectedOffer.candidateEmail}</p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Job Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <Label className="text-muted-foreground">Vị trí</Label>
                                            <p className="font-medium">{selectedOffer.jobTitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <Label className="text-muted-foreground">Ngày bắt đầu</Label>
                                            <p className="font-medium">
                                                {new Date(selectedOffer.startDate).toLocaleDateString('vi-VN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Salary */}
                                <div className="flex items-start gap-3">
                                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <Label className="text-muted-foreground">Mức lương</Label>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div className="p-3 bg-muted rounded-lg">
                                                <p className="text-sm text-muted-foreground">Lương Cơ bản</p>
                                                <p className="text-lg font-bold text-primary">
                                                    {formatCurrency(selectedOffer.salary.base)}
                                                </p>
                                            </div>
                                            {selectedOffer.salary.bonus && (
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <p className="text-sm text-muted-foreground">Thưởng</p>
                                                    <p className="text-lg font-bold text-green-600">
                                                        {formatCurrency(selectedOffer.salary.bonus)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Benefits */}
                                <div className="flex items-start gap-3">
                                    <Gift className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <Label className="text-muted-foreground">Phúc lợi</Label>
                                        <ul className="mt-2 space-y-1">
                                            {selectedOffer.benefits.map((benefit, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {selectedOffer.notes && (
                                    <>
                                        <Separator />
                                        <div>
                                            <Label className="text-muted-foreground">Ghi chú</Label>
                                            <p className="mt-1 text-sm">{selectedOffer.notes}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                                    Đóng
                                </Button>
                                {selectedOffer.status === 'DRAFT' && (
                                    <Button>
                                        <Send className="mr-2 h-4 w-4" />
                                        Gửi Offer
                                    </Button>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Create Offer Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Tạo Offer Letter mới</DialogTitle>
                        <DialogDescription>
                            Chọn ứng viên đã pass phỏng vấn và điền thông tin offer
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Ứng viên</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn ứng viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Nguyễn Văn An - Store Manager</SelectItem>
                                    <SelectItem value="2">Trần Thị Bình - Marketing Executive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Lương Cơ bản (VNĐ)</Label>
                                <Input type="number" placeholder="15000000" />
                            </div>
                            <div>
                                <Label>Thưởng (VNĐ)</Label>
                                <Input type="number" placeholder="2000000" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Ngày bắt đầu</Label>
                                <Input type="date" />
                            </div>
                            <div>
                                <Label>Loại hợp đồng</Label>
                                <Select defaultValue="PROBATION">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PROBATION">Thử việc</SelectItem>
                                        <SelectItem value="FULLTIME">Toàn thời gian</SelectItem>
                                        <SelectItem value="PARTTIME">Bán thời gian</SelectItem>
                                        <SelectItem value="CONTRACT">Hợp đồng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>Hạn phản hồi</Label>
                            <Input type="date" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setCreateDialogOpen(false)}>Tạo Offer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
