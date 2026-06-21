"use client";

import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function SimpleSuccessPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-poppins">
            <Card className="w-full max-w-md border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden">
                <CardContent className="pt-12 pb-10 px-10 text-center space-y-6">

                    {/* --- SUCCESS ICON --- */}
                    <div className="w-24 h-24 bg-[#1abc9c]/10 rounded-full flex items-center justify-center mx-auto text-[#1abc9c]">
                        <CheckCircle2 size={60} strokeWidth={1.5} className="animate-in zoom-in duration-500" />
                    </div>

                    {/* --- MESSAGE --- */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                            Success!
                        </h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            {`We've`} sent a password reset link to your email.
                            Please check your inbox to continue.
                        </p>
                    </div>

                    {/* --- ACTION --- */}
                    <Button
                        asChild
                        className="w-full h-14 bg-[#1abc9c] hover:bg-[#16a085] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#1abc9c]/20 transition-all active:scale-95"
                    >
                        <Link href="/login" className="flex items-center justify-center gap-2">
                            Back to Login <ArrowRight size={20} />
                        </Link>
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}