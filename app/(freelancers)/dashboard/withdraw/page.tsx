"use client"

import React, { useState } from 'react';
import {
    Banknote,
    Wallet,
    Clock,
    ShieldCheck,
    ArrowRight,
    History,
    AlertCircle,
    CircleDollarSign,
    ChevronRight,
    Info
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import HeaderBalance from '@/components/worker/dashboard/HeaderBalance';
import RecentActivity from '@/components/worker/dashboard/RecentActivity';
import RuleItem from '@/components/worker/dashboard/RuleItem';
import MethodCard from '@/components/worker/dashboard/MethodCard';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup } from '@/components/ui/field';
export default function WithdrawPage() {
    const [method, setMethod] = useState<'bkash' | 'nagad' | null>(null);
    const [amount, setAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const withdrawFee = 0.05; // 5% Fee
    const netAmount = Number(amount) ? Number(amount) - (Number(amount) * withdrawFee) : 0;

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        if (!method) return toast.error("Please select a withdrawal method");
        if (Number(amount) < 500) return toast.error("Minimum withdrawal is ৳500.00");

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Withdrawal Request Sent", {
                description: `৳${amount} via ${method.toUpperCase()} is now pending review.`,
                icon: <div className="bg-emerald-50 p-1 rounded-lg"><Clock className="text-emerald-500 w-4 h-4" /></div>
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-4xl mx-auto px-4 space-y-6">

                {/* --- HEADER & BALANCE --- */}
                <HeaderBalance />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT: WITHDRAWAL FORM (2/3 Width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                                    <Banknote className="text-blue-500" size={18} /> Transfer Details
                                </CardTitle>
                            </CardHeader>
                            <form onSubmit={handleWithdraw}>
                                <CardContent className="p-8 space-y-8">

                                    {/* Method Selector */}
                                    <div className="space-y-4">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Select Method</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <MethodCard
                                                name="bKash"
                                                active={method === 'bkash'}
                                                onClick={() => setMethod('bkash')}
                                                color="#D12053"
                                            />
                                            <MethodCard
                                                name="Nagad"
                                                active={method === 'nagad'}
                                                onClick={() => setMethod('nagad')}
                                                color="#ED1C24"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Account Number</Label>
                                        <Input required placeholder="017XXXXXXXX" className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-bold" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Account Type</Label>
                                            <Field className=''>
                                                <Select defaultValue="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-black text-lg">
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        position={"item-aligned"}
                                                    >
                                                        <SelectGroup>
                                                            <SelectItem value="apple">Apple</SelectItem>
                                                            <SelectItem value="banana">Banana</SelectItem>
                                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                                            <SelectItem value="grapes">Grapes</SelectItem>
                                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </Field>

                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Amount (৳)</Label>
                                            <Input
                                                required
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="Min. 500"
                                                className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-black text-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Calculation Box */}
                                    {Number(amount) > 0 && (
                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-tighter">
                                                <span>Withdrawal Amount</span>
                                                <span>৳{amount}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold text-red-400 mb-4 uppercase tracking-tighter">
                                                <span>Processing Fee (5%)</span>
                                                <span>- ৳{(Number(amount) * withdrawFee).toFixed(2)}</span>
                                            </div>
                                            <div className="h-px bg-slate-200 mb-4"></div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-black text-slate-800 uppercase tracking-wide">Net Received</span>
                                                <span className="text-xl font-black text-emerald-600">৳{netAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                        <ShieldCheck className="text-blue-500 shrink-0" size={20} />
                                        <p className="text-[11px] font-bold text-blue-800 uppercase leading-relaxed tracking-tight">
                                            Funds are usually processed within 24 hours. For security, withdrawals to unverified numbers may take longer.
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-slate-900 hover:bg-black text-white font-black h-14 rounded-2xl text-lg shadow-lg flex gap-3 transition-all active:scale-95 disabled:opacity-70"
                                    >
                                        {isSubmitting ? "Processing..." : <><CircleDollarSign size={20} /> Confirm Withdrawal</>}
                                    </Button>
                                </CardContent>
                            </form>
                        </Card>
                    </div>

                    {/* RIGHT: RULES & HISTORY (1/3 Width) */}
                    <div className="space-y-6">
                        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 uppercase">
                                    <Info size={16} className="text-amber-500" /> Important Rules
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ul className="space-y-4">
                                    <RuleItem text="Minimum payout is ৳500.00" />
                                    <RuleItem text="Maximum daily limit: ৳25,000.00" />
                                    <RuleItem text="Only personal numbers allowed" />
                                    <RuleItem text="Processing time: 10AM - 10PM" />
                                </ul>
                            </CardContent>
                        </Card>

                        <RecentActivity />
                    </div>

                </div>
            </div>
        </div>
    );
}




