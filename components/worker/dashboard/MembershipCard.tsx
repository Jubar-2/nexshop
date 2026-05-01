import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Medal, ShieldCheck, Users, Zap } from "lucide-react";
import PerkItem from "./PerkItem";
import { Button } from "@/components/ui/button";


function MembershipCard() {
    return (
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className="border-b border-slate-50 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-800">Membership</CardTitle>
                <ShieldCheck className="text-indigo-500" />
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Plan</p>
                    <p className="text-2xl font-black text-slate-800">Starter Free</p>
                </div>
                <div className="space-y-3">
                    <PerkItem icon={<Zap size={14} className="text-amber-500" />} label="10% Withdrawal Fee" />
                    <PerkItem icon={<Users size={14} className="text-blue-500" />} label="Standard Support" />
                    <PerkItem icon={<Medal size={14} className="text-slate-300" />} label="Basic Job Access" />
                </div>
            </CardContent>
            <CardFooter className="mt-auto pt-0">
                <Button variant="ghost" className="w-full text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                    View All Plans
                </Button>
            </CardFooter>
        </Card>
    )
}

export default MembershipCard;