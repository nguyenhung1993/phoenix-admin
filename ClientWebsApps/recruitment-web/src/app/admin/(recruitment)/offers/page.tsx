'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
    OfferItem,
    OfferStatus,
    offerStatusLabels,
    CandidateItem,
} from '@/lib/schemas/recruitment';
import { formatCurrency } from '@/lib/utils';
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
    Loader2,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOffersPage() {
    const [offers, setOffers] = useState<OfferItem[]>([]);
    const [candidates, setCandidates] = useState<CandidateItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedOffer, setSelectedOffer] = useState<OfferItem | null>(null);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Create form state
    const [formCandidateId, setFormCandidateId] = useState('');
    const [formSalaryBase, setFormSalaryBase] = useState('');
    const [formSalaryBonus, setFormSalaryBonus] = useState('');
    const [formStartDate, setFormStartDate] = useState('');
    const [formExpiryDate, setFormExpiryDate] = useState('');
    const [formNotes, setFormNotes] = useState('');

    const fetchOffers = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter !== 'ALL') params.set('status', statusFilter);

            const res = await fetch(`/api/offers?${params}`);
            const data = await res.json();
            setOffers(data.data || []);
        } catch {
            toast.error('Không thể tải dữ liệu offer');
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    const fetchCandidates = async () => {
        try {
            const res = await fetch('/api/candidates?limit=100');
            const data = await res.json();
            setCandidates(data.data || []);
        } catch {
            console.warn('Could not load candidates');
        }
    };

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const offersByStatus = {
        ALL: offers.length,
        DRAFT: offers.filter((o) => o.status === 'DRAFT').length,
        SENT: offers.filter((o) => o.status === 'SENT').length,
        ACCEPTED: offers.filter((o) => o.status === 'ACCEPTED').length,
        REJECTED: offers.filter((o) => o.status === 'REJECTED').length,
    };

    const acceptanceRate = offersByStatus.ACCEPTED + offersByStatus.REJECTED > 0
        ? Math.round((offersByStatus.ACCEPTED / (offersByStatus.ACCEPTED + offersByStatus.REJECTED)) * 100)
        : 0;

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

    const handleCreate = async () => {
        if (!formCandidateId || !formSalaryBase || !formStartDate || !formExpiryDate) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    candidateId: formCandidateId,
                    salaryBase: parseFloat(formSalaryBase),
                    salaryBonus: formSalaryBonus ? parseFloat(formSalaryBonus) : null,
                    startDate: formStartDate,
                    expiryDate: formExpiryDate,
                    notes: formNotes || null,
                    benefits: [],
                }),
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Đã tạo Offer Letter');
            setCreateDialogOpen(false);
            resetForm();
            fetchOffers();
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendOffer = async (offerId: string) => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/offers/${offerId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'SENT' }),
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Đã gửi Offer Letter');
            setPreviewDialogOpen(false);
            fetchOffers();
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAcceptOffer = async (offerId: string) => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/offers/${offerId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'ACCEPTED' }),
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Offer đã được chấp nhận');
            setPreviewDialogOpen(false);
            fetchOffers();
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRejectOffer = async (offerId: string) => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/offers/${offerId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'REJECTED' }),
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Offer đã bị từ chối');
            setPreviewDialogOpen(false);
            fetchOffers();
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteOffer = async (offerId: string) => {
        if (!confirm('Bạn có chắc muốn xóa offer này?')) return;
        try {
            const res = await fetch(`/api/offers/${offerId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            toast.success('Đã xóa Offer Letter');
            fetchOffers();
        } catch {
            toast.error('Có lỗi xảy ra');
        }
    };

    const resetForm = () => {
        setFormCandidateId('');
        setFormSalaryBase('');
        setFormSalaryBonus('');
        setFormStartDate('');
        setFormExpiryDate('');
        setFormNotes('');
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
                                <p className="text-2xl font-bold">{acceptanceRate}%</p>
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
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
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
                                    {offers.map((offer) => {
                                        const statusStyle = offerStatusLabels[offer.status as OfferStatus];

                                        return (
                                            <TableRow key={offer.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{offer.candidate?.name || 'N/A'}</p>
                                                        <p className="text-sm text-muted-foreground">{offer.candidate?.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{offer.job?.title || 'N/A'}</TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(offer.salaryBase)}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(offer.startDate).toLocaleDateString('vi-VN')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(offer.status)}
                                                        {statusStyle && (
                                                            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Xem chi tiết"
                                                            onClick={() => {
                                                                setSelectedOffer(offer);
                                                                setPreviewDialogOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {offer.status === 'DRAFT' && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Gửi offer"
                                                                    onClick={() => handleSendOffer(offer.id)}
                                                                >
                                                                    <Send className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Xóa"
                                                                    onClick={() => handleDeleteOffer(offer.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            {offers.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    Không có offer letter nào phù hợp
                                </div>
                            )}
                        </>
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
                                    Offer Letter - {selectedOffer.candidate?.name}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedOffer.job?.title}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Candidate Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Họ tên</Label>
                                        <p className="font-medium">{selectedOffer.candidate?.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Email</Label>
                                        <p className="font-medium">{selectedOffer.candidate?.email}</p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Job Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <Label className="text-muted-foreground">Vị trí</Label>
                                            <p className="font-medium">{selectedOffer.job?.title}</p>
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
                                                    {formatCurrency(selectedOffer.salaryBase)}
                                                </p>
                                            </div>
                                            {selectedOffer.salaryBonus && (
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <p className="text-sm text-muted-foreground">Thưởng</p>
                                                    <p className="text-lg font-bold text-green-600">
                                                        {formatCurrency(selectedOffer.salaryBonus)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Benefits */}
                                {selectedOffer.benefits.length > 0 && (
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
                                )}

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

                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                                    Đóng
                                </Button>
                                {selectedOffer.status === 'DRAFT' && (
                                    <Button onClick={() => handleSendOffer(selectedOffer.id)} disabled={submitting}>
                                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                        Gửi Offer
                                    </Button>
                                )}
                                {selectedOffer.status === 'SENT' && (
                                    <>
                                        <Button variant="destructive" onClick={() => handleRejectOffer(selectedOffer.id)} disabled={submitting}>
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Từ chối
                                        </Button>
                                        <Button onClick={() => handleAcceptOffer(selectedOffer.id)} disabled={submitting}>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Chấp nhận
                                        </Button>
                                    </>
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
                            <Label>Ứng viên *</Label>
                            <Select value={formCandidateId} onValueChange={setFormCandidateId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn ứng viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    {candidates
                                        .filter(c => ['INTERVIEW', 'OFFER'].includes(c.status))
                                        .map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.name} - {c.job?.title || 'N/A'}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Lương Cơ bản (VNĐ) *</Label>
                                <Input
                                    type="number"
                                    placeholder="15000000"
                                    value={formSalaryBase}
                                    onChange={(e) => setFormSalaryBase(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Thưởng (VNĐ)</Label>
                                <Input
                                    type="number"
                                    placeholder="2000000"
                                    value={formSalaryBonus}
                                    onChange={(e) => setFormSalaryBonus(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Ngày bắt đầu *</Label>
                                <Input
                                    type="date"
                                    value={formStartDate}
                                    onChange={(e) => setFormStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Hạn phản hồi *</Label>
                                <Input
                                    type="date"
                                    value={formExpiryDate}
                                    onChange={(e) => setFormExpiryDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Ghi chú</Label>
                            <Textarea
                                placeholder="Ghi chú thêm..."
                                value={formNotes}
                                onChange={(e) => setFormNotes(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleCreate} disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Tạo Offer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
