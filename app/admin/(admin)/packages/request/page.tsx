"use client"

import React, { useState } from 'react';
import {
    Search, CheckCircle2, XCircle, Clock,
    Zap, Filter, MoreHorizontal, ChevronLeft,
    ChevronRight, Loader2, Crown, CircleDollarSign,
    ExternalLink, Wallet
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useDebounce } from 'use-debounce';
import { useGetMembershipRequests, useUpdateMembershipStatus } from '@/hooks/admin/use-membership';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import StatusBadge from '@/components/admin/package/StatusBadge';
import RowSkeleton from '@/components/admin/package/RowSkeleton';
import MetricCard from '@/components/admin/package/MetricCard';

export default function AdminMembershipRequests() {
    const queryClient = useQueryClient();

    const [filter, setFilter] = useState("PENDING");
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [page, setPage] = useState(1);

    // API Hooks
    const { data: response, isLoading } = useGetMembershipRequests(page, filter, debouncedSearch);

    const { mutate: updateStatus, isPending: isUpdating } = useUpdateMembershipStatus();

    const requests = response?.data || [];

    const meta = response?.meta;

    const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
        console.log(id)
        updateStatus({ id, status }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["admin-submitted-jobs"] });
                toast.success(`Request ${status.toLowerCase()} successfully`)
            },
            onError: (error) => {
                let message = "Failed to publish";

                if (axios.isAxiosError(error)) {
                    message = error.response?.data?.message;
                }

                toast.error("Failed to publish", { description: message });
            }
        });

    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-7xl mx-auto px-4 space-y-6">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Membership Audits</h1>
                        <p className="text-slate-500 font-medium text-sm italic">Verify payments and activate premium tiers</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <MetricCard label="Pending" val={meta?.totalItems || 0} color="amber" icon={<Clock size={18} />} />
                        <MetricCard label="Today's Revenue"
                            val="৳14.5k" color="emerald" icon={<CircleDollarSign size={18} />} />
                    </div>
                </div>

                {/* --- TOOLBAR --- */}
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
                            {["PENDING", "APPROVED", "REJECTED", "ALL"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setFilter(tab === "ALL" ? "" : tab); setPage(1); }}
                                    className={cn(
                                        "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                        (filter === tab || (tab === "ALL" && filter === ""))
                                            ? 'bg-slate-900 text-white shadow-md'
                                            : 'text-slate-400 hover:bg-slate-50'
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative grow lg:w-80 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input
                                placeholder="Search TXID or User..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500 font-semibold"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* --- DATA TABLE --- */}
                <Card className="bg-white border-none shadow-sm rounded-4xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Worker</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Tier</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Number</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Proof</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => <RowSkeleton key={i} />)
                                ) : requests.map((req: any) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10 border border-slate-100">
                                                    <AvatarFallback className="bg-slate-100 font-black text-slate-400 text-xs">U</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 leading-none mb-1">{req.freelancer.user.fullName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{req.freelancer.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-slate-700 uppercase">
                                                    {req.requestedPlan.membershipName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-slate-700 uppercase">
                                                    {req.phoneNumber}<br />
                                                    {req?.accountType}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-xs font-black italic tracking-tighter",
                                                    req.paymentMethod === 'BKASH' ? 'text-[#D12053]' : 'text-[#ED1C24]'
                                                )}>
                                                    {req.paymentMethod} • ৳{req.requestedPlan.price}
                                                </span>
                                                <span className="text-[10px] font-black text-blue-600 font-mono mt-1 bg-blue-50 w-fit px-1.5 rounded">
                                                    TrxID-{req.trxID}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <StatusBadge status={req.status} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {req.status === 'PENDING' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        disabled={isUpdating}
                                                        onClick={() => handleAction(req.id, 'APPROVED')}
                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-black h-9 rounded-xl px-5 text-xs shadow-md"
                                                    >
                                                        {isUpdating ? <Loader2 className="animate-spin" size={14} /> : "Verify & Activate"}
                                                    </Button>
                                                    <Button
                                                        disabled={isUpdating}
                                                        onClick={() => handleAction(req.id, 'REJECTED')}
                                                        variant="ghost" className="text-red-500 font-bold h-9 rounded-xl px-4 text-xs"
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-300">
                                                    <ExternalLink size={18} />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION --- */}
                    <div className="bg-slate-50/50 p-6 flex items-center justify-between border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Page {meta?.currentPage || 1} of {meta?.totalPages || 1}
                        </p>
                        <div className="flex gap-2">
                            <Button disabled={!meta?.hasPreviousPage} onClick={() => setPage(p => p - 1)} variant="outline" size="sm" className="rounded-xl font-bold bg-white">
                                <ChevronLeft size={16} />
                            </Button>
                            <Button disabled={!meta?.hasNextPage} onClick={() => setPage(p => p + 1)} variant="outline" size="sm" className="rounded-xl font-bold bg-white">
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

