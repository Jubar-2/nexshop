import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

function ReferrersLeaderboard() {
    return (
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                <CardTitle className="text-lg font-bold text-slate-800">Top Referrers</CardTitle>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wider">Yearly</span>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                    {[
                        { rank: 1, name: 'atb', count: 61 },
                        { rank: 2, name: 'emonbhuiyan', count: 32 },
                        { rank: 3, name: 'biplob_2004', count: 15 },
                        { rank: 4, name: 'Joynul', count: 8 },
                        { rank: 5, name: 'munna14447', count: 5 }
                    ].map((user, i) => (
                        <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-6 text-center font-bold text-slate-400 text-sm">
                                    {user.rank <= 3 ? <Trophy size={16} className={i === 0 ? "text-amber-400" : i === 1 ? "text-slate-400" : "text-amber-700"} /> : user.rank}
                                </div>
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarFallback className="bg-slate-200 text-slate-600 font-bold uppercase text-xs">
                                        {user.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-bold text-slate-700 text-sm">{user.name}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-emerald-600 font-black text-sm">{user.count}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Referrals</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default ReferrersLeaderboard;