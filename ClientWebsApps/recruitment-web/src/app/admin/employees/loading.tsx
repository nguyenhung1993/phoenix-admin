import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeaderSkeleton actionCount={1} />

            {/* Toolbar skeleton */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-10 flex-1 max-w-sm" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
            </div>

            <TableSkeleton rows={8} columns={7} hasHeader={false} />
        </div>
    );
}
