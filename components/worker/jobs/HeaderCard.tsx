"use client"

import React, { useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure this is installed
import { useGetJob } from "@/hooks/use-jobs";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

function HeaderCard() {
    const params = useParams();
    const router = useRouter();
    const jobId = params?.id as string;
    const { data, isLoading, error } = useGetJob(jobId);

    const formattedBalance = useMemo(() => {
        const value = data?.job?.reward ?? 0;
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(value).replace("BDT", "৳"); // Clean custom currency symbol
    }, [data?.job?.reward]);

    useEffect(() => {
        if (axios.isAxiosError(error)) {
            if (error?.response?.status === 409) {
                router.push("/dashboard/jobs");
            }
        }
    }, [error, router])

    // --- LOADING STATE (SKELETON) ---
    if (isLoading) {
        return (
            <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Icon Box Skeleton */}
                        <Skeleton className="w-20 h-20 rounded-3xl shrink-0 bg-slate-100" />

                        {/* Content Skeleton */}
                        <div className="grow text-center md:text-left space-y-3 w-full">
                            <Skeleton className="h-8 w-3/4 mx-auto md:mx-0 bg-slate-100 rounded-lg" />
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <Skeleton className="h-4 w-24 bg-slate-50 rounded-md" />
                                <Skeleton className="h-4 w-24 bg-slate-50 rounded-md" />
                                <Skeleton className="h-4 w-24 bg-slate-50 rounded-md" />
                            </div>
                        </div>

                        {/* Reward Box Skeleton */}
                        <div className="shrink-0 w-32 h-24 bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-2 px-6">
                            <Skeleton className="h-3 w-16 bg-slate-100 rounded-full" />
                            <Skeleton className="h-8 w-20 bg-slate-200 rounded-lg" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }


    return (
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden animate-in fade-in duration-500">
            <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Platform Icon */}
                    <div
                        className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden border border-slate-100"
                        dangerouslySetInnerHTML={{ __html: data?.job?.category?.icon }}
                    />

                    {/* Job Details */}
                    <div className="grow text-center md:text-left space-y-2">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                            {data?.job?.jobTitle}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                                <Clock size={16} className="text-blue-500" /> 5 Min Task
                            </span>
                            <span className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-500" /> Admin Verified
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-amber-500" /> 98% Success
                            </span>
                        </div>
                    </div>

                    {/* Reward Box */}
                    <div className="bg-emerald-50 px-8 py-5 rounded-2xl text-center border border-emerald-100/50 shadow-sm min-w-35">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">
                            Total Reward
                        </p>
                        <h4 className="text-3xl font-black text-emerald-600 tracking-tighter">
                            {formattedBalance}
                        </h4>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default HeaderCard;