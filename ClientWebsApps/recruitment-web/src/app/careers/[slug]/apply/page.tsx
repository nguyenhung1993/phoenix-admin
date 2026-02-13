'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ApplyPageProps {
    params: Promise<{ slug: string }>;
}

export default function ApplyPage({ params }: ApplyPageProps) {
    const { slug } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
    });
    const [cvFile, setCvFile] = useState<File | null>(null);

    // Fetch job details first? 
    // Ideally we should fetch job details to display title and verify it exists/is published.
    // For simplicity, we assume slug matches a job or API will validate.
    // We can fetch job title client-side or pass from layout/server component.
    // Let's do a quick fetch to get Job ID and Title.
    const [job, setJob] = useState<{ id: string; title: string } | null>(null);

    useState(() => {
        fetch(`/api/public/jobs/${slug}`)
            .then(res => res.json())
            .then(data => {
                if (data.id) setJob(data);
                else {
                    toast.error('Không tìm thấy tin tuyển dụng');
                    router.push('/careers');
                }
            })
            .catch(() => {
                toast.error('Lỗi tải thông tin');
            });
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be < 5MB');
                return;
            }
            setCvFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!job) return;
        if (!cvFile) {
            toast.error('Vui lòng tải lên CV của bạn');
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append('jobId', job.id);
            data.append('fullName', formData.fullName);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('coverLetter', formData.coverLetter);
            data.append('cv', cvFile);

            const res = await fetch('/api/public/apply', {
                method: 'POST',
                body: data,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to submit');
            }

            setSuccess(true);
            toast.success('Ứng tuyển thành công!');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container max-w-md py-16 text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Ứng tuyển thành công!</h1>
                <p className="text-muted-foreground mb-8">
                    Cảm ơn bạn đã quan tâm đến vị trí <strong>{job?.title}</strong> tại Phoenix.
                    Chúng tôi sẽ xem xét hồ sơ và liên hệ với bạn trong thời gian sớm nhất.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button asChild>
                        <Link href="/careers">Xem vị trí khác</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-12">
            <div className="mb-6">
                <Link href={`/careers/${slug}`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại chi tiết công việc
                </Link>
                <h1 className="text-2xl font-bold">Ứng tuyển: {job?.title || '...'}</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin ứng tuyển</CardTitle>
                    <CardDescription>Vui lòng điền đầy đủ thông tin bên dưới</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></Label>
                                <Input
                                    id="fullName"
                                    required
                                    placeholder="Nguyễn Văn A"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
                                <Input
                                    id="phone"
                                    required
                                    placeholder="0912..."
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cv">CV / Resume (PDF, DOCX) <span className="text-red-500">*</span></Label>
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('cv')?.click()}
                                    className="w-full h-24 border-dashed"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            {cvFile ? cvFile.name : 'Click để tải lên CV'}
                                        </span>
                                    </div>
                                </Button>
                                <Input
                                    id="cv"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="coverLetter">Thư giới thiệu (Không bắt buộc)</Label>
                            <Textarea
                                id="coverLetter"
                                placeholder="Hãy cho chúng tôi biết vì sao bạn phù hợp với vị trí này..."
                                className="min-h-[120px]"
                                value={formData.coverLetter}
                                onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={loading || !job}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang gửi hồ sơ...
                                    </>
                                ) : (
                                    'Gửi hồ sơ ứng tuyển'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
