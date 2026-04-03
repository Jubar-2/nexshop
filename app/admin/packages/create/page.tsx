"use client"

import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft, 
  Crown, 
  CircleDollarSign, 
  Clock,
  ShieldCheck,
  PlusCircle,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from 'next/link';

export default function AdminCreatePackage() {
  const [isSaving, setIsSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  
  // State for Live Preview
  const [pkg, setPkg] = useState({
    name: "Premium Pro",
    price: "499",
    duration: "Monthly",
    badge: "Most Popular",
    features: ["Instant Job Access", "10% Higher Earnings", "Priority Support"]
  });

  const addFeature = () => {
    if (featureInput.trim()) {
      setPkg({ ...pkg, features: [...pkg.features, featureInput] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = pkg.features.filter((_, i) => i !== index);
    setPkg({ ...pkg, features: newFeatures });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("New Package Created", {
        description: `${pkg.name} is now available for users to purchase.`,
        icon: <Zap className="text-amber-500" />
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-1">
            <div className="space-y-1">
                <Link href="/admin/packages" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors mb-2">
                    <ArrowLeft size={14} /> Back to Packages
                </Link>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Membership</h1>
            </div>
            <div className="flex gap-3">
                <Button variant="ghost" className="text-slate-400 font-bold hover:text-red-500 rounded-xl px-6">Discard</Button>
                <Button onClick={handleCreate} disabled={isSaving} className="bg-slate-900 hover:bg-black text-white font-black h-12 px-10 rounded-xl shadow-lg transition-all active:scale-95">
                    {isSaving ? "Saving..." : <><Save size={18} className="mr-2" /> Save Package</>}
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* --- LEFT: CONFIGURATION (3/5 Width) --- */}
            <div className="lg:col-span-3 space-y-6">
                <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                            <PlusCircle className="text-blue-500" size={18} /> Package Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Package Name</Label>
                                <Input value={pkg.name} onChange={(e) => setPkg({...pkg, name: e.target.value})} placeholder="e.g. Starter Pack" className="h-12 rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Badge Text (Optional)</Label>
                                <Input value={pkg.badge} onChange={(e) => setPkg({...pkg, badge: e.target.value})} placeholder="e.g. Best Value" className="h-12 rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Price (৳)</Label>
                                <Input type="number" value={pkg.price} onChange={(e) => setPkg({...pkg, price: e.target.value})} placeholder="0.00" className="h-12 rounded-xl border-slate-200 font-bold text-emerald-600" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Billing Cycle</Label>
                                <Select onValueChange={(val) => setPkg({...pkg, duration: val})}>
                                    <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                        <SelectValue placeholder="Select Cycle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Yearly">Yearly</SelectItem>
                                        <SelectItem value="Lifetime">Lifetime</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Feature Builder */}
                        <div className="space-y-4 pt-4">
                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Included Benefits</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={featureInput} 
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    placeholder="Add a benefit (e.g. Instant Withdrawals)" 
                                    className="h-12 rounded-xl border-slate-200" 
                                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                                />
                                <Button onClick={addFeature} type="button" className="bg-blue-600 hover:bg-blue-700 h-12 w-12 rounded-xl shrink-0 shadow-md">
                                    <Plus size={24} />
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-2 pt-2">
                                {pkg.features.map((feat, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-left-2">
                                        <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-emerald-500" /> {feat}
                                        </span>
                                        <button onClick={() => removeFeature(i)} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- RIGHT: LIVE PREVIEW (2/5 Width) --- */}
            <div className="lg:col-span-2">
                <div className="sticky top-24 space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Live Preview</p>
                    
                    {/* The User-Facing Package Card */}
                    <Card className="bg-white border-none shadow-2xl rounded-[40px] overflow-hidden relative group">
                        {pkg.badge && (
                            <div className="absolute top-6 right-6">
                                <div className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                    {pkg.badge}
                                </div>
                            </div>
                        )}
                        
                        <CardContent className="p-10 space-y-8">
                            <div className="space-y-2">
                                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4 shadow-inner">
                                    <Crown size={32} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{pkg.name || "Package Name"}</h3>
                                <p className="text-sm text-slate-400 font-medium">Enjoy exclusive royal features and higher earning potential.</p>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">৳{pkg.price || "0"}</span>
                                <span className="text-slate-400 font-bold text-sm">/{pkg.duration.toLowerCase()}</span>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                {pkg.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                        <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={12} className="text-emerald-600" />
                                        </div>
                                        {feat}
                                    </div>
                                ))}
                            </div>

                            <Button disabled className="w-full bg-slate-900 text-white font-black h-16 rounded-2xl text-lg shadow-xl cursor-default">
                                Upgrade Now
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex gap-4">
                        <ShieldCheck className="text-blue-500 shrink-0" size={24} />
                        <p className="text-xs font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
                            Package price changes will not affect existing active subscribers until their current cycle ends.
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}