import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
        PENDING: "bg-amber-50 text-amber-700 border-amber-100",
        REJECTED: "bg-red-50 text-red-700 border-red-100",
    };
    const s = status as keyof typeof styles;
    return (
        <Badge variant="outline" className={`${styles[s] || styles.PENDING} border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg mx-auto`}>
            {status}
        </Badge>
    );
};

export default StatusBadge;