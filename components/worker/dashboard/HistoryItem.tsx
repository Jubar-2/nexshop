import { Skeleton } from "@/components/ui/skeleton";

// 1. Define the Interface to solve the "any" error
interface HistoryItemProps {
    method: string;
    amount: string | number;
    status: string;
    date: string;
    isLoading?: boolean;
}

function HistoryItem({ method, amount, status, date, isLoading = false }: HistoryItemProps) {
    
    // Helper to get status colors
    const getStatusColor = (status: string) => {
        if (status === "COMPLETED" || status === "success") return "bg-emerald-100 text-emerald-700";
        if (status === "PENDING" || status === "REFUNDED") return "bg-amber-100 text-amber-700";
        return "bg-red-100 text-red-700"; // For rejected or failed
    };

    if (isLoading) {
        return (
            <div className="p-4 flex items-center justify-between border-b border-slate-50 last:border-0">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-24 bg-slate-100" />
                    <Skeleton className="h-2 w-16 bg-slate-50" />
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <Skeleton className="h-4 w-12 bg-slate-100" />
                    <Skeleton className="h-3 w-16 rounded-md bg-slate-50" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 group">
            <div className="flex flex-col gap-0.5">
                <span className="text-xs font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                    {method} Payout
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {date}
                </span>
            </div>
            
            <div className="text-right flex flex-col items-end gap-1.5">
                <p className="text-sm font-black text-slate-900">
                    ৳{Number(amount).toLocaleString()}
                </p>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md leading-none ${getStatusColor(status)}`}>
                    {status}
                </span>
            </div>
        </div>
    );
}

export default HistoryItem;