"use client"

import React, { useState } from 'react';
import { 
  PlusCircle, 
//   Youtube, 
//   Facebook, 
//   Instagram, 
  CircleDollarSign, 
  Users, 
  Clock, 
  Globe, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Brand Icons
const BrandIcons = {
  Youtube: <Clock className="text-[#FF0000]" />,
  Facebook: <Clock className="text-[#1877F2]" />,
  Instagram: <Clock className="text-[#E4405F]" />,
};

export default function AdminPostJob() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for live preview
  const [formData, setFormData] = useState({
    title: "",
    category: "YouTube",
    reward: "",
    slots: "",
    time: "5m",
    link: "",
    instructions: ""
  });

  const totalCost = Number(formData.reward) * Number(formData.slots) || 0;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Job Published Successfully!", {
        description: "The task is now live and visible to all eligible workers.",
        icon: <div className="bg-emerald-50 p-1.5 rounded-lg"><Zap className="text-emerald-500 w-4 h-4" /></div>
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-5 pb-12 font-poppins">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-1">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Post New Micro-Job</h1>
                <p className="text-slate-500 font-medium text-sm">Create a verified task for the NexShop community</p>
            </div>
            <div className="flex gap-3">
                <Button variant="ghost" className="text-slate-400 font-bold hover:text-red-500 hover:bg-red-50 rounded-xl">
                    <Trash2 size={18} /> Discard
                </Button>
                <Button onClick={handlePublish} disabled={isSubmitting} className="bg-[#10B981] hover:bg-[#0da06f] text-white font-black h-12 px-8 rounded-xl shadow-lg flex gap-2 transition-all active:scale-95">
                    {isSubmitting ? "Publishing..." : <><PlusCircle size={18} /> Publish Job</>}
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- LEFT: CONFIGURATION FORM (2/3 Width) --- */}
            <form onSubmit={handlePublish} className="lg:col-span-2 space-y-6">
                
                {/* Section 1: Basic Info */}
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                            <PlusCircle className="text-blue-500" size={18} /> Job Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Job Title</Label>
                                <Input 
                                    required 
                                    placeholder="e.g. Watch & Like YouTube Video" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus-visible:ring-0 font-semibold" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Platform Category</Label>
                                <Select onValueChange={(val) => setFormData({...formData, category: val})}>
                                    <SelectTrigger className="h-12 rounded-xl border-slate-200 font-semibold">
                                        <SelectValue placeholder="Select Platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="YouTube">YouTube</SelectItem>
                                        <SelectItem value="Facebook">Facebook</SelectItem>
                                        <SelectItem value="Instagram">Instagram</SelectItem>
                                        <SelectItem value="Others">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Target Link</Label>
                                <Input 
                                    required 
                                    placeholder="https://..." 
                                    className="h-12 rounded-xl border-slate-200 focus:border-blue-500 font-semibold" 
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Pricing & Budget */}
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                            <CircleDollarSign className="text-emerald-500" size={18} /> Pricing & Budget
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Reward Per Task (৳)</Label>
                                    <Input 
                                        required 
                                        type="number" 
                                        placeholder="0.00"
                                        value={formData.reward}
                                        onChange={(e) => setFormData({...formData, reward: e.target.value})}
                                        className="h-12 rounded-xl border-slate-200 font-black text-emerald-600 text-lg" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Total Slots (Workers)</Label>
                                    <Input 
                                        required 
                                        type="number" 
                                        placeholder="e.g. 500" 
                                        value={formData.slots}
                                        onChange={(e) => setFormData({...formData, slots: e.target.value})}
                                        className="h-12 rounded-xl border-slate-200 font-black text-slate-800" 
                                    />
                                </div>
                            </div>
                            
                            {/* Auto-Calculation Box */}
                            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Campaign Budget</p>
                                <h4 className="text-4xl font-black text-slate-900 tracking-tighter">৳{totalCost.toLocaleString()}</h4>
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-white w-fit px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                                    <ShieldCheck size={14} /> Ready to fund
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Instructions */}
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                            <Clock className="text-amber-500" size={18} /> Worker Instructions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Textarea 
                            required 
                            placeholder="Step 1: Open the link... Step 2: Like & Comment..." 
                            className="min-h-[150px] rounded-2xl border-slate-200 focus:border-blue-500 font-medium" 
                        />
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-3 italic tracking-tight">Admin Tip: Be clear about proof requirements to reduce rejection.</p>
                    </CardContent>
                </Card>
            </form>

            {/* --- RIGHT: LIVE PREVIEW (1/3 Width) --- */}
            <div className="space-y-6">
                <div className="sticky top-24">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Live Preview</h3>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Updating</span>
                        </div>
                    </div>
                    
                    {/* The Job Card Preview */}
                    <Card className="bg-white border-none shadow-lg rounded-3xl overflow-hidden border-2 border-emerald-500/20">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                                    {(BrandIcons as any)[formData.category] || <Globe className="text-slate-400" />}
                                </div>
                                <div className="space-y-1 overflow-hidden">
                                    <h4 className="text-base font-black text-slate-900 truncate tracking-tight">
                                        {formData.title || "Job Title Appears Here..."}
                                    </h4>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                        <span className="flex items-center gap-1"><Clock size={12}/> {formData.time}</span>
                                        <span className="flex items-center gap-1"><Globe size={12}/> Global</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Reward</p>
                                    <p className="text-xl font-black text-emerald-600 tracking-tighter">৳{formData.reward || "0.00"}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Slots</p>
                                    <p className="text-base font-black text-slate-800">{formData.slots || "0"} Active</p>
                                </div>
                            </div>

                            <Button disabled className="w-full bg-slate-900 text-white font-bold h-12 rounded-xl text-sm gap-2">
                                Apply Now <ArrowRight size={16} />
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                        <CheckCircle2 className="text-blue-500 shrink-0" size={24} />
                        <p className="text-xs font-semibold text-blue-800 leading-relaxed uppercase tracking-tight">
                            Every job is audited by our AI system for compliance before going live to the 12,000+ member community.
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}