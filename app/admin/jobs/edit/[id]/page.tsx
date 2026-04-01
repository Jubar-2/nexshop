"use client"

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  Globe, 
  Clock, 
  CircleDollarSign,
  Users,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Zap,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Link from 'next/link';

// Brand Icons Logic
const BrandIcons: any = {
  YouTube: <Clock className="text-[#FF0000]" />,
  Facebook: <Clock className="text-[#1877F2]" />,
  Instagram: <Clock className="text-[#E4405F]" />,
  Others: <Globe className="text-slate-400" />
};

export default function AdminEditJob() {
  const [isSaving, setIsSaving] = useState(false);
  
  // Simulated initial job data
  const [formData, setFormData] = useState({
    id: "J-8821",
    title: "Watch & Like YouTube Video (5 Mins)",
    category: "YouTube",
    reward: "15.00",
    slots: "200",
    completedSlots: 142,
    time: "5m",
    link: "https://youtube.com/watch?v=78x2a",
    instructions: "Step 1: Open the link.\nStep 2: Watch 3 minutes.\nStep 3: Like & Subscribe.",
    status: "Live"
  });

  const progress = (formData.completedSlots / Number(formData.slots)) * 100;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Changes Saved", {
        description: "The campaign has been updated successfully.",
        icon: <Save className="text-emerald-500 w-4 h-4" />
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* --- TOP BREADCRUMB & ACTIONS --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-1">
            <div className="space-y-1">
                <Link href="/admin/jobs" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest mb-2 transition-colors">
                    <ArrowLeft size={14} /> Back to Job Management
                </Link>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Job: <span className="text-blue-600">{formData.id}</span></h1>
                    <Badge className={`${formData.status === 'Live' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase`}>
                        {formData.status}
                    </Badge>
                </div>
            </div>
            
            <div className="flex gap-3">
                <Button variant="outline" className="h-12 border-slate-200 text-slate-600 font-bold rounded-xl px-6 hover:bg-white shadow-sm">
                    {formData.status === 'Live' ? <><PauseCircle size={18} className="mr-2" /> Pause</> : <><PlayCircle size={18} className="mr-2" /> Resume</>}
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 hover:bg-black text-white font-black h-12 px-10 rounded-xl shadow-lg flex gap-2 transition-all active:scale-95">
                    {isSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- LEFT: EDIT FORM --- */}
            <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
                
                {/* Section 1: General Details */}
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                            <Zap className="text-blue-500" size={18} /> Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Campaign Title</Label>
                            <Input 
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus-visible:ring-0 font-semibold" 
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Platform Category</Label>
                                <Select defaultValue={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                                    <SelectTrigger className="h-12 rounded-xl border-slate-200 font-semibold">
                                        <SelectValue />
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
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Worker Link</Label>
                                <Input 
                                    value={formData.link}
                                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                                    className="h-12 rounded-xl border-slate-200 focus:border-blue-500 font-semibold" 
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Financials & Scaling */}
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                            <CircleDollarSign className="text-emerald-500" size={18} /> Budget & Scaling
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Reward Per Worker (৳)</Label>
                                    <Input 
                                        type="number" 
                                        value={formData.reward}
                                        onChange={(e) => setFormData({...formData, reward: e.target.value})}
                                        className="h-12 rounded-xl border-slate-200 font-black text-emerald-600 text-lg" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Increase Total Slots</Label>
                                    <Input 
                                        type="number" 
                                        value={formData.slots}
                                        onChange={(e) => setFormData({...formData, slots: e.target.value})}
                                        className="h-12 rounded-xl border-slate-200 font-black text-slate-800" 
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center border border-slate-100 space-y-3">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Spending</p>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">৳{(formData.completedSlots * Number(formData.reward)).toLocaleString()}</h4>
                                </div>
                                <div className="h-[1px] bg-slate-200"></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Allocated Budget</p>
                                    <h4 className="text-xl font-bold text-slate-500 tracking-tighter">৳{(Number(formData.slots) * Number(formData.reward)).toLocaleString()}</h4>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Instructions */}
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                            <Clock className="text-amber-500" size={18} /> Update Instructions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Textarea 
                            value={formData.instructions}
                            onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                            className="min-h-[150px] rounded-2xl border-slate-200 focus:border-blue-500 font-medium" 
                        />
                    </CardContent>
                </Card>
            </form>

            {/* --- RIGHT: LIVE PROGRESS & DANGER ZONE --- */}
            <div className="space-y-6">
                
                {/* Real-time Progress Monitor */}
                <Card className="bg-slate-900 text-white border-none shadow-xl rounded-[32px] p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <BarChart3 size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold">Campaign Delivery</h3>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Real-time Stats</p>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-3xl font-black tracking-tighter text-emerald-400">{formData.completedSlots}</span>
                                <span className="text-slate-400 text-xs font-bold mb-1">/ {formData.slots} Completed</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-slate-800 [&>div]:bg-emerald-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase">Success Rate</p>
                                <p className="text-lg font-bold">98.2%</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase">Est. Completion</p>
                                <p className="text-lg font-bold">2.4 hrs</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Danger Zone */}
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-sm font-bold text-red-500 uppercase tracking-widest">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <p className="text-xs text-slate-500 leading-relaxed">Deleting this job will stop all active worker processes. This action cannot be undone.</p>
                        <Button variant="ghost" className="w-full h-12 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100">
                            <Trash2 size={18} className="mr-2" /> Delete Campaign
                        </Button>
                    </CardContent>
                </Card>

            </div>

        </div>
      </div>
    </div>
  );
}