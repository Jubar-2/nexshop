import { AlertTriangle } from "lucide-react";

function Alert({ title, note }: { title: string; note: string; }) {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-5">
            <div className="bg-white p-2 rounded-xl shadow-sm h-fit">
                <AlertTriangle className="text-amber-500" size={24} />
            </div>
            <div className="space-y-1">
                <h4 className="font-bold text-amber-900 text-sm uppercase tracking-tight">{title}</h4>
                <p className="text-xs text-amber-700 leading-relaxed font-medium uppercase tracking-tighter">
                    Note: {note}
                </p>
            </div>
        </div>
    )
}

export default Alert;