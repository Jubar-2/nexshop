import { ReactNode } from "react";

type AdminSummaryCardType = { label: string, val: string, color: string, icon: ReactNode };

const AdminSummaryCard = ({ label, val, color, icon }: AdminSummaryCardType) => {
    const colors = { emerald: "text-emerald-600 bg-emerald-50", amber: "text-amber-600 bg-amber-50" };
    return (
        <div
            className="bg-white px-5 py-3 rounded-2xl shadow-sm flex items-center gap-4 min-w-40 border border-slate-100"
        >
            <div className={`p-2 rounded-lg ${colors[color as keyof typeof colors]}`}>{icon}</div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className={`text-lg font-black tracking-tighter leading-none ${colors[color as keyof typeof colors].split(' ')[0]}`}>{val}</p>
            </div>
        </div>
    );
};

export default AdminSummaryCard;