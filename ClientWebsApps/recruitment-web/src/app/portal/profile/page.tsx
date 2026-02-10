'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { mockEmployees, mockDepartments, mockPositions, mockContracts } from '@/lib/mocks/hrm';

export default function ProfilePage() {
    const { data: session } = useSession();

    // In real app, fetch employee data based on session user ID
    // For mock, we'll try to find a matching employee or default to the first one
    const employee = mockEmployees.find(e => e.email === session?.user?.email) || mockEmployees[0];

    // Find related data
    const department = mockDepartments.find(d => d.id === employee.departmentId);
    const position = mockPositions.find(p => p.id === employee.positionId);
    const contract = mockContracts.find(c => c.employeeId === employee.id);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        phone: employee.phone,
        address: employee.address || '',
        emergencyContact: 'Người thân (0987...)',
    });

    const handleSave = () => {
        // Here you would call API to update profile
        toast.success("Đã cập nhật hồ sơ thành công!");
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
                <p className="text-muted-foreground">Xem và cập nhật thông tin của bạn</p>
            </div>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                {/* Profile Card */}
                <Card>
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={session?.user?.image || undefined} />
                                <AvatarFallback>{employee.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle>{employee.fullName}</CardTitle>
                        <CardDescription>{employee.email}</CardDescription>
                        <div className="mt-2">
                            <Badge variant="secondary" className="mt-2">{position?.name || employee.positionName}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Mã nhân viên:</span>
                                <span className="font-medium">{employee.employeeCode}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Phòng ban:</span>
                                <span className="font-medium">{department?.name || employee.departmentName}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Ngày vào làm:</span>
                                <span className="font-medium">{new Date(employee.hireDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Trạng thái:</span>
                                <Badge variant={employee.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                    {employee.status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Tabs */}
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                        <TabsTrigger value="contract">Hợp đồng & Lương</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin liên hệ</CardTitle>
                                <CardDescription>Thông tin liên lạc và cá nhân của bạn</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Địa chỉ</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="emergency">Liên hệ khẩn cấp</Label>
                                    <Input
                                        id="emergency"
                                        value={formData.emergencyContact}
                                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                {isEditing ? (
                                    <>
                                        <Button variant="ghost" onClick={() => setIsEditing(false)}>Hủy</Button>
                                        <Button onClick={handleSave}>Lưu thay đổi</Button>
                                    </>
                                ) : (
                                    <Button variant="outline" onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                                )}
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contract">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin hợp đồng</CardTitle>
                                <CardDescription>Chi tiết hợp đồng lao động hiện tại</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Loại hợp đồng</Label>
                                        <div className="font-medium">{employee.contractTypeName || 'Hợp đồng chính thức'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Ngày ký</Label>
                                        <div className="font-medium">{contract ? new Date(contract.startDate).toLocaleDateString('vi-VN') : '---'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Lương cơ bản</Label>
                                        <div className="font-medium">{contract ? contract.salary.toLocaleString() : '---'} VNĐ</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Số người phụ thuộc</Label>
                                        <div className="font-medium">1</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Mã số thuế</Label>
                                        <div className="font-medium">{employee.taxCode || '---'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Số BHXH</Label>
                                        <div className="font-medium">7482910384</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
