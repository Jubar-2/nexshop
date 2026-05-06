import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function PricingCard({ plan, index, isYearly, isLoading }: any) {
    // const finalPrice = isYearly ? Math.floor(plan.price * 0.8 * 12) : plan.price;
    // console.log(isLoading, plan)
    if (isLoading || !plan) {
        return (
            <>
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -8 }}
                        className="h-full"
                    >
                        <Card className={cn(
                            "relative border-none transition-shadow duration-500 rounded-[40px] flex flex-col h-full overflow-hidden",
                            "shadow-sm bg-white hover:shadow-xl"
                        )}>
                            {/* {plan.isPopular && (
                        <div className="absolute top-0 right-0 p-6">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg"
                            >
                                <Sparkles size={16} />
                            </motion.div>
                        </div>
                    )} */}

                            <CardHeader className="p-10 space-y-6">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",

                                    'bg-slate-50 text-slate-400'
                                )}>
                                    <Skeleton className="h-16 w-28 bg-slate-200" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                        <Skeleton className="h-8 w-28 bg-slate-200" />
                                    </h3>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                                        <Skeleton className="h-4 w-35 bg-slate-200" />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-10 grow space-y-8 pt-0">
                                <div className="flex items-baseline gap-1">
                                    <motion.span
                                        // key={finalPrice}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-5xl font-black text-slate-900 tracking-tighter"
                                    >
                                        <Skeleton className="h-8 w-28 bg-slate-200" />
                                    </motion.span>
                                    <span className="text-slate-400 font-bold text-sm">
                                        <Skeleton className="h-5 w-15 bg-slate-200" />
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {[1, 2, 3].map((i: number) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                            key={i}
                                            className="flex items-center gap-3 text-sm font-bold text-slate-600"
                                        >
                                            <div className="w-5 h-5 bg-slate-50 rounded-full flex items-center justify-center shrink-0 border border-slate-100">
                                                <Skeleton className="h-3 w-12 bg-slate-200" />
                                            </div>
                                            <Skeleton className="h-3 w-30 bg-slate-200" />
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="p-10">
                                <Skeleton className="w-full h-16 rounded-2xl text-lg font-black transition-all shadow-lg active:scale-95" />
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </>
        )
    }

    console.log(isLoading, plan)
    return (
        <>
            {plan.map((pln, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -8 }}
                    className="h-full"
                >
                    <Card className={cn(
                        "relative border-none transition-shadow duration-500 rounded-[40px] flex flex-col h-full overflow-hidden",
                        pln.badgeText ? "shadow-2xl shadow-emerald-200/50 bg-white ring-2 ring-emerald-500/20" : "shadow-sm bg-white hover:shadow-xl"
                    )}>
                        {pln.badgeText && (
                            <div className="absolute top-0 right-0 p-6">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg"
                                >
                                    <Sparkles size={16} />
                                </motion.div>
                            </div>
                        )}

                        <CardHeader className="p-10 space-y-6">
                            <div style={{ backgroundColor: pln.color }} className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
                                // pln.variant === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                //     pln.variant === 'amber' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'
                            )} dangerouslySetInnerHTML={{ __html: pln.icon }}>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{pln.membershipName}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{pln.title}</p>
                            </div>
                        </CardHeader>

                        <CardContent className="p-10 grow space-y-8 pt-0">
                            <div className="flex items-baseline gap-1">
                                <motion.span
                                    // key={finalPrice}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-5xl font-black text-slate-900 tracking-tighter"
                                >
                                    ৳{12}
                                </motion.span>
                                <span className="text-slate-400 font-bold text-sm">/{pln.period === 0 ? " Unlimited" : pln.period + " mo"}</span>
                            </div>

                            <div className="space-y-4">
                                {pln.offers.map((feat: string, i: number) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                        key={i}
                                        className="flex items-center gap-3 text-sm font-bold text-slate-600"
                                    >
                                        <div className="w-5 h-5 bg-slate-50 rounded-full flex items-center justify-center shrink-0 border border-slate-100">
                                            <CheckCircle2 className="text-emerald-500" size={12} />
                                        </div>
                                        {feat.offer.offerTitle}
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>

                        <CardFooter className="p-10">
                            <Button
                                className={cn(
                                    "w-full h-16 rounded-2xl text-lg font-black transition-all shadow-lg active:scale-95",
                                    pln.badgeText ? "bg-emerald-600 hover:bg-emerald-700 text-white" :
                                        pln.price === 0 ? "bg-slate-100 text-slate-400 border-none pointer-events-none" : "bg-slate-900 hover:bg-black text-white"
                                )}
                            >
                                {pln.price === 0 ? "Active Plan" : "Upgrade Plan"}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))
            }
        </>
    );
}

export default PricingCard;