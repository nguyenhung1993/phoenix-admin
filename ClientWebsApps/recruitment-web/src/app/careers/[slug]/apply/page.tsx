'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockJobs } from '@/lib/mocks';
import { ArrowLeft, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

interface ApplyPageProps {
    params: Promise<{ slug: string }>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

const applySchema = z.object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),
    linkedin: z.string().url('Link không hợp lệ').optional().or(z.literal('')),
    github: z.string().url('Link không hợp lệ').optional().or(z.literal('')),
    coverLetter: z.string().optional(),
});

export default function ApplyPage({ params }: ApplyPageProps) {
    const { slug } = use(params);
    const router = useRouter();
    const job = mockJobs.find((j) => j.slug === slug);

    const [isSuccess, setIsSuccess] = useState(false);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof applySchema>>({
        resolver: zodResolver(applySchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            linkedin: '',
            github: '',
            coverLetter: '',
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError(null);

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setFileError('File không được vượt quá 5MB');
                setCvFile(null);
                return;
            }
            if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
                setFileError('Chỉ chấp nhận file PDF');
                setCvFile(null);
                return;
            }
            setCvFile(file);
        }
    };

    const onSubmit = async (values: z.infer<typeof applySchema>) => {
        if (!cvFile) {
            setFileError('Vui lòng tải lên CV');
            return;
        }

        try {
            // Simulate saving application to database
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Send confirmation email
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'application-received',
                    to: values.email,
                    data: {
                        candidateName: values.fullName,
                        jobTitle: job?.title || 'Vị trí ứng tuyển',
                        companyName: 'Phoenix VN',
                    },
                }),
            });

            console.log({ ...values, cvFile });
            setIsSuccess(true);
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    if (!job) {
        return (
            <div className="container py-16 text-center">
                <p className="text-muted-foreground">Không tìm thấy vị trí này.</p>
                <Button variant="link" asChild>
                    <Link href="/careers">Quay lại danh sách</Link>
                </Button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="container py-16 max-w-lg mx-auto text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Ứng tuyển thành công!</h1>
                <p className="text-muted-foreground mb-6">
                    Cảm ơn bạn đã ứng tuyển vị trí <strong>{job.title}</strong>.
                    Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button variant="outline" asChild>
                        <Link href="/careers">Xem vị trí khác</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/">Về trang chủ</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Breadcrumb */}
            <section className="py-4 border-b">
                <div className="container">
                    <Link href={`/careers/${job.slug}`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại {job.title}
                    </Link>
                </div>
            </section>

            {/* Apply Form */}
            <section className="py-12">
                <div className="container max-w-2xl">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Ứng tuyển vị trí</CardTitle>
                            <CardDescription className="text-lg">{job.title}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Full Name */}
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Họ và tên *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nguyễn Văn A" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Phone */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số điện thoại *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0912 345 678" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* CV Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="cv">CV (PDF) *</Label>
                                        <div className={`border-2 border-dashed rounded-lg p-6 text-center transisiton-colors ${fileError ? 'border-destructive/50 bg-destructive/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}>
                                            <input
                                                type="file"
                                                id="cv"
                                                accept=".pdf"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <label htmlFor="cv" className="cursor-pointer block">
                                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                                {cvFile ? (
                                                    <div className="flex items-center justify-center gap-2 text-primary font-medium">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        {cvFile.name}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="text-sm text-muted-foreground">
                                                            Kéo thả hoặc <span className="text-primary font-medium">chọn file</span>
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">PDF, tối đa 5MB</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                        {fileError && (
                                            <p className="text-[0.8rem] font-medium text-destructive flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {fileError}
                                            </p>
                                        )}
                                    </div>

                                    {/* LinkedIn */}
                                    <FormField
                                        control={form.control}
                                        name="linkedin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>LinkedIn (tùy chọn)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* GitHub */}
                                    <FormField
                                        control={form.control}
                                        name="github"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>GitHub (tùy chọn)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://github.com/yourusername" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Cover Letter */}
                                    <FormField
                                        control={form.control}
                                        name="coverLetter"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Thư giới thiệu (tùy chọn)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Hãy cho chúng tôi biết tại sao bạn phù hợp với vị trí này..."
                                                        rows={5}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit */}
                                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang gửi...
                                            </>
                                        ) : (
                                            'Gửi hồ sơ ứng tuyển'
                                        )}
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground">
                                        Bằng việc gửi hồ sơ, bạn đồng ý với{' '}
                                        <Link href="#" className="underline">Chính sách bảo mật</Link> của chúng tôi.
                                    </p>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </>
    );
}
