"use client"

import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  History, 
  ShieldCheck, 
  PartyPopper,
  CircleDollarSign,
  LayoutGrid,
  FileText,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from 'next/link';

export default function WithdrawSuccessPage() {
  const transactionId = "NX-9928374650";

  const copyId = () => {
    navigator.clipboard.writeText(transactionId);
    toast.success("Transaction ID Copied", {
        description: "Save this ID for any support queries.",
        icon: <Copy className="w-4 h-4" />
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* --- MAIN SUCCESS HEADER --- */}
        <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden animate-in fade-in zoom-in duration-500">
          <CardContent className="p-10 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-xl">
                <PartyPopper size={48} className="text-emerald-500 animate-bounce" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Request Received!</h1>
            <p className="text-slate-500 font-medium max-w-md">Your withdrawal request has been logged. Our finance team is now preparing your transfer.</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* LEFT: DIGITAL RECEIPT */}
            <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                    <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Receipt</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400 uppercase">Amount Request</span>
                        <span className="text-2xl font-black text-slate-800 tracking-tighter">৳1,000.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400 uppercase">Net To Receive</span>
                        <span className="text-2xl font-black text-emerald-600 tracking-tighter">৳950.00</span>
                    </div>
                    
                    <div className="h-[2px] border-t-2 border-dashed border-slate-100 my-2"></div>
                    
                    <div className="space-y-4">
                        <ReceiptRow label="Payment Method" value="bKash (Personal)" color="text-[#D12053]" />
                        <ReceiptRow label="Account Number" value="01728XXXX90" />
                        <div className="flex justify-between items-center group">
                            <span className="text-xs font-bold text-slate-400 uppercase">Transaction ID</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-800 font-mono">{transactionId}</span>
                                <button onClick={copyId} className="p-1.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                    <Copy size={12} className="text-slate-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-3">
                        <ShieldCheck size={20} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Secured & Encrypted Transfer</span>
                    </div>
                </CardContent>
            </Card>

            {/* RIGHT: TIMELINE & ACTION */}
            <div className="space-y-6">
                <Card className="bg-white border-none shadow-sm rounded-3xl p-8 space-y-8">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                        <Clock className="text-blue-500" size={20} /> Current Status
                    </h2>
                    
                    {/* Visual Timeline (Stepper) */}
                    <div className="relative space-y-10 pl-6">
                        <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-slate-100"></div>
                        
                        <TimelineStep 
                            status="completed" 
                            title="Request Submitted" 
                            desc="Oct 24, 2024 - 10:30 AM" 
                        />
                        <TimelineStep 
                            status="active" 
                            title="Pending Audit" 
                            desc="Average time: 2-6 hours" 
                        />
                        <TimelineStep 
                            status="upcoming" 
                            title="Fund Disbursed" 
                            desc="Estimated within 24 hours" 
                        />
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Link href="/dashboard" className="w-full">
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-white shadow-sm transition-all active:scale-95">
                            <LayoutGrid size={18} /> Home
                        </Button>
                    </Link>
                    <Link href="/wallet" className="w-full">
                        <Button className="w-full bg-slate-900 hover:bg-black h-14 rounded-2xl font-black text-white gap-2 shadow-lg transition-all active:scale-95">
                             <FileText size={18} /> Statement
                        </Button>
                    </Link>
                </div>
            </div>

        </div>

        {/* Support Note */}
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">
            Need help? Contact <span className="text-slate-800 underline cursor-pointer">Support</span> with your Transaction ID
        </p>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const ReceiptRow = ({ label, value, color = "text-slate-800" }: any) => (
    <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase">{label}</span>
        <span className={`text-sm font-black ${color}`}>{value}</span>
    </div>
);

const TimelineStep = ({ status, title, desc }: { status: 'completed' | 'active' | 'upcoming', title: string, desc: string }) => {
    return (
        <div className="relative">
            <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${
                status === 'completed' ? 'bg-emerald-500' : 
                status === 'active' ? 'bg-blue-500 animate-pulse' : 
                'bg-slate-200'
            }`}></div>
            <div className="flex flex-col">
                <h4 className={`text-sm font-black uppercase leading-none ${status === 'upcoming' ? 'text-slate-300' : 'text-slate-800'}`}>{title}</h4>
                <p className={`text-[11px] font-bold mt-1 ${status === 'active' ? 'text-blue-500' : 'text-slate-400'}`}>{desc}</p>
            </div>
        </div>
    );
};