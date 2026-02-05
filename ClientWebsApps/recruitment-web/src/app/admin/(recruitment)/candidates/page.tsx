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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCandidates, candidateStatusLabels, Candidate, formatDate } from '@/lib/mocks';
import { Search, Download, Eye, Mail, Phone, Star } from 'lucide-react';

export default function AdminCandidatesPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    const filteredCandidates = mockCandidates.filter((candidate) => {
        const matchesSearch =
            candidate.name.toLowerCase().includes(search.toLowerCase()) ||
            candidate.email.toLowerCase().includes(search.toLowerCase()) ||
            candidate.jobTitle.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || candidate.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const candidatesByStatus = {
        ALL: mockCandidates.length,
        NEW: mockCandidates.filter((c) => c.status === 'NEW').length,
        SCREENING: mockCandidates.filter((c) => c.status === 'SCREENING').length,
        INTERVIEW: mockCandidates.filter((c) => c.status === 'INTERVIEW').length,
        OFFER: mockCandidates.filter((c) => c.status === 'OFFER').length,
        HIRED: mockCandidates.filter((c) => c.status === 'HIRED').length,
        REJECTED: mockCandidates.filter((c) => c.status === 'REJECTED').length,
    };

    const handleStatusChange = (candidateId: string, newStatus: string) => {
        console.log('Updating candidate', candidateId, 'to status', newStatus);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Quản lý ứng viên</h1>
                <p className="text-muted-foreground">Xem và quản lý hồ sơ ứng viên</p>
            </div>

            {/* Status Tabs */}
            <Tabs defaultValue="ALL" onValueChange={setStatusFilter}>
                <TabsList className="flex-wrap h-auto gap-2">
                    <TabsTrigger value="ALL" className="gap-2">
                        Tất cả <Badge variant="secondary">{candidatesByStatus.ALL}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="NEW" className="gap-2">
                        Mới <Badge variant="secondary">{candidatesByStatus.NEW}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="SCREENING" className="gap-2">
                        Sàng lọc <Badge variant="secondary">{candidatesByStatus.SCREENING}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="INTERVIEW" className="gap-2">
                        Phỏng vấn <Badge variant="secondary">{candidatesByStatus.INTERVIEW}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="OFFER" className="gap-2">
                        Đề xuất <Badge variant="secondary">{candidatesByStatus.OFFER}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="REJECTED" className="gap-2">
                        Từ chối <Badge variant="secondary">{candidatesByStatus.REJECTED}</Badge>
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
                                <TableHead>Vị trí ứng tuyển</TableHead>
                                <TableHead>Nguồn</TableHead>
                                <TableHead>Ngày nộp</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCandidates.map((candidate) => {
                                const statusStyle = candidateStatusLabels[candidate.status];
                                return (
                                    <TableRow key={candidate.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{candidate.name}</p>
                                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{candidate.jobTitle}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{candidate.source}</Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(candidate.appliedDate)}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedCandidate(candidate);
                                                        setDetailDialogOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredCandidates.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Không có ứng viên nào phù hợp
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Candidate Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-lg">
                    {selectedCandidate && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedCandidate.name}</DialogTitle>
                                <DialogDescription>
                                    Ứng tuyển: {selectedCandidate.jobTitle}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <a href={`mailto:${selectedCandidate.email}`} className="text-primary hover:underline">
                                        {selectedCandidate.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a href={`tel:${selectedCandidate.phone}`} className="text-primary hover:underline">
                                        {selectedCandidate.phone}
                                    </a>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nguồn</p>
                                        <p className="font-medium">{selectedCandidate.source}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ngày nộp</p>
                                        <p className="font-medium">{formatDate(selectedCandidate.appliedDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                                        <Badge variant={candidateStatusLabels[selectedCandidate.status].variant}>
                                            {candidateStatusLabels[selectedCandidate.status].label}
                                        </Badge>
                                    </div>
                                    {selectedCandidate.rating && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Đánh giá</p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < selectedCandidate.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {selectedCandidate.notes && (
                                    <div className="pt-2 border-t">
                                        <p className="text-sm font-medium mb-1">Ghi chú:</p>
                                        <p className="text-sm text-muted-foreground">{selectedCandidate.notes}</p>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" asChild>
                                    <a href={selectedCandidate.cvUrl} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Tải CV
                                    </a>
                                </Button>
                                <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
