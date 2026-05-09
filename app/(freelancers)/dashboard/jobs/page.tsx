"use client"

import React, { useMemo, useState } from 'react';
import {
    Search,
    ThumbsUp,
    UserPlus,
    MessageSquare,
    PlayCircle,
    Filter,
    ChevronRight,
    Zap,
    Globe,
    Clock,
    CircleDollarSign,
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGetJobs } from '@/hooks/use-jobs';
import { formatJobTime } from '@/hooks/utility';
import { useRouter } from 'next/navigation';
import { Job } from '@/types/jobs';
import JobCard from '@/components/worker/dashboard/JobCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Job as jobType } from "@/types/jobs"

// Mock Data for Jobs
const jobData = [
    {
        id: 1,
        title: "Watch & Like YouTube Video (5 Mins)",
        category: "YouTube",
        reward: "৳15.00",
        slots: 85,
        totalSlots: 200,
        time: "5m",
        icon: <Clock className="text-red-600" />,
        type: "Watch + Like"
    },
    {
        id: 2,
        title: "Follow Facebook Page & Comment",
        category: "Facebook",
        reward: "৳8.50",
        slots: 140,
        totalSlots: 150,
        time: "2m",
        icon: <Clock className="text-blue-600" />,
        type: "Follow + Comment"
    },
    {
        id: 3,
        title: "Subscribe to My Channel",
        category: "YouTube",
        reward: "৳5.00",
        slots: 10,
        totalSlots: 500,
        time: "1m",
        icon: <PlayCircle className="text-red-500" />,
        type: "Subscription"
    },
    {
        id: 4,
        title: "Follow Instagram Account",
        category: "Instagram",
        reward: "৳4.00",
        slots: 490,
        totalSlots: 500,
        time: "30s",
        icon: <Clock className="text-pink-600" />,
        type: "Follow"
    },
];

const categories = ["All Jobs", "YouTube", "Facebook", "Instagram", "Others"];

export default function JobListPage() {

    const { data, isLoading } = useGetJobs();
    
    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-4xl mx-auto px-4 space-y-6">

                {/* --- SEARCH & FILTER HEADER --- */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Available Jobs</h1>
                            <p className="text-slate-500 font-medium text-sm">Find tasks and start earning instantly</p>
                        </div>
                        {/* <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input 
                        placeholder="Search jobs..." 
                        className="h-12 pl-12 rounded-2xl bg-white border-none shadow-sm focus-visible:ring-emerald-500"
                    />
                </div> */}
                    </div>

                    {/* Category Pills (Facebook Style) */}
                    {/* <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                            activeTab === cat 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div> */}
                </div>

                {/* --- JOB FEED --- */}
                <div className="space-y-4">
                    {
                        isLoading ? [1, 2, 3, 4, 5].map((i) => (

                            <Card key={i}
                                className="bg-white border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row items-center p-6 gap-6">

                                        {/* Icon Section */}
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <Skeleton className="w-16  h-11 px-8 flex gap-2 " />
                                        </div>

                                        {/* Info Section */}
                                        <div className="grow space-y-2 text-center md:text-left">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                <h3 className="text-lg font-black text-slate-800 leading-tight">
                                                    <Skeleton className="w-38.75 h-5.5 px-8 flex gap-2 " />
                                                </h3>
                                                <Badge variant="outline" className="w-fit mx-auto md:mx-0 border-emerald-100 text-emerald-600 bg-emerald-50 rounded-lg px-2 font-bold text-[10px] uppercase">
                                                    <Skeleton className="w-7.5 h-3.5 px-8 flex gap-2 " />
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400 text-xs font-bold uppercase tracking-tight">
                                                <span className="flex items-center gap-1.5">
                                                    <Skeleton className="w-20 h-4 px-8 flex gap-2 " />
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Skeleton className="w-4 h-4 px-8 flex gap-2 " />
                                                </span>
                                            </div>

                                            {/* Progress Tracker */}
                                            <div className="pt-2 max-w-xs mx-auto md:mx-0">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slots Left</span>
                                                    <span className="text-xs font-bold text-slate-700">
                                                        <Skeleton className="w-5 h-4 px-8 gap-2 inline-block" /> / <Skeleton className="w-5 h-4 px-8 gap-2 inline-block" />
                                                    </span>
                                                </div>
                                                <Progress value={0} className="h-1.5 bg-slate-100 [&>div]:bg-emerald-500" />
                                            </div>
                                        </div>

                                        {/* Reward & Action Section */}
                                        <div className="flex flex-col items-center md:items-end gap-3 min-w-35">
                                            <div className="text-center md:text-right">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">You Earn</p>
                                                <h4 className="text-2xl font-black text-emerald-600">
                                                    <Skeleton className="w-6 h-8 px-8 flex gap-2" />
                                                </h4>
                                            </div>
                                            <Skeleton className="w-37.5 h-10.5 px-8 flex gap-2" />
                                        </div>

                                    </div>
                                </CardContent>
                            </Card >

                        )) :
                            (data.map((job: jobType) => (
                                <JobCard key={job.id} job={job} />
                            )))
                    }
                </div>

                {/* Pagination / Load More */}
                {/* <div className="flex justify-center pt-6">
            <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold px-8 h-12 hover:bg-white shadow-sm">
                Load More Jobs
            </Button>
        </div> */}

            </div>
        </div>
    );
}

