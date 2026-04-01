"use client"

import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  Key, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  ArrowRight,
  Fingerprint,
  ChevronRight
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [showPass, setShowPass] = useState(false);

  const handleUpdate = (type: string) => {
    toast.success(`${type} Updated Successfully`, {
      description: `Your ${type.toLowerCase()} has been modified for your security.`,
      icon: <div className="bg-emerald-50 p-1.5 rounded-lg"><ShieldCheck className="text-emerald-500 w-4 h-4" /></div>
    });
  };

  const handleForgot = () => {
    toast.info("Recovery Email Sent", {
      description: "Check your inbox for the password reset instructions.",
      icon: <Mail className="text-blue-500 w-4 h-4" />
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      {/* max-w-4xl used here to match your Profile Page exactly */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* --- PAGE HEADER --- */}
        <div className="px-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
            <p className="text-slate-500 font-medium text-sm">Security and account preference management</p>
        </div>

        {/* --- SECTION 1: EMAIL SETTINGS --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <Mail className="text-blue-500" size={18} /> Account Email
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Current Email</Label>
                        <div className="h-12 flex items-center px-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 font-bold text-sm italic">
                            jubair.dev@email.com
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">New Email Address</Label>
                        <Input type="email" placeholder="example@nexshop.com" className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-semibold" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3">
                        <p className="text-[11px] font-bold text-blue-800 uppercase tracking-tight">Security Check</p>
                        <p className="text-xs text-blue-600 leading-relaxed">To change your primary email, you must verify your identity by entering your current password.</p>
                        <Input type="password" placeholder="Current Password" className="h-10 rounded-lg bg-white border-blue-200 focus:border-blue-400" />
                    </div>
                    <Button onClick={() => handleUpdate('Email')} className="w-full bg-slate-900 hover:bg-black text-white font-black rounded-xl h-12 shadow-lg">
                        Update Email Address
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* --- SECTION 2: PASSWORD SETTINGS --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <Lock className="text-emerald-500" size={18} /> Password & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Current Password</Label>
                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-200" />
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-2 uppercase tracking-tight">
                            <Fingerprint size={14} className="text-emerald-500" /> Security Tip
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                            Use a unique password you haven't used on other sites to keep your NexShop account royalty-safe.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2 relative">
                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">New Password</Label>
                        <Input type={showPass ? "text" : "password"} className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0" />
                        <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-9 text-slate-400 hover:text-slate-600 transition-colors">
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Confirm New Password</Label>
                        <Input type={showPass ? "text" : "password"} className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0" />
                    </div>
                    <Button onClick={() => handleUpdate('Password')} className="w-full bg-[#10B981] hover:bg-[#0da06f] text-white font-black rounded-xl h-12 shadow-lg active:scale-95 transition-all">
                        Change Password
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* --- SECTION 3: RECOVERY (Forgot Password) --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center md:text-left">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-sm border border-blue-100">
                    <Key size={32} strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="font-black text-slate-800 text-lg">Account Recovery</h3>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight">Locked out or forgot your credentials?</p>
                </div>
            </div>
            <Button onClick={handleForgot} variant="outline" className="w-full md:w-auto h-14 rounded-xl border-2 border-blue-100 bg-white hover:bg-blue-50 font-black text-blue-600 px-8 transition-all flex items-center justify-center gap-3 shadow-sm">
                Request Reset Link <ChevronRight size={18} />
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}