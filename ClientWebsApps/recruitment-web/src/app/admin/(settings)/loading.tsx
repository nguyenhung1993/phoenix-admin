import { PageHeaderSkeleton, FormSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
    return (
        <div className="space-y-6">
            <PageHeaderSkeleton hasActions={false} />
            <FormSkeleton fields={8} columns={2} />
        </div>
    );
}
