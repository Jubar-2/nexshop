import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

type MethodCardType = {
    name: string,
    color: string,
    active: boolean,
    onClick: () => void
}

function MethodCard({ name, color, active, onClick }: MethodCardType) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all relative overflow-hidden group",
                active ? "bg-white border-slate-900 shadow-lg ring-4 ring-slate-900/5" : "bg-slate-50 border-slate-100 grayscale opacity-60 hover:opacity-100"
            )}
        >
            <span className="text-xl font-black italic tracking-tighter" style={{ color }}>{name}</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Wallet</p>
            {active && (
                <div className="absolute top-2 right-2 bg-slate-900 rounded-full p-1 shadow-sm">
                    <CheckCircle2 size={10} className="text-white" />
                </div>
            )}
        </button>
    );
}

export default MethodCard