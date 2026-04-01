"use client"

import React, { useState } from 'react';
import { 
  Search, Plus, Filter, MoreHorizontal, 
  Globe,
  TrendingUp, BarChart3, Clock, CheckCircle2,
  AlertCircle, PauseCircle, PlayCircle, Edit3, 
  Trash2, ExternalLink, CircleDollarSign
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from 'next/link';

// Brand SVGs
const BrandIcons = {
  YouTube: <Clock className="text-[#FF0000]" size={18} />,
  Facebook: <Clock className="text-[#1877F2]" size={18} />,
  Instagram: <Clock className="text-[#E4405F]" size={18} />,
  Others: <Globe className="text-slate-400" size={18} />
};

// --- MOCK DATA ---
const adminJobs = [
    { id: "J-8821", title: "Watch YouTube Video (5m)", category: "YouTube", reward: 15.00, slots: 142, total: 200, status: "Live", date: "Oct 24", spend: 2130 },
    { id: "J-8820", title: "Follow NexShop FB Page", category: "Facebook", reward: 8.50, slots: 50, total: 50, status: "Completed", date: "Oct 23", spend: 425 },
    { id: "J-8815", title: "Instagram Profile Follow", category: "Instagram", reward: 5.00, slots: 12, total: 500, status: "Paused", date: "Oct 22", spend: 60 },
    { id: "J-8810", title: "Join Discord Server", category: "Others", reward: 10.00, slots: 89, total: 100, status: "Live", date: "Oct 21", spend: 890 },
];

export default function AdminJobList() {
  const [filter, setFilter] = useState("All");

  const toggleStatus = (id: string, current: string) => {
    toast.info(`Job ${id} ${current === 'Live' ? 'Paused' : 'Resumed'}`, {
        icon: current === 'Live' ? <PauseCircle /> : <PlayCircle />
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Micro-Jobs</h1>
                <p className="text-slate-500 font-medium text-sm italic">Monitor performance and campaign lifecycles</p>
            </div>
            <Link href="/admin/jobs/create">
                <Button className="bg-slate-900 hover:bg-black text-white font-black h-12 px-8 rounded-xl shadow-lg flex gap-2 transition-all active:scale-95">
                    <Plus size={20} /> Create New Job
                </Button>
            </Link>
        </div>

        {/* --- PERFORMANCE SNAPSHOT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard label="Active Campaigns" val="142" icon={<TrendingUp className="text-emerald-500" />} />
            <MetricCard label="Total Budget Spend" val="৳84,200" icon={<CircleDollarSign className="text-blue-500" />} />
            <MetricCard label="Avg. Approval Rate" val="94.8%" icon={<CheckCircle2 className="text-amber-500" />} />
        </div>

        {/* --- TOOLBAR --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
                    {["All", "Live", "Paused", "Completed"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative grow lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input placeholder="Search job title or ID..." className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500" />
                    </div>
                    <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 text-slate-500"><Filter size={18} /></Button>
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
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total Spend</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {adminJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                            {(BrandIcons as any)[job.category]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 leading-none mb-1">{job.title}</p>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{job.id} • {job.date}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 min-w-[200px]">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                            <span>{Math.round((job.slots/job.total)*100)}% Complete</span>
                                            <span>{job.slots}/{job.total}</span>
                                        </div>
                                        <Progress value={(job.slots/job.total)*100} className="h-1.5 bg-slate-100 [&>div]:bg-blue-500" />
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className="text-sm font-black text-slate-700 tracking-tighter">৳{job.reward.toFixed(2)}</span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className="text-sm font-black text-emerald-600 tracking-tighter">৳{job.spend.toLocaleString()}</span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <StatusBadge status={job.status} />
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => toggleStatus(job.id, job.status)}
                                            className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-500"
                                        >
                                            {job.status === 'Live' ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400">
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl font-poppins">
                                                <DropdownMenuItem className="gap-2 font-bold text-slate-600"><Edit3 size={14}/> Edit Campaign</DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 font-bold text-slate-600"><BarChart3 size={14}/> View Analytics</DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 font-bold text-red-500"><Trash2 size={14}/> Delete Job</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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

const MetricCard = ({ label, val, icon }: any) => (
    <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex items-center justify-between">
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{val}</h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
    </Card>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        Live: "bg-emerald-50 text-emerald-600",
        Paused: "bg-amber-50 text-amber-600",
        Completed: "bg-blue-50 text-blue-600",
    };
    return (
        <Badge variant="outline" className={`${styles[status]} border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg mx-auto`}>
            {status}
        </Badge>
    );
};