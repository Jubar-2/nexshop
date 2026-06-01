const BenefitItem = ({ num, text }: { num: string, text: string }) => (
    <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
        <span className="w-6 h-6 shrink-0 bg-white rounded-lg flex items-center justify-center font-black text-slate-900 shadow-sm border border-slate-100 text-xs">
            {num}
        </span>
        {text}
    </div>
);

export default BenefitItem;