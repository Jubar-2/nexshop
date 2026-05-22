import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SubmissionSkeleton = () => (
    <Card className="bg-white border-none shadow-sm rounded-[24px] animate-pulse">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <Skeleton className="h-12 w-12 rounded-full bg-slate-100 shrink-0" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32 bg-slate-100" />
                    <Skeleton className="h-3 w-20 bg-slate-50" />
                </div>
            </div>
            <Skeleton className="h-10 grow bg-slate-50 rounded-xl hidden md:block" />
            <Skeleton className="h-10 w-full md:w-32 rounded-xl bg-slate-100" />
        </CardContent>
    </Card>
);

export default SubmissionSkeleton