"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Smartphone, Copy, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import PlanSummaryHeader from '@/components/worker/plans/PlanSummaryHeader';
import PlanBenefits from '@/components/worker/plans/PlanBenefits';
import MethodCard from '@/components/worker/dashboard/MethodCard';
import Step from '@/components/worker/plans/Step';
import VerificationForm from '@/components/worker/plans/VerificationForm';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { useGetPlan } from '@/hooks/use-plan';

export default function MembershipUpgradePage() {
    const [method, setMethod] = useState<'BkASH' | 'NAGAD' | null>(null);

    const params = useParams();
    const id = params.id as string;
    const { data } = useGetPlan(id)

    const copyNumber = (num: string) => {
        navigator.clipboard.writeText(num);
        toast.success("Number Copied!");
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-4xl mx-auto px-4 space-y-6">

                {/* --- TOP BREADCRUMB --- */}
                <Link href="/dashboard/plans" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors w-fit group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Plans
                </Link>

                {/* --- PLAN SUMMARY HEADER --- */}
                <PlanSummaryHeader />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* --- LEFT: PAYMENT WORKFLOW (2/3 Width) --- */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Method Selection */}
                        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Smartphone size={16} /> 1. Select Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <MethodCard name="bKash" color="#D12053" active={method === 'BkASH'} onClick={() => setMethod('BkASH')} />
                                    <MethodCard name="Nagad" color="#ED1C24" active={method === 'NAGAD'} onClick={() => setMethod('NAGAD')} />
                                </div>
                            </CardContent>
                        </Card>

                        <AnimatePresence mode="wait">
                            {method && (
                                <motion.div
                                    key={method}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-6 overflow-hidden"
                                >
                                    {/* 2. Instructions */}
                                    <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                            <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Info size={16} /> 2. Complete Transfer
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-6">
                                            <div className="space-y-5">
                                                <Step num="A" text={`Open ${method} app and select "Send Money"`} />
                                                <div className="ml-12 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receiver Number</p>
                                                        <p className="text-lg font-black text-slate-800 tracking-tight italic">017XXXXXXXX</p>
                                                    </div>
                                                    <Button onClick={() => copyNumber("017XXXXXXXX")} variant="ghost" className="h-10 w-10 bg-white shadow-sm hover:bg-slate-50 rounded-xl">
                                                        <Copy size={16} className="text-slate-400" />
                                                    </Button>
                                                </div>
                                                <Step num="B" text={`Send exactly ৳${data?.price || "..."} to this number`} />
                                                <Step num="C" text="Copy the Transaction ID (TrxID) after payment" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* 3. Verification Form */}
                                    {method ? <VerificationForm method={method} /> : ""}

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* --- RIGHT: BENEFITS & TRUST (1/3 Width) --- */}
                    <PlanBenefits />

                </div>
            </div>
        </div>
    );
}

