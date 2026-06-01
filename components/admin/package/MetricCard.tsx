import { cn } from "@/lib/utils";

type MetricCardProps = {
    label: string;
    val: string,
    color: string,
    icon: React.ReactNode
}

const MetricCard = ({ label, val, color, icon }: MetricCardProps) => (
    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm flex items-center gap-4 min-w-40 border border-slate-100">
        <div className={cn(
            "p-2.5 rounded-xl",
            color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
        )}>{icon}</div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">{val}</p>
        </div>
    </div>
);

export default MetricCard