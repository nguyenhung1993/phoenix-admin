import { PageHeaderSkeleton, CardGridSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
    return (
        <div className="space-y-6">
            <PageHeaderSkeleton actionCount={2} />
            <CardGridSkeleton count={3} columns="grid-cols-1 md:grid-cols-3" />
            <TableSkeleton rows={6} columns={6} />
        </div>
    );
}
