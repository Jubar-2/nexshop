"use client"

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BenefitItem from "./BenefitItem";
import { Lock, ShieldCheck } from 'lucide-react';
import { offerType, useGetPlan } from "@/hooks/use-plan";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function PlanBenefits() {
    const params = useParams();
    const id = params.id as string;
    const { data, isLoading } = useGetPlan(id);

    return (
        <div className="space-y-6">
            {/* --- DYNAMIC BENEFITS CARD --- */}
            <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden p-8 space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Plan Benefits
                </h3>

                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            // Render 4 Benefit Skeletons
                            <div className="space-y-5 animate-pulse">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="w-5 h-5 rounded-full bg-slate-100 shrink-0" />
                                        <Skeleton className="h-3 w-full bg-slate-50 rounded-md" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Render Actual Data
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                {data?.offers?.map((offer: offerType) => (
                                    <BenefitItem
                                        key={offer.id}
                                        text={offer.offer.offerTitle}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>

            {/* --- STATIC TRUST CARD --- */}
            <Card className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8 text-center space-y-4 shadow-sm relative overflow-hidden group">
                {/* Subtle background decoration */}
                <div className="absolute -right-2 -top-2 opacity-5 group-hover:rotate-12 transition-transform duration-500">
                    <ShieldCheck size={80} className="text-emerald-900" />
                </div>

                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 mx-auto shadow-sm relative z-10">
                    <Lock size={24} />
                </div>
                <div className="relative z-10">
                    <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-widest mb-1">
                        Secure Payment
                    </h4>
                    <p className="text-[11px] text-emerald-700/80 font-medium leading-relaxed uppercase">
                        Your transaction is encrypted and verified by the <span className="font-black">NexShop Royal Finance Team</span>.
                    </p>
                </div>
            </Card>
        </div>
    );
}

export default PlanBenefits;