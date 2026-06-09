import { Card, CardContent } from "@/components/ui/card";

type ReferralTier = {
    children: React.ReactNode;
    level: number;
    active: boolean;
    color: "orange" | "blue" | "purple";
    disabled: boolean;
}

function ReferralTier({ children, level, active, color, disabled = false }: ReferralTier) {
    const colors: {
        orange: string,
        blue: string,
        purple: string
    } = {
        orange: "bg-orange-600 text-orange-100 shadow-orange-100",
        blue: "bg-blue-600 text-blue-100 shadow-blue-100",
        purple: "bg-purple-600 text-purple-100 shadow-purple-100",
    };

    return (
        <Card className={`border-none rounded-4xl transition-all duration-500 ${active ? 'bg-white shadow-sm' : 'bg-slate-100 opacity-60'} ${disabled ? 'grayscale cursor-not-allowed' : ''}`}>
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex items-center gap-6 grow">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg transition-colors ${active ? colors[color] : 'bg-slate-200 text-slate-400'}`}>
                        {level}
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-black text-slate-800 text-lg leading-none">Generation {level}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {disabled ? `Blocked by Gen ${level - 1}` : 'Revenue Share percentage'}
                        </p>
                    </div>
                </div>

                <div className={`flex items-center gap-4 transition-all ${active ? 'opacity-100' : 'opacity-40'}`}>
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}

export default ReferralTier;