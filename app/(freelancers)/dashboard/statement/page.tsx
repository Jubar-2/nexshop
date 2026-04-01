"use client"

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Filter,
  Calendar,
  Wallet
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

// Mock statement data
const statements = [
    { id: "TX-99827", date: "Oct 24, 2024", time: "10:30 AM", method: "bKash", account: "01728XXXX90", amount: 1000, fee: 50, net: 950, status: "Pending" },
    { id: "TX-99812", date: "Oct 20, 2024", time: "04:15 PM", method: "Nagad", account: "01822XXXX11", amount: 500, fee: 25, net: 475, status: "Approved" },
    { id: "TX-99745", date: "Oct 15, 2024", time: "09:00 AM", method: "bKash", account: "01728XXXX90", amount: 2000, fee: 100, net: 1900, status: "Approved" },
    { id: "TX-99601", date: "Oct 05, 2024", time: "11:45 AM", method: "bKash", account: "01728XXXX90", amount: 1500, fee: 75, net: 1425, status: "Rejected" },
    { id: "TX-99588", date: "Sep 28, 2024", time: "02:20 PM", method: "Nagad", account: "01822XXXX11", amount: 500, fee: 25, net: 475, status: "Approved" },
];

export default function WithdrawStatementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleExport = () => {
    toast.success("Downloading Statement", {
      description: "Your withdrawal history PDF is being generated.",
      icon: <Download className="w-4 h-4 text-emerald-500" />
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* --- TOP NAVIGATION & HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
            <div className="space-y-1">
                <Link href="/wallet" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-bold text-sm group mb-1">
                    <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:bg-emerald-50 transition-colors"><ArrowLeft size={14} /></div>
                    Wallet
                </Link>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Withdrawal Statement</h1>
                <p className="text-slate-500 font-medium text-sm">Full history of your payout transactions</p>
            </div>
            
            <Button onClick={handleExport} className="bg-slate-900 hover:bg-black text-white h-12 rounded-xl font-bold px-6 gap-2 shadow-lg transition-all active:scale-95">
                <Download size={18} /> Export PDF
            </Button>
        </div>

        {/* --- SUMMARY METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard title="Lifetime Payouts" value="৳5,500.00" icon={<FileText />} color="blue" />
            <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex items-center justify-between">
                <div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Success Rate</p>
                    <h2 className="text-2xl font-black text-emerald-600">80%</h2>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><CheckCircle2 size={24} /></div>
            </Card>
            <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex items-center justify-between">
                <div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Total Requests</p>
                    <h2 className="text-2xl font-black text-slate-800">5</h2>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl text-slate-500"><Calendar size={24} /></div>
            </Card>
        </div>

        {/* --- TABLE & FILTER CARD --- */}
        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-base font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                    <HistoryIcon /> Transaction Ledger
                </CardTitle>

                {/* Filter & Search Controls */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative grow md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input 
                            placeholder="Search by ID or Method..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 pl-11 rounded-xl bg-white border-slate-200 focus:border-emerald-500 focus-visible:ring-0 text-sm font-medium"
                        />
                    </div>
                    <Button variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-600 font-bold px-4 gap-2">
                        <Filter size={16} /> Filters
                    </Button>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            
            {/* Desktop Responsive Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                            <th className="px-8 py-4">Ref ID</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Account Details</th>
                            <th className="px-6 py-4 text-right">Amount (৳)</th>
                            <th className="px-8 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {statements.map((stmt) => (
                            <tr key={stmt.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5 text-sm font-black text-slate-800 font-mono">{stmt.id}</td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-700">{stmt.date}</span>
                                        <span className="text-[11px] font-bold text-slate-400">{stmt.time}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-black ${stmt.method === 'bKash' ? 'text-[#D12053]' : 'text-[#ED1C24]'}`}>{stmt.method}</span>
                                        <span className="text-xs font-bold text-slate-500 font-mono">{stmt.account}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-800">৳{stmt.amount}</span>
                                        <span className="text-[10px] font-bold text-slate-400">Fee: ৳{stmt.fee}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex justify-center">
                                        <StatusBadge status={stmt.status} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="border-t border-slate-50 px-8 py-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Showing 5 of 5 statements</span>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled className="rounded-lg h-9 border-slate-200">Previous</Button>
                    <Button variant="outline" size="sm" disabled className="rounded-lg h-9 border-slate-200">Next</Button>
                </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const SummaryCard = ({ title, value, icon, color }: any) => {
    return (
        <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex items-center justify-between">
            <div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">{title}</p>
                <h2 className={`text-2xl font-black ${color === 'blue' ? 'text-blue-600' : 'text-slate-800'}`}>{value}</h2>
            </div>
            <div className={`p-3 rounded-xl ${color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                {icon}
            </div>
        </Card>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const base = "text-[10px] font-black uppercase px-2.5 py-1 rounded-md flex items-center justify-center gap-1.5 w-24";
    if (status === "Approved") return <span className={`${base} bg-emerald-100 text-emerald-700`}><CheckCircle2 size={12} /> Approved</span>;
    if (status === "Pending") return <span className={`${base} bg-amber-100 text-amber-700`}><Clock size={12} /> Pending</span>;
    return <span className={`${base} bg-red-100 text-red-700`}><XCircle size={12} /> Rejected</span>;
};

const HistoryIcon = () => (
    <svg className="text-blue-500 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);