import { Skeleton } from "@/components/ui/skeleton";

const RowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-8 py-6"><div className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full bg-slate-100" /><div className="space-y-2"><Skeleton className="h-3 w-24 bg-slate-100" /><Skeleton className="h-2 w-32 bg-slate-50" /></div></div></td>
        <td className="px-8 py-6"><Skeleton className="h-6 w-24 bg-slate-100 rounded-lg" /></td>
        <td className="px-8 py-6"><div className="space-y-2"><Skeleton className="h-3 w-20 bg-slate-100" /><Skeleton className="h-3 w-16 bg-slate-50" /></div></td>
        <td className="px-8 py-6"><Skeleton className="h-6 w-16 bg-slate-100 rounded-lg mx-auto" /></td>
        <td className="px-8 py-6 text-right"><Skeleton className="h-9 w-32 bg-slate-100 rounded-xl ml-auto" /></td>
    </tr>
);

export default RowSkeleton;