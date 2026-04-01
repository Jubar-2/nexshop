"use client"

import React from 'react';
import { 
  Wallet, Clock, TrendingUp, CheckCircle2, XCircle, 
  Briefcase, Search, Trophy, Medal, ExternalLink,
  ArrowUpRight, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfessionalDashboard = () => {
  return (
    <div className="p-4 md:p-8 bg-[#F0F2F5] min-h-screen font-poppins mt-14">
      
      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Earnings</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your balance and track performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-11 px-6 font-bold shadow-sm">
            View Statement
          </Button>
          <Button className="bg-[#10B981] hover:bg-[#0da06f] text-white rounded-xl h-11 px-6 font-bold shadow-md flex gap-2 transition-all active:scale-95">
            <ExternalLink size={18} />
            Withdraw
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Available Balance" 
            value="$0.00" 
            icon={<Wallet />} 
            color="emerald" 
            trend="+2.5% from last week"
          />
          <StatCard 
            title="Pending Earnings" 
            value="$0.00" 
            icon={<Clock />} 
            color="amber" 
            trend="Awaiting review"
          />
          <StatCard 
            title="Total Earned" 
            value="$0.00" 
            icon={<TrendingUp />} 
            color="blue" 
            trend="Lifetime earnings"
          />
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Submissions Card */}
          <Card className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="text-lg font-bold text-slate-800">My Submissions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-2">
              <StatusRow icon={<Clock className="text-amber-500" />} label="Pending Review" count={0} bg="bg-amber-50" />
              <StatusRow icon={<CheckCircle2 className="text-emerald-500" />} label="Approved" count={0} bg="bg-emerald-50" />
              <StatusRow icon={<XCircle className="text-red-500" />} label="Rejected" count={0} bg="bg-red-50" />
            </CardContent>
            <CardFooter className="bg-slate-50/50 mt-4">
              <Button variant="ghost" className="w-full text-emerald-600 font-bold hover:bg-emerald-50 transition-colors">
                View All History
              </Button>
            </CardFooter>
          </Card>

          {/* Job Finder Card */}
          <Card className="bg-white border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-emerald-500 text-white border-none rounded-lg px-3 py-1 font-bold">16 ACTIVE</Badge>
            </div>
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
              <Briefcase className="text-blue-600" size={40} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-2">16</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">High-paying jobs are currently<br/>available for your profile.</p>
            <Button className="w-full bg-[#10B981] hover:bg-[#0da06f] text-white rounded-xl h-14 font-black text-lg gap-3 shadow-lg">
              <Search size={20} />
              Browse All Jobs
            </Button>
          </Card>

          {/* Referrers Leaderboard */}
          <Card className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
              <CardTitle className="text-lg font-bold text-slate-800">Top Referrers</CardTitle>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wider">Yearly</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {[
                  { rank: 1, name: 'atb', count: 61, isTop: true },
                  { rank: 2, name: 'emonbhuiyan', count: 32, isTop: true },
                  { rank: 3, name: 'biplob_2004', count: 15, isTop: true },
                  { rank: 4, name: 'Joynul', count: 8 },
                  { rank: 5, name: 'munna14447', count: 5 }
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-6 text-center font-bold text-slate-400 text-sm">
                        {user.rank <= 3 ? <Trophy size={16} className={i === 0 ? "text-amber-400" : i === 1 ? "text-slate-400" : "text-amber-700"} /> : user.rank}
                      </div>
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-slate-200 text-slate-600 font-bold uppercase text-xs">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-slate-700 text-sm">{user.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-600 font-black text-sm">{user.count}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Referrals</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS FOR CLEANER CODE ---

const StatCard = ({ title, value, icon, color, trend }: any) => {
  const colorMap: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };
  
  return (
    <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{title}</p>
          <h2 className={`text-3xl font-black ${colorMap[color].split(' ')[1]}`}>{value}</h2>
        </div>
        <div className={`p-3 rounded-2xl ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]}`}>
          {React.cloneElement(icon, { size: 28 })}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-slate-400 border-t border-slate-50 pt-4">
        <ArrowUpRight size={14} className="text-emerald-500" />
        {trend}
      </div>
    </Card>
  );
};

const StatusRow = ({ icon, label, count, bg }: { icon: React.ReactNode; label: string; count: number; bg: string }) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${bg}`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <span className="font-bold text-slate-600 text-sm">{label}</span>
    </div>
    <div className="bg-slate-100 text-slate-600 font-black text-xs px-3 py-1 rounded-full group-hover:bg-white transition-colors">
      {count}
    </div>
  </div>
);

export default ProfessionalDashboard;