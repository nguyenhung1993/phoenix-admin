'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Shield,
    Search,
    ChevronLeft,
    ChevronRight,
    Activity,
    Filter,
    Loader2,
} from 'lucide-react';
import { PageHeaderSkeleton, TableSkeleton } from '@/components/ui/skeletons';

interface AuditLogEntry {
    id: string;
    userId: string | null;
    userName: string | null;
    action: string;
    target: string;
    status: string;
    ip: string | null;
    createdAt: string;
    user?: {
        name: string | null;
        email: string | null;
        image: string | null;
    } | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const actionColors: Record<string, string> = {
    CREATE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    APPROVE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    REJECT: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    LOGIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    EXPORT: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
};

function getActionType(action: string): string {
    const parts = action.split(':');
    return parts[0].trim();
}

function getActionBadgeColor(action: string): string {
    const type = getActionType(action);
    return actionColors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 25, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('all');

    const fetchLogs = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '25' });
            if (search) params.set('q', search);
            if (actionFilter !== 'all') params.set('action', actionFilter);

            const res = await fetch(`/api/audit-logs?${params}`);
            const json = await res.json();
            setLogs(json.data || []);
            setPagination(json.pagination || { page: 1, limit: 25, total: 0, totalPages: 0 });
        } catch {
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }, [search, actionFilter]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchLogs(1);
    };

    if (loading && logs.length === 0) {
        return (
            <div className="space-y-6">
                <PageHeaderSkeleton hasActions={false} />
                <TableSkeleton rows={10} columns={6} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Nhật ký hoạt động
                </h1>
                <p className="text-muted-foreground">
                    Theo dõi tất cả thao tác trong hệ thống ({pagination.total} bản ghi)
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo tên, hành động, đối tượng..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); }}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Loại hành động" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="CREATE">Tạo mới</SelectItem>
                                <SelectItem value="UPDATE">Cập nhật</SelectItem>
                                <SelectItem value="DELETE">Xóa</SelectItem>
                                <SelectItem value="APPROVE">Duyệt</SelectItem>
                                <SelectItem value="REJECT">Từ chối</SelectItem>
                                <SelectItem value="LOGIN">Đăng nhập</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tìm'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Lịch sử thao tác
                    </CardTitle>
                    <CardDescription>
                        Trang {pagination.page} / {pagination.totalPages || 1}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Thời gian</TableHead>
                                <TableHead>Người thực hiện</TableHead>
                                <TableHead>Hành động</TableHead>
                                <TableHead>Đối tượng</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>IP</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        Chưa có nhật ký hoạt động nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-sm whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString('vi-VN')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-7 w-7">
                                                    <AvatarImage src={log.user?.image || undefined} />
                                                    <AvatarFallback className="text-xs">
                                                        {(log.userName || log.user?.name || '?')[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium truncate max-w-[150px]">
                                                    {log.userName || log.user?.name || 'System'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={getActionBadgeColor(log.action)}>
                                                {log.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm max-w-[200px] truncate">
                                            {log.target}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                                                {log.status === 'success' ? 'OK' : 'Lỗi'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground font-mono">
                                            {log.ip || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.page <= 1}
                                onClick={() => fetchLogs(pagination.page - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Trước
                            </Button>
                            <span className="text-sm font-medium">
                                {pagination.page} / {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => fetchLogs(pagination.page + 1)}
                            >
                                Sau
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
