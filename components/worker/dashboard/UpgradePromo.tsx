import { Button } from "@/components/ui/button";
import { Badge, Crown, Sparkles } from "lucide-react";

function UpgradePromo() {
    return (<div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-1 shadow-xl">
        <div className="bg-white/5 backdrop-blur-sm rounded-[14px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 text-white/10 rotate-12">
                <Crown size={200} />
            </div>
            <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                    <Sparkles className="text-white" size={30} />
                </div>
                <div className="text-white">
                    <h3 className="text-xl font-black flex items-center gap-2">
                        Upgrade to Premium Pro <Badge className="bg-amber-400 text-slate-900 border-none font-black uppercase text-[10px]">Save 20%</Badge>
                    </h3>
                    <p className="text-white/80 text-sm font-medium">Unlock 0% fees, instant withdrawals, and priority support.</p>
                </div>
            </div>
            <Button className="bg-white text-indigo-600 hover:bg-slate-50 rounded-xl h-12 px-10 font-black text-lg shadow-lg relative z-10 transition-transform active:scale-95">
                Upgrade Now
            </Button>
        </div>
    </div>)
}

export default UpgradePromo;