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
import { toast } from "sonner";
import Link from 'next/link';

export default function SubmissionSuccessPage() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [hasSpun, setHasSpun] = useState(false);

    const startSpin = () => {
        if (isSpinning || hasSpun) return;

        setIsSpinning(true);
        // Generate a random rotation between 2000 and 5000 degrees for effect
        const newRotation = rotation + 1800 + Math.floor(Math.random() * 360);
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setHasSpun(true);
            toast.success("Bonus Applied!", {
                description: "You've earned a 5% speed-up on your next approval!",
                icon: <Trophy className="text-amber-500 w-5 h-5" />
            });
        }, 4000); // Match CSS transition duration
    };

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
                    <Card className="bg-white border-none shadow-sm rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-4 left-6">
                            <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Daily Lucky Spin</Badge>
                        </div>

                        {/* The Pointer */}
                        <div className="absolute top-[28%] z-20 transform -translate-y-full">
                            <div className="w-8 h-10 bg-slate-900 [clip-path:polygon(50%_100%,0_0,100%_0)] shadow-lg border-x-2 border-white"></div>
                        </div>

                        {/* The actual Wheel */}
                        <div
                            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-slate-100 shadow-2xl transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                background: `conic-gradient(
                            #ffadad 0deg 30deg, #ffd6a5 30deg 60deg, #fdffb6 60deg 90deg, 
                            #caffbf 90deg 120deg, #9bf6ff 120deg 150deg, #a0c4ff 150deg 180deg, 
                            #bdb2ff 180deg 210deg, #ffc6ff 210deg 240deg, #ffadad 240deg 270deg,
                            #ffd6a5 270deg 300deg, #caffbf 300deg 330deg, #9bf6ff 330deg 360deg
                        )`
                            }}
                        >
                            {/* Numbers around the wheel */}
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute inset-0 flex items-start justify-center font-black text-slate-800/40 text-xs"
                                    style={{ transform: `rotate(${i * 30 + 15}deg)`, paddingTop: '15px' }}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Center Spin Button */}
                        <button
                            onClick={startSpin}
                            disabled={isSpinning || hasSpun}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center font-black text-white text-sm md:text-base uppercase tracking-tighter transition-all active:scale-90 disabled:opacity-100
                        ${hasSpun ? 'bg-slate-400' : 'bg-slate-900 hover:bg-black cursor-pointer animate-pulse-subtle'}
                    `}
                        >
                            {isSpinning ? "..." : hasSpun ? "Used" : "Spin"}
                        </button>

                        <p className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                            Spin to win a random <span className="text-emerald-500">Bonus Reward</span>
                        </p>
                    </Card>

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
                            <Link href="/jobs" className="w-full">
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