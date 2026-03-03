import { PageHeaderSkeleton, FeedSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
    return (
        <div className="space-y-6">
            <PageHeaderSkeleton actionCount={1} />
            <FeedSkeleton count={3} />
        </div>
    );
}
