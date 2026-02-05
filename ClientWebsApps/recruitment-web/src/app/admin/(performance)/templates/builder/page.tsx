'use client';

import { useRouter } from 'next/navigation';
import FormBuilder, { FormBuilderData } from '@/components/performance/FormBuilder';

export default function TemplateBuilderPage() {
    const router = useRouter();

    const handleSave = (data: FormBuilderData) => {
        console.log('Template saved:', data);
        // TODO: Call API to save template
        router.push('/admin/templates');
    };

    const handleCancel = () => {
        router.push('/admin/templates');
    };

    return (
        <FormBuilder
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
}
