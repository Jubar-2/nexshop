"use client"

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure this is installed
import { useParams } from "next/navigation";
import { useGetPlan } from "@/hooks/use-plan";

function PlanSummaryHeader() {
    const params = useParams();
    const id = params.id as string;
    const { data, isLoading } = useGetPlan(id);

    const formattedBalance = useMemo(() => {
        const value = data?.price ?? 0;
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(value).replace("BDT", "৳");
    }, [data?.price]);

    // --- LOADING STATE (SKELETON) ---
    if (isLoading) {
        return (
            <Card className="bg-slate-900 border-none shadow-xl rounded-[32px] overflow-hidden relative">
                {/* Keep the decorative crown for visual consistency */}
                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 pointer-events-none">
                    <Crown size={120} className="text-white" />
                </div>
                <CardContent className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 animate-pulse">
                    <div className="space-y-4 text-center md:text-left w-full md:w-auto">
                        {/* Badge Skeleton */}
                        <Skeleton className="h-6 w-32 bg-white/10 rounded-full mx-auto md:mx-0" />
                        {/* Title Skeleton */}
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-64 bg-white/20 rounded-xl mx-auto md:mx-0" />
                            {/* Subtitle Skeleton */}
                            <Skeleton className="h-4 w-48 bg-white/10 rounded-lg mx-auto md:mx-0" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
                        {/* Price Label Skeleton */}
                        <Skeleton className="h-3 w-20 bg-white/10 rounded-full" />
                        {/* Big Price Skeleton */}
                        <Skeleton className="h-12 w-32 bg-white/20 rounded-2xl" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="bg-slate-900 text-white border-none shadow-xl rounded-[32px] overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 pointer-events-none">
                    <Crown size={120} />
                </div>

                <CardContent className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                        <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                            Upgrade Request
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
                            Activating <span className="text-emerald-400">{data.membershipName}</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">
                            Elevating your account to the royal standard.
                        </p>
                    </div>

                    <div className="text-center md:text-right shrink-0">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">
                            Payment Due
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter tabular-nums">
                            {formattedBalance}
                        </h2>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default PlanSummaryHeader;