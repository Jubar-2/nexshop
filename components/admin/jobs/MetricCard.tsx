import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

const MetricCard = ({ label, val, icon }: {
    label: string,
    val: string | number,
    icon: ReactNode
}) => (
    <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex items-center justify-between">
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{val}{typeof val === "number" ? "%" : ""}</h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
    </Card>
);

export default MetricCard