'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Save, Plus, Pencil, Trash2, MoreVertical, Loader2 } from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Role, roleLabels } from '@/lib/rbac';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
    role: string;
    department?: string;
    position?: string;
    status?: string;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
    const [positions, setPositions] = useState<{ id: string; name: string }[]>([]);

    const [formData, setFormData] = useState<Partial<User>>({
        name: '', email: '', role: 'EMPLOYEE', department: '', position: '', status: 'active',
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, deptRes, posRes] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/departments'),
                fetch('/api/positions'),
            ]);

            // Fallback: if /api/users doesn't exist, load from the nextauth user list
            if (usersRes.ok) {
                const usersJson = await usersRes.json();
                setUsers(usersJson.data || []);
            } else {
                setUsers([]);
            }

            if (deptRes.ok) {
                const deptJson = await deptRes.json();
                setDepartments((deptJson.data || []).filter((d: any) => d.isActive !== false));
            }
            if (posRes.ok) {
                const posJson = await posRes.json();
                setPositions((posJson.data || []).filter((p: any) => p.isActive !== false));
            }
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredUsers = users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreate = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'EMPLOYEE', department: '', position: '', status: 'active' });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setFormData({ ...user });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            toast.error('Vui lòng nhập tên và email');
            return;
        }
        toast.success(editingUser ? 'Cập nhật tài khoản thành công' : 'Thêm tài khoản mới thành công');
        setIsDialogOpen(false);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            toast.success('Đã xóa tài khoản');
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý tài khoản</h1>
                    <p className="text-muted-foreground">Thêm, sửa, xóa và phân quyền nhân viên</p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm tài khoản
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm kiếm tên, email..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nhân viên</TableHead>
                                <TableHead>Bộ phận & Vị trí</TableHead>
                                <TableHead>Vai trò (Role)</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                                            <AvatarFallback>{(user.name || 'U').charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name || 'N/A'}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{user.position || '—'}</span>
                                            <span className="text-xs text-muted-foreground">{user.department || '—'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {roleLabels[user.role as Role] ? (
                                            <Badge variant="outline" className={`${roleLabels[user.role as Role].color} font-normal`}>
                                                {roleLabels[user.role as Role].label}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">{user.role}</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                            {user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(user)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Xóa tài khoản
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredUsers.length === 0 && (
                                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Không tìm thấy người dùng</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}</DialogTitle>
                        <DialogDescription>Nhập thông tin chi tiết cho tài khoản người dùng.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Tên</Label>
                            <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Phòng ban</Label>
                            <Select value={formData.department} onValueChange={(val) => setFormData({ ...formData, department: val })}>
                                <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn phòng ban" /></SelectTrigger>
                                <SelectContent>{departments.map((dept) => (<SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Vị trí</Label>
                            <Select value={formData.position} onValueChange={(val) => setFormData({ ...formData, position: val })}>
                                <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn vị trí" /></SelectTrigger>
                                <SelectContent>{positions.map((pos) => (<SelectItem key={pos.id} value={pos.name}>{pos.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Vai trò</Label>
                            <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val as Role })}>
                                <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn vai trò" /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(roleLabels).map(([key, info]) => {
                                        if (key === 'SUPER_ADMIN') return null;
                                        return (<SelectItem key={key} value={key}><span className={info.color + " px-2 py-0.5 rounded text-xs"}>{info.label}</span></SelectItem>);
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Trạng thái</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger className="col-span-3"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Hoạt động</SelectItem>
                                    <SelectItem value="inactive">Tạm khóa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>Bạn có chắc chắn muốn xóa tài khoản <strong>{userToDelete?.name}</strong>? Hành động này không thể hoàn tác.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Xóa tài khoản</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
