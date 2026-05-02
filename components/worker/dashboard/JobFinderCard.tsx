"use client"

import { AlertCircle, Briefcase, Search, RefreshCw } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetTotalJobsNumber } from '@/hooks/use-freelancer';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';

function JobFinderCard() {
    const { data, isLoading, isError, refetch } = useGetTotalJobsNumber();

    // =====================
    // LOADING STATE
    // =====================
    if (isLoading) {
        return (
            <Card className="bg-white border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden h-full min-h-85">
                <div className="absolute top-4 right-4">
                    <Skeleton className="h-6 w-20 rounded-lg bg-slate-100" />
                </div>
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                    <Spinner className="text-slate-300" />
                </div>
                <Skeleton className="h-10 w-12 mb-4 bg-slate-100" />
                <div className="space-y-2 mb-8">
                    <Skeleton className="h-4 w-48 bg-slate-50" />
                    <Skeleton className="h-4 w-32 mx-auto bg-slate-50" />
                </div>
                <Skeleton className="w-full h-14 rounded-xl bg-slate-100" />
            </Card>
        );
    }

    // =====================
    // ERROR STATE
    // =====================
    if (isError) {
        return (
            <Card className="bg-white border-red-50 shadow-sm rounded-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden h-full min-h-85">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Connection Error</h3>
                <p className="text-slate-500 text-sm mb-6">{"We couldn't fetch the latest jobs."}<br />Please try again.</p>
                <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="w-full border-slate-200 rounded-xl h-12 font-bold gap-2"
                >
                    <RefreshCw size={16} />
                    Retry
                </Button>
            </Card>
        );
    }

    const hasJobs = data?.total > 0;

    return (
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden h-full min-h-85 transition-all hover:shadow-md group">

            {/* Dynamic Badge */}
            <div className="absolute top-4 right-4">
                <Badge
                    className={`${hasJobs
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-slate-200 text-slate-500"
                        } text-white border-none rounded-lg px-3 py-1 font-black transition-colors`}>
                    {data?.total ?? 0} ACTIVE
                </Badge>
            </div>

            {/* Icon Box */}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-colors ${hasJobs ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"
                }`}>
                <Briefcase size={40} className="group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Total Count */}
            <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">
                {data?.total ?? 0}
            </h3>

            {/* Conditional Messaging */}
            <p className="text-slate-500 font-medium mb-8 leading-relaxed text-sm">
                {hasJobs ? (
                    <>High-paying jobs are currently<br />available for your profile.</>
                ) : (
                    <>No new jobs found right now.<br />Please check back later.</>
                )}
            </p>

            {/* CTA Button */}
            <Button
                disabled={!hasJobs}
                className={`w-full rounded-xl h-14 font-black text-lg gap-3 shadow-lg transition-all active:scale-95 ${hasJobs
                    ? "bg-[#10B981] hover:bg-[#0da06f] text-white"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
            >
                <Search size={20} />
                {hasJobs ? "Browse All Jobs" : "Refresh List"}
            </Button>
        </Card>
    );
}

export default JobFinderCard;