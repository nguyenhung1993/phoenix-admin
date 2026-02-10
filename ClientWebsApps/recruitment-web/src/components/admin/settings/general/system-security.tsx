'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { getAuditLogs, getSecurityConfig } from '@/lib/mocks/settings';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SystemSecurity() {
    const [securityConfig, setSecurityConfig] = useState(getSecurityConfig());
    const [auditLogs] = useState(getAuditLogs());

    const handleResetSystem = () => {
        if (confirm('CẢNH BÁO: Hành động này sẽ xóa toàn bộ dữ liệu test và đưa hệ thống về trạng thái ban đầu. Bạn có chắc chắn không?')) {
            toast.info('Đang reset hệ thống...');
            setTimeout(() => toast.success('Hệ thống đã được reset!'), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Hệ thống & Bảo mật</h3>
                <p className="text-sm text-muted-foreground">Bảo mật, nhật ký hệ thống và quản lý dữ liệu.</p>
            </div>
            <Separator />

            {/* Security Section */}
            <div className="space-y-4">
                <Card>
                    <CardHeader className="pb-3 px-6 py-4">
                        <CardTitle className="text-base">Chính sách mật khẩu</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                                <Label>Yêu cầu ký tự đặc biệt</Label>
                                <Switch checked={securityConfig.requireSpecialChar} onCheckedChange={c => setSecurityConfig({ ...securityConfig, requireSpecialChar: c })} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Bắt buộc 2FA (Admin)</Label>
                                <Switch checked={securityConfig.mfaEnabled} onCheckedChange={c => setSecurityConfig({ ...securityConfig, mfaEnabled: c })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Độ dài tối thiểu</Label>
                                <Input type="number" value={securityConfig.passwordMinLength} onChange={e => setSecurityConfig({ ...securityConfig, passwordMinLength: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Thời gian chờ phiên (phút)</Label>
                                <Input type="number" value={securityConfig.sessionTimeoutMinutes} onChange={e => setSecurityConfig({ ...securityConfig, sessionTimeoutMinutes: Number(e.target.value) })} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Audit Log Preview */}
            <div className="space-y-4 pt-0">
                <Card>
                    <CardHeader className="pb-3 px-6 py-4">
                        <CardTitle className="text-base">Nhật ký hoạt động (Xem trước)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table className="[&_tr>th]:px-6 [&_tr>td]:px-6">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Người dùng</TableHead>
                                    <TableHead>Hành động</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Thời gian</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditLogs.slice(0, 3).map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.userName}</TableCell>
                                        <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                                        <TableCell>
                                            {log.status === 'success' ? <span className="text-green-600 text-xs">Thành công</span> : <span className="text-red-500 text-xs">Thất bại</span>}
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-2 text-center border-t bg-muted/20">
                            <Button variant="link" size="sm" className="h-auto p-0">Xem toàn bộ Nhật ký</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Data Management */}
            <div className="space-y-4 pt-0">
                <Card className="border-red-200 bg-red-50/10">
                    <CardHeader className="pb-3 px-6 py-4">
                        <CardTitle className="text-base text-red-700 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Quản lý dữ liệu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex justify-between items-center">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Khôi phục dữ liệu gốc</p>
                            <p className="text-xs text-muted-foreground">Xóa dữ liệu test trở về mặc định.</p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={handleResetSystem}>
                            Đặt lại Hệ thống
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
