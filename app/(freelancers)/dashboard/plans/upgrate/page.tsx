"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  Copy, 
  Info, 
  Zap, 
  Crown,
  Lock,
  ArrowRight,
  Hash
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from 'next/link';

export default function MembershipUpgradePage() {
  const [method, setMethod] = useState<'bkash' | 'nagad' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock Plan Data (Passed from previous page or URL)
  const targetPlan = {
    name: "Premium Pro",
    price: 499,
    duration: "Monthly",
    slots: 50
  };

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    toast.success("Number Copied!");
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Upgrade Request Submitted", {
        description: "Status will be updated in your dashboard within 1 hour.",
        icon: <ShieldCheck className="text-emerald-500" />
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* --- TOP BREADCRUMB --- */}
        <Link href="/dashboard/plans" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors w-fit group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Plans
        </Link>

        {/* --- PLAN SUMMARY HEADER --- */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-slate-900 text-white border-none shadow-xl rounded-[32px] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                    <Crown size={120} />
                </div>
                <CardContent className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                        <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Upgrade Request</Badge>
                        <h1 className="text-3xl font-black tracking-tight">Activating <span className="text-emerald-400">{targetPlan.name}</span></h1>
                        <p className="text-slate-400 text-sm font-medium">Elevating your account to the royal standard.</p>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Payment Due</p>
                        <h2 className="text-4xl font-black text-white tracking-tighter">৳{targetPlan.price.toLocaleString()}</h2>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

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
                            <MethodCard name="bKash" color="#D12053" active={method === 'bkash'} onClick={() => setMethod('bkash')} />
                            <MethodCard name="Nagad" color="#ED1C24" active={method === 'nagad'} onClick={() => setMethod('nagad')} />
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
                                        <Step num="B" text={`Send exactly ৳${targetPlan.price} to this number`} />
                                        <Step num="C" text="Copy the Transaction ID (TrxID) after payment" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 3. Verification Form */}
                            <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                    <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Hash size={16} /> 3. Verification
                                    </CardTitle>
                                </CardHeader>
                                <form onSubmit={handleConfirm}>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Payment Number</Label>
                                                <Input required placeholder="Your Phone Number" className="h-12 rounded-xl border-slate-200 focus:border-blue-500 font-bold" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Transaction ID (TrxID)</Label>
                                                <Input required placeholder="8X2K9L0P" className="h-12 rounded-xl border-slate-200 focus:border-blue-500 font-black font-mono tracking-widest" />
                                            </div>
                                        </div>

                                        <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4">
                                            <ShieldCheck className="text-blue-500 shrink-0" size={24} />
                                            <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
                                                By submitting, you agree to our terms. Fake IDs will lead to permanent account suspension without refund.
                                            </p>
                                        </div>

                                        <Button 
                                            disabled={isSubmitting}
                                            className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95"
                                        >
                                            {isSubmitting ? "Verifying..." : "Confirm Upgrade"}
                                        </Button>
                                    </CardContent>
                                </form>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- RIGHT: BENEFITS & TRUST (1/3 Width) --- */}
            <div className="space-y-6">
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden p-8 space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Plan Benefits</h3>
                    <div className="space-y-4">
                        <BenefitItem text="50 Job Submissions Daily" />
                        <BenefitItem text="10% Referral Bonus" />
                        <BenefitItem text="Priority Task Audit" />
                        <BenefitItem text="Royal ID Badge" />
                    </div>
                </Card>

                <Card className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center space-y-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-emerald-900 text-sm uppercase tracking-tight">Secure Payment</h4>
                        <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                            Your transaction is encrypted and verified by the NexShop Royal Finance Team.
                        </p>
                    </div>
                </Card>
            </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MethodCard({ name, color, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all relative overflow-hidden group",
                active ? "bg-white border-slate-900 shadow-lg ring-4 ring-slate-900/5" : "bg-slate-50 border-slate-100 grayscale opacity-60 hover:opacity-100"
            )}
        >
            <span className="text-xl font-black italic tracking-tighter" style={{ color }}>{name}</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Wallet</p>
            {active && (
                <div className="absolute top-2 right-2 bg-slate-900 rounded-full p-1 shadow-sm">
                    <CheckCircle2 size={10} className="text-white" />
                </div>
            )}
        </button>
    );
}

function Step({ num, text }: { num: string, text: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg shrink-0">
                {num}
            </div>
            <p className="text-sm font-bold text-slate-700 leading-tight mt-1.5">{text}</p>
        </div>
    );
}

function BenefitItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            {text}
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}