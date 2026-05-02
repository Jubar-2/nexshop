"use client"

import { useState } from 'react';
import {
    FileText,
    Search,
    Download,
    ArrowLeft,
    CheckCircle2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    History as HistoryIcon // Corrected import for HistoryIcon
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import SummaryCard from '@/components/worker/statement/SummaryCard';
import StatusBadge from '@/components/worker/statement/StatusBadge';
import { Transaction, useGetWithdrawalStatement } from '@/hooks/use-withdraw';


export default function WithdrawStatementPage() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isFetching } = useGetWithdrawalStatement(page, searchTerm);

    const statements = data?.data || [];
    const meta = data?.meta || { totalPages: 0, lastPage: 1 };

    // Strong Typing for Stats Calculation
    const approvedStatements = statements.filter((s: Transaction) => s.status === "Approved");

    const stats = {
        totalPayout: approvedStatements.reduce((acc: number, curr: Transaction) => acc + Number(curr.amount), 0),
        successRate: statements.length > 0
            ? Math.round((approvedStatements.length / statements.length) * 100)
            : 0
    };

    const handleExport = () => {
        toast.success("Downloading Statement", {
            description: "Your withdrawal history PDF is being generated.",
            icon: <Download className="w-4 h-4 text-emerald-500" />
        });
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-4xl mx-auto px-4 space-y-6">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div className="space-y-1">
                        <Link href="/wallet" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-bold text-sm group mb-1">
                            <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:bg-emerald-50 transition-colors">
                                <ArrowLeft size={14} />
                            </div>
                            Wallet
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Withdrawal Statement
                            {isFetching && <Loader2 className="animate-spin text-emerald-500" size={20} />}
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">Full history of your payout transactions</p>
                    </div>

                    <Button
                        onClick={handleExport}
                        disabled={statements.length === 0}
                        className="bg-slate-900 hover:bg-black text-white h-12 rounded-xl font-bold px-6 gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Download size={18} /> Export PDF
                    </Button>
                </div>

                {/* --- SUMMARY METRICS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard title="Page Payouts" value={`৳${stats.totalPayout.toLocaleString()}`} icon={<FileText />} color="blue" />
                    <SummaryCard title="Success Rate" value={`${stats.successRate}%`} icon={<CheckCircle2 />} color="emerald" />
                    <SummaryCard title="Total Found" value={meta.totalPages.toString()} icon={<Calendar />} color="slate" />
                </div>

                {/* --- TABLE & FILTER CARD --- */}
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden min-h-125">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-base font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                <HistoryIcon size={18} className="text-blue-500" /> Transaction Ledger
                            </CardTitle>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative grow md:w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search by ID or Method..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setPage(1);
                                        }}
                                        className="h-11 pl-11 rounded-xl bg-white border-slate-200 focus:border-emerald-500 focus-visible:ring-0 text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Date & Time</th>
                                        <th className="px-6 py-4">Method</th>
                                        <th className="px-6 py-4 text-right">Amount (৳)</th>
                                        <th className="px-8 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="px-6 py-5"><Skeleton className="h-4 w-32" /></td>
                                                <td className="px-6 py-5"><Skeleton className="h-4 w-20" /></td>
                                                <td className="px-6 py-5"><Skeleton className="h-4 w-16 ml-auto" /></td>
                                                <td className="px-8 py-5"><Skeleton className="h-8 w-24 mx-auto rounded-md" /></td>
                                            </tr>
                                        ))
                                    ) : statements.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center text-slate-400 font-medium">
                                                No transactions found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        statements.map((stmt: Transaction) => (
                                            <tr key={stmt.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-700">
                                                            {new Date(stmt.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-slate-400">
                                                            {new Date(stmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`text-sm font-black uppercase ${stmt.method === 'bKash' ? 'text-[#D12053]' : 'text-[#ED1C24]'}`}>
                                                        {stmt.method}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-800">৳{stmt.amount}</span>
                                                        <span className="text-[10px] font-bold text-slate-400">Fee: ৳{stmt.fee || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <StatusBadge status={stmt.status} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* --- PAGINATION --- */}
                        {!isLoading && statements.length > 0 && (
                            <div className="border-t border-slate-50 px-8 py-4 flex items-center justify-between bg-slate-50/30">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Page {page} of {meta.lastPage}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="rounded-lg h-9 border-slate-200 px-3 gap-1 font-bold text-xs"
                                    >
                                        <ChevronLeft size={14} /> Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={page >= meta.lastPage}
                                        className="rounded-lg h-9 border-slate-200 px-3 gap-1 font-bold text-xs"
                                    >
                                        Next <ChevronRight size={14} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}