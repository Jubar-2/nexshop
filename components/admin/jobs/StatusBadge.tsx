import { Badge } from "@/components/ui/badge";


const StatusBadge = ({ status }: { status: "ACTIVE" | "COMPLETED" | "PAUSED" }) => {

    const styles: {
        ACTIVE: string,
        PAUSED: string,
        COMPLETED: string
    } = {
        ACTIVE: "bg-emerald-50 text-emerald-600",
        PAUSED: "bg-amber-50 text-amber-600",
        COMPLETED: "bg-blue-50 text-blue-600",
    };
    return (
        <Badge variant="outline" className={`${styles[status] || "bg-slate-50"} border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg mx-auto`}>
            {status}
        </Badge>
    );
};

export default StatusBadge