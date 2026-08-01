import { Skeleton } from "@/components/ui/skeleton";

function NotificationSkeleton() {
    return (
        <div className="flex items-start gap-4 px-4 py-5 border-b border-slate-50">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="grow space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    );
}

export default NotificationSkeleton;