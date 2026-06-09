import { Skeleton } from "@/components/ui/skeleton";

const TableRowSkeleton = () => (
    <tr>
        <td className="px-8 py-5"><div className="flex gap-4 items-center"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-2 w-12" /></div></div></td>
        <td className="px-8 py-5"><div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-2 w-24" /></div></td>
        <td className="px-8 py-5"><Skeleton className="h-6 w-16" /></td>
        <td className="px-8 py-5 text-center"><Skeleton className="h-5 w-16 mx-auto rounded-full" /></td>
        <td className="px-8 py-5 text-right"><Skeleton className="h-9 w-24 ml-auto rounded-xl" /></td>
    </tr>
);


export default TableRowSkeleton;