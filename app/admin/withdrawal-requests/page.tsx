"use client"

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Wallet, 
  ArrowUpRight,
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  Ban
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- MOCK DATA ---
const withdrawalRequests = [
    { id: "TX-9901", user: "mdjubairrahman", amount: "1,200.00", method: "bKash", number: "01728XXXX90", date: "2 mins ago", status: "Pending" },
    { id: "TX-9902", user: "emonbhuiyan", amount: "550.00", method: "Nagad", number: "01811XXXX12", date: "15 mins ago", status: "Pending" },
    { id: "TX-9895", user: "biplob_2004", amount: "2,100.00", method: "bKash", number: "01922XXXX45", date: "2 hours ago", status: "Approved" },
    { id: "TX-9890", user: "Joynul_dev", amount: "800.00", method: "Nagad", number: "01600XXXX88", date: "5 hours ago", status: "Rejected" },
    { id: "TX-9888", user: "munna14447", amount: "3,500.00", method: "bKash", number: "01311XXXX00", date: "Yesterday", status: "Approved" },
];

export default function AdminWithdrawals() {
  const [filter, setFilter] = useState("All");

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    toast.success(`Request ${id} ${action}d`, {
        description: `User will be notified immediately via email and dashboard.`,
        icon: action === 'Approve' ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        
        {/* --- PAGE HEADER & QUICK STATS --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Withdrawal Requests</h1>
                <p className="text-slate-500 font-medium text-sm">Review and process user payout applications</p>
            </div>
            
            <div className="flex gap-4">
                <AdminSummaryCard label="Pending" val="12" color="amber" icon={<Clock size={16}/>} />
                <AdminSummaryCard label="Paid Today" val="৳14,500" color="emerald" icon={<CheckCircle2 size={16}/>} />
            </div>
        </div>

        {/* --- FILTERS & SEARCH --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input placeholder="Search user or TXID..." className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500" />
                    </div>
                    <Button variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold">
                        <Download size={18} /> Export
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* --- REQUESTS LIST (Desktop Table / Mobile Cards) --- */}
        <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User / ID</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {withdrawalRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                                            <AvatarFallback className="bg-slate-100 font-black text-slate-400 text-xs">{req.user[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 leading-none mb-1">{req.user}</p>
                                            <p className="text-[10px] font-bold text-blue-500 font-mono tracking-tighter uppercase">{req.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-black italic tracking-tighter ${req.method === 'bKash' ? 'text-[#D12053]' : 'text-[#ED1C24]'}`}>
                                            {req.method}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-500">{req.number}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-lg font-black text-slate-900 tracking-tighter">৳{req.amount}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-xs font-bold text-slate-400 uppercase">{req.date}</span>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <StatusBadge status={req.status} />
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {req.status === 'Pending' ? (
                                            <>
                                                <Button 
                                                    onClick={() => handleAction(req.id, 'Approve')}
                                                    size="sm" 
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-9 rounded-xl shadow-sm"
                                                >
                                                    Approve
                                                </Button>
                                                <Button 
                                                    onClick={() => handleAction(req.id, 'Reject')}
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="text-red-500 hover:bg-red-50 font-bold h-9 rounded-xl"
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        ) : (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:bg-white border-transparent">
                                                        <MoreHorizontal size={20} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl font-poppins">
                                                    <DropdownMenuItem className="gap-2 font-bold text-slate-600">
                                                        <ExternalLink size={16} /> View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 font-bold text-slate-600">
                                                        <ShieldCheck size={16} /> Mark Fraud
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const AdminSummaryCard = ({ label, val, color, icon }: any) => {
    const colors: any = {
        emerald: "text-emerald-600 bg-emerald-50",
        amber: "text-amber-600 bg-amber-50"
    };
    return (
        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm flex items-center gap-4 min-w-[160px] border border-slate-100">
            <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className={`text-lg font-black tracking-tighter leading-none ${colors[color].split(' ')[0]}`}>{val}</p>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
        Pending: "bg-amber-50 text-amber-700 border-amber-100",
        Rejected: "bg-red-50 text-red-700 border-red-100",
    };
    return (
        <Badge variant="outline" className={`${styles[status]} border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg mx-auto`}>
            {status}
        </Badge>
    );
};