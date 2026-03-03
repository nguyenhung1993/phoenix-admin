import { PageHeaderSkeleton, CardGridSkeleton, TabsSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
    return (
        <div className="space-y-6">
            <PageHeaderSkeleton actionCount={1} />
            <CardGridSkeleton count={4} />
            <TabsSkeleton tabCount={4} />
            <TableSkeleton rows={8} columns={7} />
        </div>
    );
}
