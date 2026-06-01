"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle2, 
    Crown, 
    Zap, 
    ShieldCheck, 
    ArrowRight, 
    PartyPopper,
    LayoutGrid,
    Briefcase,
    Share2,
    Calendar,
    Sparkles
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

export default function UpgradeSuccessPage() {
    // Mock data (In a real app, pass this via URL params or state)
    const activePlan = {
        name: "Royal VIP",
        rewardBoost: "25%",
        limit: "Unlimited",
        expiry: "Dec 31, 2026"
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins selection:bg-emerald-100">
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                
                {/* --- 1. HERO CELEBRATION SECTION --- */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                >
                    <Card className="bg-white border-none shadow-sm rounded-[40px] overflow-hidden relative">
                        {/* Festive background elements */}
                        <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 pointer-events-none">
                            <PartyPopper size={120} />
                        </div>
                        <div className="absolute bottom-0 left-0 p-8 opacity-5 -rotate-12 pointer-events-none">
                            <Sparkles size={120} />
                        </div>

                        <CardContent className="p-10 md:p-16 text-center space-y-6 relative z-10">
                            <div className="relative inline-block">
                                <motion.div 
                                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-8 border-white shadow-xl"
                                >
                                    <CheckCircle2 size={48} className="text-emerald-500" />
                                </motion.div>
                                <div className="absolute -top-2 -right-2 bg-amber-400 p-2 rounded-xl shadow-lg border-2 border-white">
                                    <Crown size={16} className="text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                                    Upgrade Successful
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                    Welcome to the <span className="text-emerald-600">Royal Circle!</span>
                                </h1>
                                <p className="text-slate-500 font-medium max-w-lg mx-auto">
                                    Your account has been elevated to <span className="font-bold text-slate-800">{activePlan.name}</span> status. Your new earning powers are now active.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    {/* --- 2. ACTIVATED BENEFITS CARD --- */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-[32px] overflow-hidden p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Zap className="text-amber-400 fill-amber-400" size={20} /> Unlocked Features
                                </h2>
                                <Badge variant="outline" className="border-slate-700 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                                    Lifetime Access
                                </Badge>
                            </div>

                            <div className="space-y-5">
                                <BenefitRow label="Submission Limit" val={activePlan.limit} />
                                <BenefitRow label="Earning Bonus" val={activePlan.rewardBoost} />
                                <BenefitRow label="Withdrawal Speed" val="Instant" />
                                <BenefitRow label="Tier Expiry" val={activePlan.expiry} />
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <ShieldCheck size={24} className="text-blue-400" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                        Your subscription is now protected by NexShop Royal Guarantee.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* --- 3. NEXT STEPS GRID --- */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Quick Navigation</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <NavAction 
                                href="/dashboard" 
                                icon={<LayoutGrid size={24}/>} 
                                title="Go to Dashboard" 
                                desc="View your updated stats and wallet." 
                                color="emerald"
                            />
                            <NavAction 
                                href="/jobs" 
                                icon={<Briefcase size={24}/>} 
                                title="Start Earning" 
                                desc="Apply for high-reward micro-jobs." 
                                color="blue"
                            />
                            <NavAction 
                                href="/profile" 
                                icon={<Share2 size={24}/>} 
                                title="Refer Friends" 
                                desc="Earn 25% extra from your network." 
                                color="amber"
                            />
                        </div>
                        
                        <div className="text-center pt-4">
                             <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto">
                                 Download Payment Invoice <ArrowRight size={14} />
                             </button>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function BenefitRow({ label, val }: { label: string, val: string }) {
    return (
        <div className="flex justify-between items-center group">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight group-hover:text-slate-300 transition-colors">{label}</span>
            <span className="text-sm font-black text-white">{val}</span>
        </div>
    );
}

function NavAction({ href, icon, title, desc, color }: any) {
    const colors: any = {
        emerald: "text-emerald-500 bg-emerald-50",
        blue: "text-blue-500 bg-blue-50",
        amber: "text-amber-500 bg-amber-50"
    };

    return (
        <Link href={href}>
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md hover:border-slate-200 transition-all group">
                <div className={`p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${colors[color]}`}>
                    {icon}
                </div>
                <div className="grow">
                    <h4 className="text-base font-black text-slate-800 leading-none mb-1">{title}</h4>
                    <p className="text-xs text-slate-400 font-medium">{desc}</p>
                </div>
                <div className="text-slate-200 group-hover:text-slate-400 transition-colors pr-2">
                    <ArrowRight size={20} />
                </div>
            </div>
        </Link>
    );
}