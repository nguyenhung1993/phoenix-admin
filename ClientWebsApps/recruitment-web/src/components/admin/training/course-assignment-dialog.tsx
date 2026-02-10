'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Course } from '@/lib/mocks/training';
import { mockEmployees } from '@/lib/mocks/hrm';

interface CourseAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: Course | null;
}

export function CourseAssignmentDialog({ open, onOpenChange, course }: CourseAssignmentDialogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    if (!course) return null;

    const filteredEmployees = mockEmployees.filter(emp =>
        emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleEmployee = (id: string) => {
        if (selectedEmployeeIds.includes(id)) {
            setSelectedEmployeeIds(prev => prev.filter(e => e !== id));
        } else {
            setSelectedEmployeeIds(prev => [...prev, id]);
        }
    };

    const handleAssign = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success(`Đã giao khóa học "${course.title}"`, {
            description: `Đã giao cho ${selectedEmployeeIds.length} nhân viên.`
        });

        setIsLoading(false);
        onOpenChange(false);
        setSelectedEmployeeIds([]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Giao khóa học</DialogTitle>
                    <DialogDescription>
                        Chọn nhân viên để giao khóa học <span className="font-medium text-foreground">{course.title}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm nhân viên..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="border rounded-md">
                        <div className="p-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground flex justify-between items-center">
                            <span>Danh sách nhân viên</span>
                            <span>Đã chọn: {selectedEmployeeIds.length}</span>
                        </div>
                        <ScrollArea className="h-[300px]">
                            <div className="p-2 space-y-1">
                                {filteredEmployees.map(emp => (
                                    <div
                                        key={emp.id}
                                        className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                                        onClick={() => toggleEmployee(emp.id)}
                                    >
                                        <Checkbox
                                            checked={selectedEmployeeIds.includes(emp.id)}
                                            onCheckedChange={() => toggleEmployee(emp.id)}
                                        />
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={emp.avatar} alt={emp.fullName} />
                                            <AvatarFallback>{emp.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">{emp.fullName}</p>
                                            <p className="text-xs text-muted-foreground truncate">{emp.positionName}</p>
                                        </div>
                                    </div>
                                ))}
                                {filteredEmployees.length === 0 && (
                                    <p className="text-center text-sm text-muted-foreground py-8">
                                        Không tìm thấy nhân viên nào
                                    </p>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={handleAssign} disabled={selectedEmployeeIds.length === 0 || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Giao khóa học
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
