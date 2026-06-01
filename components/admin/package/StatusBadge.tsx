import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        APPROVED: "bg-emerald-50 text-emerald-600",
        PENDING: "bg-amber-50 text-amber-600",
        REJECTED: "bg-red-50 text-red-600",
    };

    return (
        <Badge variant="outline" className={cn("border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg",
            styles[status as "APPROVED" | "PENDING" | "REJECTED"])}>
            {status}
        </Badge>
    );
};

export default StatusBadge