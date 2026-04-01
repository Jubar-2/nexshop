"use client"

import React from 'react';
import { 
  ArrowLeft, Mail, Ban, UserCheck, ShieldAlert, 
  MapPin, Phone, Calendar, Globe, CircleDollarSign,
  TrendingUp, CheckCircle2, XCircle, Clock,
  MoreHorizontal, MessageSquare, ExternalLink,
  Zap, FileText, Fingerprint,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, Tooltip, XAxis 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';

// Mock data for earning history
const performanceData = [
  { day: 'Mon', jobs: 12 }, { day: 'Tue', jobs: 18 },
  { day: 'Wed', jobs: 15 }, { day: 'Thu', jobs: 25 },
  { day: 'Fri', jobs: 22 }, { day: 'Sat', jobs: 30 },
  { day: 'Sun', jobs: 28 },
];

export default function AdminViewFreelancer() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        
        {/* --- TOP BREADCRUMB & PRIMARY ACTIONS --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
            <Link href="/admin/freelancers" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors">
                <ArrowLeft size={14} /> Back to Directory
            </Link>
            <div className="flex gap-2">
                <Button variant="outline" className="bg-white border-slate-200 text-slate-600 font-bold rounded-xl px-6 h-11">
                    <MessageSquare size={18} className="mr-2" /> Message
                </Button>
                <Button className="bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl px-6 h-11 border-none shadow-none">
                    <Ban size={18} className="mr-2" /> Ban User
                </Button>
                <Button className="bg-[#10B981] hover:bg-[#0da06f] text-white font-black rounded-xl px-8 h-11 shadow-lg">
                    <UserCheck size={18} className="mr-2" /> Verify Account
                </Button>
            </div>
        </div>

        {/* --- PROFILE HEADER CARD --- */}
        <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Avatar className="h-32 w-32 border-4 border-slate-50 shadow-md">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jubair" />
                <AvatarFallback className="text-3xl font-bold bg-slate-100 text-slate-400">JR</AvatarFallback>
              </Avatar>
              
              <div className="grow text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">mdjubairrahman</h1>
                  <Badge className="bg-blue-100 text-blue-700 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                    Top Rated Worker
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-slate-400 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><Mail size={16} /> jubair.dev@email.com</span>
                  <span className="flex items-center gap-1.5"><Calendar size={16} /> Joined Oct 24, 2024</span>
                  <span className="flex items-center gap-1.5 font-bold text-emerald-500 uppercase text-[10px] tracking-widest"><CheckCircle2 size={16} /> Identity Verified</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3">
                  <div className="text-center md:text-right bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Available Balance</p>
                      <h4 className="text-2xl font-black text-emerald-600">৳1,250.00</h4>
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- PERFORMANCE & ANALYTICS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Identity & Contact */}
            <div className="space-y-6">
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-slate-50 px-8 py-5">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-800">Identity Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <InfoItem icon={<Phone size={18}/>} label="Phone" val="+880 1712-345678" />
                        <InfoItem icon={<Globe size={18}/>} label="Country" val="Bangladesh" />
                        <InfoItem icon={<MapPin size={18}/>} label="Division" val="Dhaka" />
                        <InfoItem icon={<ShieldAlert size={18}/>} label="Last IP" val="103.114.172.5" />
                        <InfoItem icon={<Fingerprint size={18}/>} label="Device" val="Chrome / Windows 11" />
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white border-none shadow-xl rounded-2xl p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase">Trust Score</span>
                            <span className="text-xl font-black text-emerald-400">98%</span>
                        </div>
                        <Progress value={98} className="h-1.5 bg-slate-800 [&>div]:bg-emerald-400" />
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase italic">
                            This worker is in the top 2% of the platform with 0 reported violations.
                        </p>
                    </div>
                </Card>
            </div>

            {/* Right: Work History & Charts */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-slate-50 px-8 py-5 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-800">Performance Index</CardTitle>
                        <Badge variant="outline" className="border-slate-100 text-slate-400 text-[10px]">LAST 7 DAYS</Badge>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <StatMini label="Completed" val="142" icon={<CheckCircle2 className="text-emerald-500"/>} />
                            <StatMini label="Rejected" val="2" icon={<XCircle className="text-red-500"/>} />
                            <StatMini label="Pending" val="5" icon={<Clock className="text-amber-500"/>} />
                            <StatMini label="Lifetime" val="৳14.2k" icon={<CircleDollarSign className="text-blue-500"/>} />
                        </div>
                        
                        <div className="h-62.5 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} />
                                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                    <Area type="monotone" dataKey="jobs" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Submissions */}
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-slate-50 px-8 py-5">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-800">Recent Proofs</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            <RecentWorkRow title="YouTube Like & Sub" date="10m ago" reward="৳15.00" status="Pending" />
                            <RecentWorkRow title="FB Page Follow" date="1h ago" reward="৳8.50" status="Approved" />
                            <RecentWorkRow title="Instagram View" date="Yesterday" reward="৳5.00" status="Approved" />
                        </div>
                        <Button variant="ghost" className="w-full h-12 rounded-none text-xs font-bold text-blue-500 hover:bg-blue-50/50 uppercase tracking-widest">
                            View all 142 Submissions <ChevronRight size={14} className="ml-1" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const InfoItem = ({ icon, label, val }: any) => (
    <div className="flex items-center gap-4">
        <div className="text-slate-300">{icon}</div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-700 truncate">{val}</p>
        </div>
    </div>
);

const StatMini = ({ label, val, icon }: any) => (
    <div className="space-y-1">
        <div className="flex items-center gap-2 text-slate-400">
            {icon}
            <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
        </div>
        <h3 className="text-xl font-black text-slate-800">{val}</h3>
    </div>
);

const RecentWorkRow = ({ title, date, reward, status }: any) => (
    <div className="px-8 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer group">
        <div>
            <h5 className="text-sm font-bold text-slate-700 leading-tight mb-1">{title}</h5>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{date}</p>
        </div>
        <div className="text-right">
            <p className="text-sm font-black text-slate-800">{reward}</p>
            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
                {status}
            </span>
        </div>
    </div>
);