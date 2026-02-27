'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
interface Candidate { id: string; name: string; email: string; jobTitle: string;[key: string]: unknown; }
import { toast } from 'sonner';

interface EmailComposeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    candidate: Candidate | null;
    onSend: (subject: string, content: string) => void;
}

const EMAIL_TEMPLATES = {
    INTERVIEW_INVITE: {
        subject: 'Mời phỏng vấn - [Job Title]',
        body: `Chào [Candidate Name],

Cảm ơn bạn đã quan tâm đến vị trí [Job Title] tại Phoenix Corp.
Chúng tôi rất ấn tượng với hồ sơ của bạn và muốn mời bạn tham gia phỏng vấn trao đổi thêm.

Thời gian dự kiến: ...
Địa điểm/Link: ...

Trân trọng,
Tuyển dụng Phoenix Corp`,
    },
    OFFER_LETTER: {
        subject: 'Thư mời nhận việc - [Job Title]',
        body: `Chào [Candidate Name],

Chúng tôi rất vui mừng thông báo bạn đã trúng tuyển vị trí [Job Title].
Đính kèm email này là thư mời nhận việc chi tiết.

Chào mừng bạn gia nhập Phoenix Corp!

Trân trọng,
HR Team`,
    },
    REJECTION: {
        subject: 'Thông báo kết quả tuyển dụng - [Job Title]',
        body: `Chào [Candidate Name],

Cảm ơn bạn đã dành thời gian tham gia ứng tuyển tại Phoenix Corp.
Tuy nhiên, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn chưa phù hợp với vị trí [Job Title] tại thời điểm này.

Chúng tôi sẽ lưu hồ sơ của bạn và liên hệ lại khi có cơ hội phù hợp hơn.

Trân trọng,
Tuyển dụng Phoenix Corp`,
    },
};

export function EmailComposeDialog({
    open,
    onOpenChange,
    candidate,
    onSend,
}: EmailComposeDialogProps) {
    const [template, setTemplate] = useState<string>('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open && candidate) {
            setTemplate('');
            setSubject('');
            setBody('');
        }
    }, [open, candidate]);

    const handleTemplateChange = (value: string) => {
        setTemplate(value);
        if (candidate) {
            const tmpl = EMAIL_TEMPLATES[value as keyof typeof EMAIL_TEMPLATES];
            setSubject(tmpl.subject.replace('[Job Title]', candidate.jobTitle));
            setBody(
                tmpl.body
                    .replace('[Candidate Name]', candidate.name)
                    .replace('[Job Title]', candidate.jobTitle)
            );
        }
    };

    const handleSend = async () => {
        if (!subject || !body) {
            toast.error('Vui lòng nhập tiêu đề và nội dung email');
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            onSend(subject, body);
            onOpenChange(false);
            toast.success('Đã gửi email thành công');
        } catch (error) {
            toast.error('Gửi email thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    if (!candidate) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Gửi Email cho {candidate.name}</DialogTitle>
                    <DialogDescription>Soạn thảo email hoặc chọn mẫu có sẵn</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Mẫu Email</Label>
                        <Select value={template} onValueChange={handleTemplateChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn mẫu email..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INTERVIEW_INVITE">Mời phỏng vấn</SelectItem>
                                <SelectItem value="OFFER_LETTER">Thư mời nhận việc (Offer)</SelectItem>
                                <SelectItem value="REJECTION">Thư từ chối</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Tiêu đề</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Nhập tiêu đề email..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="body">Nội dung</Label>
                        <Textarea
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Nội dung email..."
                            className="min-h-[200px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSend} disabled={isLoading}>
                        {isLoading ? 'Đang gửi...' : 'Gửi Email'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
