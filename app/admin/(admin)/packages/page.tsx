"use client"

import React, { ReactNode, useState } from 'react';
import {
    Zap, Plus, Search, MoreHorizontal, Edit3, Trash2, Users,
    Eye, Ban, Crown, TrendingUp, AlertCircle, CalendarDays
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from 'next/link';
import { useGetMembershipList } from '@/hooks/admin/use-membership';

export default function AdminPackageList() {
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const { data: response, isLoading, isError, refetch } = useGetMembershipList(page, filter, search);

    const membershipPlans = response?.data || [];
    const meta = response?.meta;

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-7xl mx-auto px-4 space-y-6">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Membership Directory</h1>
                        <p className="text-slate-500 font-medium text-sm">Configure pricing, submission caps, and daily throttles</p>
                    </div>
                    <Link href="/admin/packages/create">
                        <Button className="bg-slate-900 hover:bg-black text-white font-black h-12 px-8 rounded-xl shadow-lg flex gap-2 transition-all active:scale-95">
                            <Plus size={20} /> Create New Tier
                        </Button>
                    </Link>
                </div>

                {/* --- TOOLBAR --- */}
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            {["All", "Active", "Inactive"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input
                                placeholder="Search packages..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* --- PACKAGE TABLE --- */}
                <Card className="bg-white border-none shadow-sm rounded-[2.5rem] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Name</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Monthly Limit</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Daily Cap</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Users</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [...Array(3)].map((_, i) => <TableSkeleton key={i} />)
                                ) : isError ? (
                                    <ErrorState onRetry={refetch} />
                                ) : (
                                    membershipPlans.map((plan: any) => (
                                        <tr key={plan.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 bg-[${plan.color}] rounded-xl flex items-center justify-center text-emerald-600 shadow-inner`}
                                                        dangerouslySetInnerHTML={{ __html: plan.icon }}
                                                    />                                                        
                                                    
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800 leading-none">{plan.membershipName}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Order: {plan.planOrder}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Price Field */}
                                            <td className="px-6 py-6 text-center">
                                                <span className="text-sm font-black text-slate-900 tracking-tight">
                                                    {plan.price === "0" ? (
                                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0 text-[10px]">FREE</Badge>
                                                    ) : (
                                                        `৳${plan.price}`
                                                    )}
                                                </span>
                                            </td>

                                            {/* Monthly Limit Field */}
                                            <td className="px-6 py-6 text-center">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900">{plan.jobsSubmitLimit}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Per Month</span>
                                                </div>
                                            </td>

                                            {/* Daily Cap Field (New) */}
                                            <td className="px-6 py-6 text-center">
                                                <div className="flex flex-col items-center justify-center gap-0.5">
                                                    <span className="text-sm font-black text-amber-600 flex items-center gap-1">
                                                        <Zap size={12} /> {plan.limitParDay}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Daily Limit</span>
                                                </div>
                                            </td>

                                            {/* Count Field */}
                                            <td className="px-6 py-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-bold text-slate-700">{plan._count.freelancers}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Subscribers</span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/admin/packages/edit/${plan.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                                            <Edit3 size={18} />
                                                        </Button>
                                                    </Link>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400">
                                                                <MoreHorizontal size={18} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl font-poppins">
                                                            <DropdownMenuItem className="gap-2 font-bold text-slate-600"><Eye size={14} /> View Stats</DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 font-bold text-red-500"><Trash2 size={14} /> Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>
        </div>
    );
}

// --- UPDATED SKELETON (Matched to 6 Columns) ---
const TableSkeleton = () => (
    <tr className="bg-white">
        <td className="px-8 py-6">
            <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl bg-slate-100" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-slate-100" />
                    <Skeleton className="h-2 w-16 bg-slate-50" />
                </div>
            </div>
        </td>
        <td className="px-6 py-6"><Skeleton className="h-5 w-12 mx-auto bg-slate-100" /></td>
        <td className="px-6 py-6"><Skeleton className="h-8 w-10 mx-auto bg-slate-100" /></td>
        <td className="px-6 py-6"><Skeleton className="h-8 w-10 mx-auto bg-slate-100 text-amber-100" /></td>
        <td className="px-6 py-6"><Skeleton className="h-5 w-8 mx-auto bg-slate-100" /></td>
        <td className="px-8 py-6"><Skeleton className="h-8 w-8 ml-auto rounded-full bg-slate-100" /></td>
    </tr>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <tr>
        <td colSpan={6} className="px-8 py-20 text-center">
            <div className="flex flex-col items-center gap-3">
                <AlertCircle size={40} className="text-red-400" />
                <p className="font-bold text-slate-600 tracking-tight">Syncing error occurred</p>
                <Button variant="outline" onClick={onRetry} className="rounded-xl font-bold">Try Refresh</Button>
            </div>
        </td>
    </tr>
);