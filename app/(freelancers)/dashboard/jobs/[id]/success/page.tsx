"use client"

import React, { useState } from 'react';
import {
    CheckCircle2,
    ArrowRight,
    LayoutGrid,
    Trophy,
    Zap
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Spinner from '@/components/worker/jobs/Spinner';

export default function SubmissionSuccessPage() {


    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-4xl mx-auto px-4 space-y-6">

                {/* --- TOP STATUS CARD --- */}
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-500">
                    <CardContent className="p-10 text-center space-y-4">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-white shadow-sm">
                            <CheckCircle2 size={48} className="text-emerald-500 animate-bounce" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Submission Received!</h1>
                            <p className="text-slate-500 font-medium max-w-md mx-auto">Your proof has been successfully sent to the admin. Average review time is <span className="text-slate-800 font-bold">12 hours</span>.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* --- THE SPINNER WHEEL SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left: The Wheel Card */}
                    <Spinner />

                    {/* Right: What Next & Details */}
                    <div className="space-y-6">
                        <Card className="bg-white border-none shadow-sm rounded-3xl p-8 space-y-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Zap className="text-blue-500" size={20} /> What happens next?
                            </h2>
                            <div className="space-y-5">
                                <ProcessItem num="1" title="Initial Review" text="Our automated system checks for basic screenshot validity." />
                                <ProcessItem num="2" title="Manual Audit" text="A human moderator verifies your channel interaction." />
                                <ProcessItem num="3" title="Instant Payout" text="Once approved, balance is added to your NexShop wallet." />
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/dashboard" className="w-full">
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-white shadow-sm">
                                    <LayoutGrid size={18} /> Dashboard
                                </Button>
                            </Link>
                            <Link href="/dashboard/jobs" className="w-full">
                                <Button className="w-full bg-[#10B981] hover:bg-[#0da06f] h-14 rounded-2xl font-black text-white gap-2 shadow-lg">
                                    Next Job <ChevronRight size={18} />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

const ProcessItem = ({ num, title, text }: { num: string, title: string, text: string }) => (
    <div className="flex items-start gap-4">
        <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center font-black text-xs border border-slate-100 flex-shrink-0 mt-0.5">
            {num}
        </div>
        <div>
            <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{text}</p>
        </div>
    </div>
);

const Badge = ({ children, className }: { children: React.ReactNode, className: string }) => (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
        {children}
    </span>
);

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
    <ArrowRight size={size} className={className} />
);