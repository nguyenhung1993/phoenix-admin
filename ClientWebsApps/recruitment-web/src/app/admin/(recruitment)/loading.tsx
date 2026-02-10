import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Kanban Board Skeleton */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-[300px] shrink-0 space-y-4">
                        <div className="bg-muted p-2 rounded-lg">
                            <Skeleton className="h-6 w-32 mb-2" />
                            <div className="space-y-3">
                                <Skeleton className="h-32 w-full rounded-md" />
                                <Skeleton className="h-32 w-full rounded-md" />
                                <Skeleton className="h-32 w-full rounded-md" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
