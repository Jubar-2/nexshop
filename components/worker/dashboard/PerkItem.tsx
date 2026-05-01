const PerkItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
            {icon}
        </div>
        <span className="text-sm font-semibold text-slate-600">{label}</span>
    </div>
);

export default PerkItem;