"use client"

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  UserMinus, 
  ShieldAlert, 
  Mail, 
  TrendingUp, 
  CircleDollarSign,
  Calendar,
  ExternalLink,
  Ban,
  CheckCircle2,
  ChevronRight,
  Download,
  Users
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from 'next/link';

// --- MOCK DATA ---
const freelancers = [
    { id: "W-7701", name: "mdjubairrahman", email: "jubair.dev@email.com", balance: "1,250.00", earned: "14,200", successRate: 98, joined: "Oct 2024", status: "Active" },
    { id: "W-7702", name: "emonbhuiyan", email: "emon.pro@email.com", balance: "420.50", earned: "8,500", successRate: 92, joined: "Sep 2024", status: "Active" },
    { id: "W-7685", name: "biplob_2004", email: "biplob@domain.com", balance: "0.00", earned: "21,000", successRate: 99, joined: "Jan 2024", status: "Banned" },
    { id: "W-7650", name: "Joynul_dev", email: "joynul.auth@email.com", balance: "85.00", earned: "1,200", successRate: 45, joined: "Nov 2024", status: "Warning" },
];

export default function AdminFreelancerList() {
  const [filter, setFilter] = useState("All");

  const handleAction = (name: string, action: string) => {
    toast.info(`User ${name} ${action}`, {
        description: `Account has been updated in the database.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* --- HEADER & OVERVIEW --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Freelancer Directory</h1>
                <p className="text-slate-500 font-medium text-sm">Monitor worker performance and manage account access</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricBox label="Total Workers" val="12,402" icon={<Users className="text-blue-500" />} />
                <MetricBox label="Avg. Success" val="94.2%" icon={<TrendingUp className="text-emerald-500" />} />
                <MetricBox label="Active Today" val="1,105" icon={<CheckCircle2 className="text-amber-500" />} className="hidden md:flex" />
            </div>
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {["All", "Active", "Warning", "Banned"].map((tab) => (
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
                    <div className="relative grow md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input placeholder="Search name, ID or email..." className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500" />
                    </div>
                    <Button variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-600 font-bold px-4">
                        <Download size={18} />
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* --- USER TABLE --- */}
        <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Freelancer Profile</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financials</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {freelancers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                                {/* Column 1: Profile */}
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-11 w-11 border-2 border-slate-100 shadow-sm">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                            <AvatarFallback className="bg-slate-100 font-bold text-slate-400 text-xs">{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 leading-none mb-1">{user.name}</p>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{user.id} • Joined {user.joined}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Column 2: Financials */}
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-emerald-600 tracking-tighter">৳{user.balance}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">৳{user.earned} Lifetime</p>
                                    </div>
                                </td>

                                {/* Column 3: Performance */}
                                <td className="px-8 py-6 min-w-45">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                            <span className="text-slate-400">Success Rate</span>
                                            <span className={user.successRate > 90 ? 'text-emerald-500' : 'text-amber-500'}>{user.successRate}%</span>
                                        </div>
                                        <Progress 
                                            value={user.successRate} 
                                            className={`h-1.5 bg-slate-100 [&>div]:${user.successRate > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                        />
                                    </div>
                                </td>

                                {/* Column 4: Status */}
                                <td className="px-8 py-6 text-center">
                                    <StatusBadge status={user.status} />
                                </td>

                                {/* Column 5: Actions */}
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
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
                                                    <Link href="/admin/freelancers/1" className="flex items-center gap-2">
                                                        <ExternalLink size={16} /> View Full Profile
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-3 font-bold text-slate-600 py-3">
                                                    <UserCheck size={16} className="text-emerald-500" /> Verify Documents
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="gap-3 font-bold text-red-500 py-3"
                                                    onClick={() => handleAction(user.name, 'Banned')}
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
            
            <div className="bg-slate-50/50 p-6 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 1-10 of 12,402 Workers</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg font-bold border-slate-200">Previous</Button>
                    <Button variant="outline" size="sm" className="rounded-lg font-bold border-slate-200">Next</Button>
                </div>
            </div>
        </Card>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const MetricBox = ({ label, val, icon, className = "" }: any) => (
    <div className={`bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-[150px] ${className}`}>
        <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">{val}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        Active: "bg-emerald-50 text-emerald-600 border-emerald-100",
        Warning: "bg-amber-50 text-amber-600 border-amber-100",
        Banned: "bg-red-50 text-red-600 border-red-100",
    };
    return (
        <Badge variant="outline" className={`${styles[status]} border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg mx-auto`}>
            {status}
        </Badge>
    );
};