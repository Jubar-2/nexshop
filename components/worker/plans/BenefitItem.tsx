import { CheckCircle2 } from "lucide-react";

function BenefitItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            {text}
        </div>
    );
}

export default BenefitItem