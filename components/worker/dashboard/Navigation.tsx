import {
    ExternalLink,
    Crown
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

const Navigation = () => {
    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Earnings</h1>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 rounded-full px-3 py-1 font-bold text-[10px] uppercase flex gap-1 items-center">
                        <Crown size={12} /> Free Plan
                    </Badge>
                </div>
                <p className="text-slate-500 text-sm font-medium">Manage your balance and track performance</p>
            </div>
            <div className="flex gap-3">
                <Link href="/dashboard/statement">
                    <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-11 px-6 font-bold shadow-sm">
                        View Statement
                    </Button>
                </Link>

                <Link href="/dashboard/withdraw">
                    <Button className="bg-[#10B981] hover:bg-[#0da06f] text-white rounded-xl h-11 px-6 font-bold shadow-md flex gap-2 transition-all active:scale-95">
                        <ExternalLink size={18} />
                        Withdraw
                    </Button>
                </Link>

            </div>
        </div>
    );
};


export default Navigation;