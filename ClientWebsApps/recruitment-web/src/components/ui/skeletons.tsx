import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ========== PAGE HEADER SKELETON ==========

interface PageHeaderSkeletonProps {
    hasActions?: boolean;
    actionCount?: number;
}

export function PageHeaderSkeleton({ hasActions = true, actionCount = 1 }: PageHeaderSkeletonProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>
            {hasActions && (
                <div className="flex gap-2">
                    {Array.from({ length: actionCount }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-32" />
                    ))}
                </div>
            )}
        </div>
    );
}

// ========== CARD GRID SKELETON ==========

interface CardGridSkeletonProps {
    count?: number;
    columns?: string;
}

export function CardGridSkeleton({ count = 4, columns = "grid-cols-2 md:grid-cols-4" }: CardGridSkeletonProps) {
    return (
        <div className={`grid gap-4 ${columns}`}>
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-12" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ========== TABLE SKELETON ==========

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    hasHeader?: boolean;
}

export function TableSkeleton({ rows = 5, columns = 6, hasHeader = true }: TableSkeletonProps) {
    return (
        <Card>
            {hasHeader && (
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
            )}
            <CardContent>
                <div className="space-y-3">
                    {/* Table header */}
                    <div className="flex gap-4 pb-2 border-b">
                        {Array.from({ length: columns }).map((_, i) => (
                            <Skeleton key={i} className="h-4 flex-1" />
                        ))}
                    </div>
                    {/* Table rows */}
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex gap-4 items-center py-2">
                            {Array.from({ length: columns }).map((_, j) => (
                                <Skeleton key={j} className="h-4 flex-1" />
                            ))}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ========== FORM SKELETON ==========

interface FormSkeletonProps {
    fields?: number;
    columns?: number;
}

export function FormSkeleton({ fields = 6, columns = 2 }: FormSkeletonProps) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
                <div className={`grid gap-6 md:grid-cols-${columns}`}>
                    {Array.from({ length: fields }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    );
}

// ========== TABS SKELETON ==========

interface TabsSkeletonProps {
    tabCount?: number;
}

export function TabsSkeleton({ tabCount = 4 }: TabsSkeletonProps) {
    return (
        <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
            {Array.from({ length: tabCount }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-md" />
            ))}
        </div>
    );
}

// ========== FEED SKELETON ==========

export function FeedSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-40 w-full rounded-md" />
                                <div className="flex gap-4 pt-2">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
