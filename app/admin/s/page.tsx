"use client"

import React, { useState } from 'react';
import { 
  Settings2, 
  Dices, 
  Users2, 
  Wallet2, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  Save,
  ArrowUpRight,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] p-6 md:p-12 font-poppins">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Configuration</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.15em] mt-1">Manage Rewards & Payout Rules</p>
          </div>
          <div className="h-14 w-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
            <Settings2 className="text-orange-600" size={28} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT: FEATURE TOGGLES --- */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Feature Toggles</h2>
            
            <FeatureCard 
              title="Lucky Spin" 
              desc="Enable daily spin rewards for active users."
              icon={<Dices size={22} />}
              defaultChecked={true}
            />

            <div className="bg-orange-600 rounded-4xl p-8 text-white shadow-xl shadow-orange-200 relative overflow-hidden">
               <TrendingUp className="absolute -right-4 -bottom-4 opacity-10" size={120} />
               <h4 className="text-lg font-black leading-tight mb-2">Pro-Tip</h4>
               <p className="text-xs font-medium text-orange-50/80 leading-relaxed">
                 Increasing Referral Gen 1 commission usually drives 40% higher user acquisition.
               </p>
            </div>
          </div>

          {/* --- RIGHT: FINANCIAL & REFERRAL SETTINGS --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Financial Limits */}
            <section className="space-y-4">
               <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Withdrawal Parameters</h2>
               <Card className="border-none rounded-4xl shadow-sm overflow-hidden">
                 <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Withdrawal Fee</Label>
                       <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">৳</span>
                          <Input className="h-14 pl-10 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:border-orange-500 transition-all font-black text-lg" defaultValue="5.00" />
                       </div>
                       <p className="text-[9px] text-slate-400 font-bold italic">* Fixed amount charged per request</p>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Min. Withdrawal Limit</Label>
                       <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">৳</span>
                          <Input className="h-14 pl-10 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:border-orange-500 transition-all font-black text-lg" defaultValue="500.00" />
                       </div>
                    </div>
                 </CardContent>
               </Card>
            </section>

            {/* Referral Generations */}
            <section className="space-y-4">
               <div className="flex items-center justify-between px-1">
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">3-Tier Referral System</h2>
                 <Badge className="bg-blue-50 text-blue-600 border-none rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest">Active System</Badge>
               </div>
               
               <Card className="border-none rounded-4xl shadow-sm overflow-hidden">
                 <CardContent className="p-8 space-y-6">
                    <ReferralInput label="Generation 1" sub="Direct Referral" color="orange" defaultValue="10" />
                    <ReferralInput label="Generation 2" sub="Indirect (Level 2)" color="blue" defaultValue="5" />
                    <ReferralInput label="Generation 3" sub="Indirect (Level 3)" color="purple" defaultValue="2" />
                 </CardContent>
               </Card>
            </section>

          </div>
        </div>

        {/* --- BOTTOM SAVE BAR --- */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-300">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-900/20">
                <ShieldCheck size={28} />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-black text-white leading-none mb-1">Security Authentication</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified by Admin Root</p>
              </div>
           </div>
           <Button className="w-full md:w-auto min-w-60 h-16 bg-white hover:bg-orange-50 text-slate-900 rounded-2xl font-black text-xl flex gap-3 shadow-xl transition-all active:scale-95">
             <Save size={24} className="text-orange-600" /> Save Config
           </Button>
        </div>

      </div>
    </div>
  );
}

/**
 * FEATURE TOGGLE COMPONENT
 */
function FeatureCard({ title, desc, icon, defaultChecked }: any) {
  const [enabled, setEnabled] = useState(defaultChecked);
  return (
    <Card className={`border-none rounded-4xl transition-all duration-500 ${enabled ? 'bg-white shadow-sm' : 'bg-slate-100 opacity-60'}`}>
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
           <div className={`p-4 rounded-2xl ${enabled ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}>
             {icon}
           </div>
           <Switch checked={enabled} onCheckedChange={setEnabled} className="scale-125 data-[state=checked]:bg-orange-600" />
        </div>
        <h3 className="font-black text-slate-800 text-xl tracking-tight mb-1">{title}</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}

/**
 * REFERRAL INPUT COMPONENT
 */
function ReferralInput({ label, sub, color, defaultValue }: any) {
  const colors: any = {
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50"
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
       <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl ${colors[color]}`}>
          {label.split(' ')[1]}
       </div>
       <div className="grow">
          <h4 className="font-black text-slate-800 text-base leading-none mb-1">{label}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
       </div>
       <div className="relative w-full md:w-32">
          <Input className="h-12 pr-10 rounded-xl border-slate-200 bg-white font-black text-right" defaultValue={defaultValue} />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm">%</span>
       </div>
    </div>
  );
}