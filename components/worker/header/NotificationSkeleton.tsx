import { Skeleton } from "@/components/ui/skeleton";

const NotificationSkeleton = () => (
    <div className="flex items-start gap-3 p-4 border-b border-slate-50 last:border-0">
        <Skeleton className="h-9 w-9 rounded-full shrink-0 bg-slate-100" />
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24 bg-slate-100" />
                <Skeleton className="h-2 w-2 rounded-full bg-slate-100" />
            </div>
            <Skeleton className="h-3 w-full bg-slate-50" />
            <Skeleton className="h-2 w-12 bg-slate-50" />
        </div>
    </div>
);

export default NotificationSkeleton;