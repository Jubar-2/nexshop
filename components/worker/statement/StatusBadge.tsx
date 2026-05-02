import { CheckCircle2, Clock, XCircle } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
    const base = "text-[10px] font-black uppercase px-2.5 py-1 rounded-md flex items-center justify-center gap-1.5 w-24";
    const s = status?.toLowerCase();

    if (s === "approved") return
    <span className={`${base} bg-emerald-100 text-emerald-700`}>
        <CheckCircle2 size={12} /> Approved
    </span>;

    if (s === "pending") return
    <span className={`${base} bg-amber-100 text-amber-700`}>
        <Clock size={12} /> Pending
    </span>;

    return (
        <span className={`${base} bg-red-100 text-red-700`}>
            <XCircle size={12} /> {status || 'Rejected'}
        </span>
    );
};


export default StatusBadge;