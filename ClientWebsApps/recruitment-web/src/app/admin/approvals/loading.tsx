import { PageHeaderSkeleton, TabsSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
    return (
        <div className="space-y-6">
            <PageHeaderSkeleton actionCount={1} />
            <TabsSkeleton tabCount={4} />
            <TableSkeleton rows={6} columns={6} />
        </div>
    );
}
