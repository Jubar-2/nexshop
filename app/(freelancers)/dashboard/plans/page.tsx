"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Crown,
    Zap,
    ShieldCheck,
    ArrowRight,
    Gem,
    Lock,
    Sparkles
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetPlans } from '@/hooks/use-plan';
import PricingCard from '@/components/worker/plans/PricingCard';
import Reassurance from '@/components/worker/plans/Reassurance';
import { da } from 'zod/v4/locales';

const plans = [
    {
        id: "starter",
        name: "Starter",
        price: 0,
        tagline: "Begin your journey",
        features: ["5 Tasks per day", "Standard verification", "Basic Support"],
        icon: <Zap className="text-slate-400" size={28} />,
        variant: "default"
    },
    {
        id: "pro",
        name: "Premium Pro",
        price: 499,
        tagline: "Most popular choice",
        features: ["50 Tasks per day", "10% Earning bonus", "Priority audit", "Pro badge"],
        icon: <Gem className="text-emerald-500" size={28} />,
        variant: "emerald",
        isPopular: true
    },
    {
        id: "royal",
        name: "Royal VIP",
        price: 2499,
        tagline: "The king's standard",
        features: ["Unlimited tasks", "25% Earning bonus", "Instant withdrawal", "Dedicated account manager"],
        icon: <Crown className="text-amber-500" size={28} />,
        variant: "amber"
    }
];

export default function MembershipPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const { data, isLoading, isError } = useGetPlans();
    
    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-24 pb-20 font-poppins selection:bg-emerald-100 selection:text-emerald-900">
            
            <div className="max-w-6xl mx-auto px-4">

                {/* --- HEADER WITH ANIMATION --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 mb-20"
                >
                    <Badge className="bg-white text-slate-500 border-slate-200 shadow-sm font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-[10px]">
                        NexShop Ecosystem
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        Elevate Your <br />
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-500 to-blue-600">Earning Status</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
                        Join the inner circle of NexShop and enjoy exclusive benefits tailored for high-performance workers.
                    </p>

                    {/* Meta-style Segmented Control */}
                    {/* <div className="flex items-center justify-center pt-8">
                        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex gap-1">
                            {['monthly', 'yearly'].map((cycle) => (
                                <button
                                    key={cycle}
                                    onClick={() => setBillingCycle(cycle as any)}
                                    className={cn(
                                        "px-8 py-2.5 rounded-xl text-sm font-bold transition-all relative capitalize",
                                        billingCycle === cycle ? "text-white" : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    {billingCycle === cycle && (
                                        <motion.div
                                            layoutId="activeCycle"
                                            className="absolute inset-0 bg-slate-900 rounded-xl z-0"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{cycle}</span>
                                </button>
                            ))}
                        </div>
                    </div> */}
                </motion.div>

                {/* --- PRICING GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                     <PricingCard
                            // key={index}
                            plan={data}
                            isLoading={isLoading}
                            // index={index}
                        />
                    {/* {data.map((plan, index) => (
                        <PricingCard
                            key={index}
                            plan={plan}
                            isLoading={isLoading}
                            index={index}
                            isYearly={billingCycle === 'yearly'}
                        />
                    ))} */}
                </div>

                <Reassurance />
            </div>
        </div>
    );
}
