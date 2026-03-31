"use client"

import React, { useState } from 'react';
import { 
  User, Camera, Mail, ShieldCheck, Zap, 
  Phone, MapPin, Share2, Copy, Users, 
  DollarSign, Save, ChevronRight, CheckCircle2,
  Lock
} from 'lucide-react';
import { toast } from "sonner"; // Import Sonner
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const [referLink] = useState("https://nexshop.com/ref/mdjubair77");

  const copyToClipboard = () => {
    const referLink = "https://nexshop.com/ref/mdjubair77";
    navigator.clipboard.writeText(referLink);

    toast.success("Link Copied Successfully", {
        description: "Your referral link is ready to be shared with your network.",
        // Professional Icon Styling
        icon: <div className="bg-emerald-50 p-1.5 rounded-lg mr-2">
                <CheckCircle2 className="text-emerald-500 w-5 h-5" />
              </div>,
        duration: 3000,
        // Optional: Action button like Facebook/Gmail
        action: {
            label: "Undo",
            onClick: () => console.log("Undo logic here"),
        },
    });
};

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* --- SECTION 1: ACCOUNT INFORMATION --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-slate-50 shadow-md">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-3xl font-bold bg-slate-100 text-slate-500">JR</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-all active:scale-90">
                  <Camera size={16} className="text-slate-600" />
                </button>
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">mdjubairrahman</h1>
                  <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold gap-1 px-3 py-1 mx-auto md:mx-0">
                    <CheckCircle2 size={14} /> Verified User
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-x-6 gap-y-1 text-slate-500 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400" /> jubair.dev@email.com</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-blue-500" /> Active Account</span>
                </div>
              </div>
              
              <Button className="bg-[#10B981] hover:bg-[#0da06f] font-bold rounded-xl px-8 h-12 shadow-md transition-all active:scale-95">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* --- SECTION 2: MEMBERSHIP PLAN --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-4">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <Zap className="text-amber-500 fill-amber-500" size={18} /> Active Membership
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-slate-900 text-white shadow-xl">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Tier Level</p>
                <h3 className="text-3xl font-black text-amber-400 italic">Premium Pro</h3>
                <p className="text-slate-300 text-xs font-medium">Your subscription expires in 342 days</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl h-12">
                  Upgrade Plan
                </Button>
                <Button variant="outline" className="border-slate-700 text-white hover:bg-white/10 font-bold rounded-xl h-12">
                  Plan Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- SECTION 3: PROFILE INFORMATION --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 px-8 py-5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <User className="text-blue-500" size={18} /> Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <ProfileInput label="Phone Number" value="+880 1700-000000" />
              <ProfileInput label="Country" value="Bangladesh" />
              <ProfileInput label="Division" value="Dhaka" />
              <ProfileInput label="District" value="Dhaka North" />
              <ProfileInput label="Sub-District" value="Uttara" />
              <ProfileInput label="Postal Code" value="1230" />
              <div className="md:col-span-2">
                <ProfileInput label="Address Line 1" value="Sector 10, Road 05, House 22" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- SECTION 4: REFER & EARN --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 px-8 py-5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <Share2 className="text-emerald-500" size={18} /> Partner Referral
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Copy Invitation Link</Label>
              <div className="flex gap-3">
                <div className="flex-grow bg-slate-50 border-2 border-slate-100 rounded-xl px-5 flex items-center font-mono text-sm text-slate-500 overflow-hidden truncate">
                  {referLink}
                </div>
                <Button onClick={copyToClipboard} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2 font-bold px-8 h-12 shadow-sm transition-all active:scale-95">
                  <Copy size={18} /> Copy Link
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-5">
                <div className="p-3.5 bg-white text-blue-600 rounded-xl shadow-sm"><Users size={28} /></div>
                <div>
                  <p className="text-3xl font-black text-slate-900">42</p>
                  <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest">Active Referrals</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-5">
                <div className="p-3.5 bg-white text-emerald-600 rounded-xl shadow-sm"><DollarSign size={28} /></div>
                <div>
                  <p className="text-3xl font-black text-emerald-700">৳2,100.00</p>
                  <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest">Bonus Balance</p>
                </div>
              </div>
            </div>

            {/* How to earn */}
            <div className="bg-slate-50/80 rounded-2xl p-7 border border-slate-100">
               <h4 className="font-bold text-slate-800 mb-5 text-sm flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-emerald-500" /> Earning Logic:
               </h4>
               <div className="space-y-5">
                  <BenefitItem num="1" text="Friends join via your unique referral link." />
                  <BenefitItem num="2" text="Receive ৳50.00 bonus on their first withdrawal." />
                  <BenefitItem num="3" text="Earn 10% from their lifetime task commissions." />
               </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

// --- Reusable Sub-Components ---

const ProfileInput = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-2">
    <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.15em] ml-1">
      {label}
    </Label>
    <Input 
      defaultValue={value}
      className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-semibold text-slate-700 bg-white shadow-sm transition-all"
    />
  </div>
);

const BenefitItem = ({ num, text }: { num: string, text: string }) => (
    <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
        <span className="w-6 h-6 flex-shrink-0 bg-white rounded-lg flex items-center justify-center font-black text-slate-900 shadow-sm border border-slate-100 text-xs">
            {num}
        </span>
        {text}
    </div>
);

export default Profile;