"use client"

import React, { useState } from 'react';
import {
    Search, Plus, Filter, MoreHorizontal,
    Globe, TrendingUp, Clock, CheckCircle2,
    PauseCircle, PlayCircle, Edit3,
    Trash2, CircleDollarSign, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { useGetJobs } from '@/hooks/admin/use-jobs';
import { Job as JobType } from '@/types/jobs';
import MetricCard from '@/components/admin/jobs/MetricCard';
import Job from '@/components/admin/jobs/Job';

export default function AdminJobList() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetJobs(filter, debouncedSearch, page);

    const jobs = data?.data || [];
    const meta = data?.meta;

    const toggleStatus = (id: string, currentStatus: string) => {
        toast.info(`Updating Job...`);
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-7xl mx-auto px-4 space-y-6">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Micro-Jobs</h1>
                        <p className="text-slate-500 font-medium text-sm italic">Monitor performance and campaign lifecycle</p>
                    </div>
                    <Link href="/admin/jobs/create">
                        <Button className="bg-slate-900 hover:bg-black text-white font-black h-12 px-8 rounded-xl shadow-lg flex gap-2">
                            <Plus size={20} /> Create New Job
                        </Button>
                    </Link>
                </div>

                {/* --- PERFORMANCE SNAPSHOT --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoading ? (
                        [1, 2, 3].map(i => <MetricSkeleton key={i} />)
                    ) : (
                        <>
                            <MetricCard
                                label="System Total"
                                val={meta?.totalItems || 0}
                                icon={<TrendingUp className="text-emerald-500" />}
                            />

                            <MetricCard
                                label="Current Page Items"
                                val={meta?.itemCount || 0}
                                icon={<CircleDollarSign className="text-blue-500" />}
                            />

                            <MetricCard
                                label="Success Index"
                                val="94.8%"
                                icon={<CheckCircle2 className="text-amber-500" />}
                            />
                        </>
                    )}
                </div>

                {/* --- TOOLBAR --- */}
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
                            {["All", "Live", "Paused", "Completed"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setFilter(tab); setPage(1); }}
                                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <div className="relative grow lg:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <Input
                                    placeholder="Search job title..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500 font-semibold"
                                />
                            </div>
                            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 text-slate-500">
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Filter size={18} />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* --- JOBS TABLE --- */}
                <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Details</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reward</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => <TableRowSkeleton key={i} />)
                                ) : (
                                    jobs.map((job: JobType) => (
                                        <Job key={job.id} job={job} />
                                    ))
                                )}
                                {!isLoading && jobs.length <= 0 ? (<tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No data found</td></tr>) : (<></>)}

                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION FOOTER --- */}
                    <div className="bg-slate-50/50 p-6 flex items-center justify-between border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Page {meta?.currentPage || 1} of {meta?.totalPages || 1}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                disabled={!meta?.hasPreviousPage || isLoading}
                                onClick={() => setPage(p => p - 1)}
                                variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 bg-white"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button
                                disabled={!meta?.hasNextPage || isLoading}
                                onClick={() => setPage(p => p + 1)}
                                variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 bg-white"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

// --- SKELETON COMPONENTS ---

const MetricSkeleton = () => (
    <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex items-center justify-between animate-pulse">
        <div className="space-y-2">
            <Skeleton className="h-2.5 w-24 bg-slate-100" />
            <Skeleton className="h-7 w-16 bg-slate-200" />
        </div>
        <Skeleton className="h-11 w-11 rounded-2xl bg-slate-50" />
    </Card>
);

const TableRowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-8 py-6">
            <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-32 bg-slate-200" />
                    <Skeleton className="h-2 w-24 bg-slate-100" />
                </div>
            </div>
        </td>
        <td className="px-8 py-6">
            <div className="space-y-3">
                <div className="flex justify-between">
                    <Skeleton className="h-2 w-16 bg-slate-100" />
                    <Skeleton className="h-2 w-12 bg-slate-100" />
                </div>
                <Skeleton className="h-1.5 w-full bg-slate-100" />
            </div>
        </td>
        <td className="px-8 py-6">
            <Skeleton className="h-4 w-12 bg-slate-200 mx-auto" />
        </td>
        <td className="px-8 py-6">
            <Skeleton className="h-6 w-20 bg-slate-100 rounded-lg mx-auto" />
        </td>
        <td className="px-8 py-6 text-right">
            <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded-full bg-slate-50" />
                <Skeleton className="h-8 w-8 rounded-full bg-slate-50" />
            </div>
        </td>
    </tr>
);

// --- STATIC UI COMPONENTS ---



