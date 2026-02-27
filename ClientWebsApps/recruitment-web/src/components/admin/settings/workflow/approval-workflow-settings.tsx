"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { ApprovalWorkflow, ApprovalRole } from '@/lib/types/approval';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const ROLE_OPTIONS: { value: ApprovalRole; label: string }[] = [
    { value: 'MANAGER', label: 'Quản lý trực tiếp' },
    { value: 'HR_MANAGER', label: 'Trưởng phòng Nhân sự' },
    { value: 'DIRECTOR', label: 'Giám đốc' },
    { value: 'FINANCE', label: 'Kế toán trưởng' },
    { value: 'IT_ADMIN', label: 'IT Admin' },
];

export function ApprovalWorkflowSettings() {
    const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);

    useEffect(() => {
        fetch('/api/approval-workflows').then(r => r.json()).then(setWorkflows).catch(console.error);
    }, []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<ApprovalWorkflow | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<ApprovalWorkflow>>({
        name: '',
        description: '',
        type: 'LEAVE',
        steps: []
    });

    const handleOpenDialog = (workflow?: ApprovalWorkflow) => {
        if (workflow) {
            setEditingWorkflow(workflow);
            setFormData(JSON.parse(JSON.stringify(workflow))); // Deep copy
        } else {
            setEditingWorkflow(null);
            setFormData({
                name: '',
                description: '',
                type: 'LEAVE',
                steps: [{ order: 1, role: 'MANAGER', label: 'Quản lý trực tiếp' }] // Default step
            });
        }
        setIsDialogOpen(true);
    };

    const handleAddStep = () => {
        const currentSteps = formData.steps || [];
        setFormData({
            ...formData,
            steps: [
                ...currentSteps,
                { order: currentSteps.length + 1, role: 'HR_MANAGER', label: 'Trưởng phòng Nhân sự' }
            ]
        });
    };

    const handleRemoveStep = (index: number) => {
        const currentSteps = formData.steps || [];
        const newSteps = currentSteps.filter((_, i) => i !== index)
            .map((step, i) => ({ ...step, order: i + 1 })); // Re-order
        setFormData({ ...formData, steps: newSteps });
    };

    const handleStepChange = (index: number, role: ApprovalRole) => {
        const currentSteps = formData.steps || [];
        const roleLabel = ROLE_OPTIONS.find(r => r.value === role)?.label || role;
        const newSteps = [...currentSteps];
        newSteps[index] = { ...newSteps[index], role, label: roleLabel };
        setFormData({ ...formData, steps: newSteps });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.type || (formData.steps?.length || 0) === 0) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (editingWorkflow) {
            const res = await fetch('/api/approval-workflows', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingWorkflow.id, ...formData }) });
            const updated = await res.json();
            setWorkflows(prev => prev.map(w => w.id === editingWorkflow.id ? updated : w));
            toast.success("Đã cập nhật quy trình");
        } else {
            const res = await fetch('/api/approval-workflows', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            const newWorkflow = await res.json();
            setWorkflows(prev => [...prev, newWorkflow]);
            toast.success("Đã tạo quy trình mới");
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa quy trình này?")) {
            await fetch(`/api/approval-workflows?id=${id}`, { method: 'DELETE' });
            setWorkflows(prev => prev.filter(w => w.id !== id));
            toast.success("Đã xóa quy trình");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Cấu hình Phê duyệt</h2>
                    <p className="text-sm text-muted-foreground">Thiết lập luồng duyệt động cho từng loại yêu cầu.</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm quy trình
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {workflows.map((workflow) => (
                    <Card key={workflow.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="outline">{workflow.type}</Badge>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(workflow)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(workflow.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardTitle className="mt-2 text-base">{workflow.name}</CardTitle>
                            <CardDescription>{workflow.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-4">
                                <p className="text-xs font-medium uppercase text-muted-foreground">Quy trình duyệt:</p>
                                <div className="space-y-2 relative">
                                    {/* Timeline connector line */}
                                    <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-border -z-10" />

                                    {workflow.steps.map((step, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border-2 border-background shrink-0">
                                                {step.order}
                                            </div>
                                            <div className="text-sm bg-muted/50 px-3 py-1.5 rounded-md flex-1">
                                                {step.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingWorkflow ? 'Chỉnh sửa quy trình' : 'Thêm quy trình mới'}</DialogTitle>
                        <DialogDescription>
                            Định nghĩa các bước phê duyệt cho loại yêu cầu này.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tên quy trình</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: Quy trình nghỉ phép > 3 ngày"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Loại yêu cầu</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LEAVE">Nghỉ phép (Leave)</SelectItem>
                                        <SelectItem value="OVERTIME">Làm thêm giờ (OT)</SelectItem>
                                        <SelectItem value="ASSET_REQUEST">Yêu cầu tài sản</SelectItem>
                                        <SelectItem value="PROMOTION">Đề xuất thăng chức</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Mô tả</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Mô tả ngắn về quy trình này"
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <Label>Các bước phê duyệt</Label>
                                <Button size="sm" variant="outline" onClick={handleAddStep} type="button">
                                    <Plus className="mr-2 h-3 w-3" />
                                    Thêm bước
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {formData.steps?.map((step, index) => (
                                    <div key={index} className="flex items-end gap-3">
                                        <div className="flex h-10 w-8 items-center justify-center font-bold text-muted-foreground">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <Label className="text-xs">Người duyệt</Label>
                                            <Select
                                                value={step.role}
                                                onValueChange={(val: any) => handleStepChange(index, val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ROLE_OPTIONS.map(opt => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => handleRemoveStep(index)}
                                            disabled={formData.steps!.length <= 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSave}>Lưu thay đổi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
