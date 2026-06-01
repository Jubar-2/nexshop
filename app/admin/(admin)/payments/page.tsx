"use client"

import React, { useState } from 'react';
import {
    Search, CheckCircle2, XCircle, Clock,
    Wallet, Smartphone, ArrowUpRight, Filter,
    MoreHorizontal, ChevronLeft, ChevronRight,
    Loader2, CircleDollarSign, History
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useDebounce } from 'use-debounce';
import { useGetWithdrawals, useUpdateWithdrawalStatus } from '@/hooks/admin/use-payments';
import { cn } from '@/lib/utils';

export default function AdminPaymentRequests() {
    const [filter, setFilter] = useState("PENDING");
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [page, setPage] = useState(1);

    // API Hooks
    const { data: response, isLoading } = useGetWithdrawals(page, filter, debouncedSearch);
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateWithdrawalStatus();

    const requests = response?.data || [];
    const meta = response?.meta;

    const handleStatusUpdate = (id: string, status: 'APPROVED' | 'REJECTED') => {
        updateStatus({ id, status }, {
            onSuccess: () => toast.success(`Payment marked as ${status.toLowerCase()}`)
        });
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-7xl mx-auto px-4 space-y-6">

                {/* --- HEADER & SUMMARY --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Withdrawal Queue</h1>
                        <p className="text-slate-500 font-medium text-sm italic">Audit and process outbound wallet transfers</p>
                    </div>

                    <div className="flex gap-4">
                        <SummaryBox label="Pending Requests" val={meta?.totalItems || 0} color="amber" icon={<Clock size={18}/>} />
                        <SummaryBox label="Volume Today" val="৳24,500" color="blue" icon={<History size={18}/>} />
                    </div>
                </div>

                {/* --- TOOLBAR --- */}
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto no-scrollbar">
                            {["PENDING", "APPROVED", "REJECTED", "ALL"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setFilter(tab === "ALL" ? "" : tab); setPage(1); }}
                                    className={cn(
                                        "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
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
                                placeholder="Search by phone or name..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500 font-semibold"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* --- DATA TABLE --- */}
                <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Freelancer</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount (৳)</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wallet Details</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => <RowSkeleton key={i} />)
                                ) : requests.map((req: any) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                                                    <AvatarFallback className="bg-slate-100 font-black text-slate-400 text-xs">U</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 leading-none mb-1">{req.freelancer.user.fullName}</p>
                                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tight">Ref: {req.id.slice(-8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-lg font-black text-slate-900 tracking-tighter tabular-nums">
                                                ৳{parseFloat(req.amount).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-xs font-black italic tracking-tighter uppercase",
                                                    req.paymentMethod === 'BKASH' ? 'text-[#D12053]' : 'text-[#ED1C24]'
                                                )}>
                                                    {req.paymentMethod}
                                                </span>
                                                <span className="text-[11px] font-black text-slate-700 font-mono mt-1 bg-slate-50 w-fit px-1.5 rounded flex items-center gap-1.5">
                                                    <Smartphone size={12} className="text-slate-300" /> {req.phoneNumber}
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
                                                        onClick={() => handleStatusUpdate(req.id, 'APPROVED')}
                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-black h-9 rounded-xl px-5 text-xs shadow-md transition-all active:scale-95"
                                                    >
                                                        {isUpdating ? <Loader2 className="animate-spin" size={14}/> : "Approve"}
                                                    </Button>
                                                    <Button 
                                                        disabled={isUpdating}
                                                        onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                                                        variant="ghost" className="text-red-500 font-bold h-9 rounded-xl px-4 text-xs"
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-200 cursor-default">
                                                    <CheckCircle2 size={18} />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
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
                                variant="outline" size="sm" className="rounded-xl font-bold bg-white"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button 
                                disabled={!meta?.hasNextPage || isLoading} 
                                onClick={() => setPage(p => p + 1)} 
                                variant="outline" size="sm" className="rounded-xl font-bold bg-white"
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

// --- REUSABLE MINI-COMPONENTS ---

const SummaryBox = ({ label, val, color, icon }: any) => (
    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm flex items-center gap-4 min-w-[170px] border border-slate-100">
        <div className={cn(
            "p-2.5 rounded-xl",
            color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
        )}>{icon}</div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">{val}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        APPROVED: "bg-emerald-50 text-emerald-600",
        PENDING: "bg-amber-50 text-amber-600",
        REJECTED: "bg-red-50 text-red-600",
    };
    return (
        <Badge variant="outline" className={cn("border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg mx-auto", styles[status])}>
            {status}
        </Badge>
    );
};

const RowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-8 py-6"><div className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full bg-slate-100" /><div className="space-y-2"><Skeleton className="h-3 w-24 bg-slate-100" /><Skeleton className="h-2 w-32 bg-slate-50" /></div></div></td>
        <td className="px-8 py-6"><Skeleton className="h-7 w-20 bg-slate-100 rounded-lg" /></td>
        <td className="px-8 py-6"><div className="space-y-2"><Skeleton className="h-3 w-20 bg-slate-100" /><Skeleton className="h-3 w-32 bg-slate-50" /></div></td>
        <td className="px-8 py-6 text-center"><Skeleton className="h-6 w-16 bg-slate-100 rounded-lg mx-auto" /></td>
        <td className="px-8 py-6 text-right"><Skeleton className="h-9 w-28 bg-slate-100 rounded-xl ml-auto" /></td>
    </tr>
);