'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { JobForm } from '@/components/recruitment/job-form';
import { JobItem } from '@/lib/schemas/recruitment';
import { Loader2 } from 'lucide-react';

export default function EditJobPage() {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<JobItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                if (!res.ok) throw new Error('Không tìm thấy vị trí');
                const data = await res.json();
                setJob(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                {error || 'Không tìm thấy vị trí'}
            </div>
        );
    }

    return <JobForm initialData={job} />;
}
