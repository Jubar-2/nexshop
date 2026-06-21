import { ShieldCheck } from "lucide-react";
import NagadLogo from "../logo/NagadLogo";
import BkashLogo from "../logo/BkashLogo";

const MethodCard = ({ name, active, onClick, color }: {
    name: string;
    active: boolean;
    onClick: () => void,
    color: string;
}) => (
    <div
        onClick={onClick}
        className={`relative h-20 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden ${active ? 'bg-white border-slate-900 shadow-md ring-2 ring-slate-900/5' : 'bg-slate-50 border-slate-100 grayscale hover:grayscale-0'
            }`}
    >
        <span className="text-lg font-black italic tracking-tighter" style={{ color: color }}>
            {name === "Nagad" ? <NagadLogo /> : <BkashLogo />}
        </span>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile Wallet</p>
        {active && (
            <div className="absolute top-2 right-2 bg-slate-900 rounded-full p-0.5">
                <ShieldCheck size={10} className="text-white" />
            </div>
        )}
    </div>
);

export default MethodCard;