"use client"

import React, { ReactNode, useState } from 'react';
import {
    Search, MoreHorizontal, UserCheck, Mail, TrendingUp,
    CheckCircle2, ExternalLink, Ban, Download, Users
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from 'next/link';
import { useGetFreelancers } from '@/hooks/admin/freelancers';
import { freelancerType } from '@/types/profile';

interface Meta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// --- SKELETON ROW ---
const SkeletonRow = () => (
    <tr className="border-b border-slate-50">
        <td className="px-8 py-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2.5 w-24" />
                </div>
            </div>
        </td>
        <td className="px-8 py-6">
            <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2.5 w-16" />
            </div>
        </td>
        <td className="px-8 py-6">
            <div className="space-y-2">
                <Skeleton className="h-2.5 w-28" />
                <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
        </td>
        <td className="px-8 py-6 text-center">
            <Skeleton className="h-6 w-16 rounded-lg mx-auto" />
        </td>
        <td className="px-8 py-6">
            <div className="flex items-center justify-end gap-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
            </div>
        </td>
    </tr>
);

// --- MAIN COMPONENT ---
export default function AdminFreelancerList() {
    const [filter, setFilter] = useState("All");
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetFreelancers(page);

    const freelancers: freelancerType[] = data?.data ?? [];
    const meta: Meta | undefined = data?.meta;
    
    const handleAction = (key: string, action: string) => {
        toast.info(`User ${key} ${action}`, {
            description: "Account has been updated in the database.",
        });
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-7xl mx-auto px-4 space-y-6">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Freelancer Directory</h1>
                        <p className="text-slate-500 font-medium text-sm">Monitor worker performance and manage account access</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <MetricBox
                            label="Total Workers"
                            val={meta ? meta.totalItems.toLocaleString() : "—"}
                            icon={<Users className="text-blue-500" />}
                        />
                        <MetricBox
                            label="This Page"
                            val={meta ? `${meta.itemCount}` : "—"}
                            icon={<TrendingUp className="text-emerald-500" />}
                        />
                        <MetricBox
                            label="Total Pages"
                            val={meta ? `${meta.totalPages}` : "—"}
                            icon={<CheckCircle2 className="text-amber-500" />}
                            className="hidden md:flex"
                        />
                    </div>
                </div>

                {/* SEARCH & FILTERS */}
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {["All", "Active", "Warning", "Banned"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div> */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative grow md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <Input
                                    placeholder="Search by ref key..."
                                    className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500"
                                />
                            </div>
                            <Button variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-600 font-bold px-4">
                                <Download size={18} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* TABLE */}
                <Card className="bg-white border-none shadow-sm rounded-4xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Freelancer</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial</th>
                                    {/* <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th> */}
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Plan</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading && (
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))
                                )}

                                {isError && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16 text-center text-sm text-slate-400 font-bold">
                                            Failed to load freelancers. Please try again.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && !isError && freelancers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16 text-center text-sm text-slate-400 font-bold">
                                            No freelancers found.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && !isError && freelancers.map((user) => (
                                    <tr key={user.referKey} className="hover:bg-slate-50/30 transition-colors group">

                                        {/* Profile */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-11 w-11 border-2 border-slate-100 shadow-sm">
                                                    <AvatarImage src={`${user.user.avatar}`} />
                                                    <AvatarFallback className="bg-slate-100 font-bold text-slate-400 text-xs">
                                                        {user.user?.fullName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 leading-none mb-1">
                                                        {user.user.fullName}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-blue-500 lowercase tracking-tighter">
                                                        {user.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Financial */}
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-emerald-600 tracking-tighter">
                                                    ৳{parseFloat(`${user.currentBalance}`).toLocaleString()}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                                                    {user.totalSubmitted} submitted
                                                </p>
                                            </div>
                                        </td>

                                        {/* Performance */}
                                        {/* <td className="px-8 py-6 min-w-45">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                                    <span className="text-slate-400">Success Rate</span>
                                                    <span className={user.totalSuccessRate > 90 ? 'text-emerald-500' : 'text-amber-500'}>
                                                        {user.totalSuccessRate}%
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={user.totalSuccessRate}
                                                    className={`h-1.5 bg-slate-100 [&>div]:${user.totalSuccessRate > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                />
                                                <p className="text-[10px] text-slate-400 font-bold">
                                                    ✅ {user.totalApproved} &nbsp;❌ {user.totalRejected}
                                                </p>
                                            </div>
                                        </td> */}

                                        {/* Plan */}
                                        <td className="px-8 py-6 text-center">
                                            <Badge
                                                variant="outline"
                                                className="border-purple-100 bg-purple-50 text-purple-600 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg"
                                            >
                                                {user.membershipPlan.membershipName}
                                            </Badge>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                                                >
                                                    <Mail size={18} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400">
                                                            <MoreHorizontal size={20} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 rounded-xl font-poppins">
                                                        <DropdownMenuItem className="gap-3 font-bold text-slate-600 py-3">
                                                            <Link href={`/admin/freelancers/${user.referKey}`} className="flex items-center gap-2">
                                                                <ExternalLink size={16} /> View Full Profile
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-3 font-bold text-slate-600 py-3">
                                                            <UserCheck size={16} className="text-emerald-500" /> Verify Documents
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-3 font-bold text-red-500 py-3"
                                                            onClick={() => handleAction(user.referKey, "Banned")}
                                                        >
                                                            <Ban size={16} /> Ban Account
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="bg-slate-50/50 p-6 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {meta
                                ? `Showing ${((meta.currentPage - 1) * meta.itemsPerPage) + 1}–${Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} of ${meta.totalItems.toLocaleString()} Workers`
                                : "Loading..."}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg font-bold border-slate-200"
                                disabled={!meta?.hasPreviousPage || isLoading}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg font-bold border-slate-200"
                                disabled={!meta?.hasNextPage || isLoading}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---
type MetricBoxType = {
    label: string;
    val: string;
    icon: ReactNode;
    className?: string;
};

const MetricBox = ({ label, val, icon, className = "" }: MetricBoxType) => (
    <div className={`bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-37.5 ${className}`}>
        <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">{val}</p>
        </div>
    </div>
);