"use client"

import React, { useState } from 'react';
import { 
  History, 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle,  
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- MOCK DATA ---
const submissionHistory = [
    { id: "S1", title: "Like & Comment YouTube Video", category: "YouTube", date: "Oct 24, 2024", reward: "৳15.00", status: "Approved" },
    { id: "S2", title: "Follow Facebook Page", category: "Facebook", date: "Oct 23, 2024", reward: "৳8.50", status: "Pending" },
    { id: "S3", title: "Instagram Story View", category: "Instagram", date: "Oct 22, 2024", reward: "৳5.00", status: "Rejected" },
];

const withdrawalHistory = [
    { id: "W1", method: "bKash", type: "Personal", date: "Oct 20, 2024", amount: "৳1,200.00", status: "Completed" },
    { id: "W2", method: "Nagad", type: "Personal", date: "Oct 15, 2024", amount: "৳550.00", status: "Completed" },
    { id: "W3", method: "bKash", type: "Personal", date: "Just now", amount: "৳950.00", status: "Pending" },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Activity Hub</h1>
                <p className="text-slate-500 font-medium text-sm">Track your task progress and financial history</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-xl border-slate-200 bg-white h-11 px-4 font-bold text-slate-600 gap-2 shadow-sm">
                    <Calendar size={18} /> Last 30 Days
                </Button>
            </div>
        </div>

        {/* --- MAIN TABS SECTION --- */}
        <Tabs defaultValue="submissions" className="w-full space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <TabsList className="bg-slate-200/50 p-1 rounded-2xl h-14 md:w-[400px]">
                <TabsTrigger value="submissions" className="rounded-xl h-12 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md">
                    <History className="mr-2" size={16} /> Submissions
                </TabsTrigger>
                <TabsTrigger value="withdrawals" className="rounded-xl h-12 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md">
                    <FileText className="mr-2" size={16} /> Withdrawals
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input placeholder="Search records..." className="h-12 pl-10 rounded-2xl bg-white border-none shadow-sm focus-visible:ring-emerald-500" />
              </div>
          </div>

          {/* --- SUBMISSIONS CONTENT --- */}
          <TabsContent value="submissions" className="space-y-4">
            {submissionHistory.map((item) => (
                <HistoryCard key={item.id}>
                    <div className="flex items-center gap-5">
                        <CategoryIcon category={item.category} />
                        <div className="flex-grow">
                            <h4 className="text-sm font-black text-slate-800 leading-none mb-1">{item.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date} • {item.id}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <span className="text-lg font-black text-slate-800 tracking-tighter">{item.reward}</span>
                            <StatusBadge status={item.status} />
                        </div>
                    </div>
                </HistoryCard>
            ))}
          </TabsContent>

          {/* --- WITHDRAWALS CONTENT --- */}
          <TabsContent value="withdrawals" className="space-y-4">
             {withdrawalHistory.map((item) => (
                <HistoryCard key={item.id}>
                    <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${item.status === 'Pending' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                            {item.status === 'Pending' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                        </div>
                        <div className="flex-grow">
                            <h4 className="text-sm font-black text-slate-800 leading-none mb-1">{item.method} Payout</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date} • {item.type}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <span className="text-lg font-black text-slate-900 tracking-tighter">{item.amount}</span>
                            <StatusBadge status={item.status === 'Completed' ? 'Approved' : 'Pending'} />
                        </div>
                    </div>
                </HistoryCard>
             ))}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const HistoryCard = ({ children }: { children: React.ReactNode }) => (
    <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group">
        <CardContent className="p-6">
            {children}
        </CardContent>
    </Card>
);

const CategoryIcon = ({ category }: { category: string }) => {
    const icons: any = {
        YouTube: <Clock className="text-red-600" size={24} />,
        Facebook: <Clock className="text-blue-600" size={24} />,
        Instagram: <Clock className="text-pink-600" size={24} />,
    };
    return (
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            {icons[category] || <History size={24} />}
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
        Pending: "bg-amber-50 text-amber-700 border-amber-100",
        Rejected: "bg-red-50 text-red-700 border-red-100",
    };
    const Icon: any = {
        Approved: CheckCircle2,
        Pending: Clock,
        Rejected: XCircle,
    };
    const CurrentIcon = Icon[status];

    return (
        <Badge variant="outline" className={`${styles[status]} font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1.5`}>
            <CurrentIcon size={12} /> {status}
        </Badge>
    );
};