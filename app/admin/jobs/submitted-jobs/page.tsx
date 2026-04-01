"use client"

import React, { useState } from 'react';
import {
    Search, CheckCircle2, XCircle, Clock,
    Image as ImageIcon, ExternalLink,
    User, Briefcase, Filter, ShieldAlert,
    MoreHorizontal, ChevronRight, Eye,
    Globe
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Brand Icons
const BrandIcons = {
    YouTube: <Clock className="text-[#FF0000]" size={16} />,
    Facebook: <Clock className="text-[#1877F2]" size={16} />,
    Instagram: <Clock className="text-[#E4405F]" size={16} />,
    Others: <Globe className="text-slate-400" size={16} />
};

// --- MOCK DATA ---
const submittedProofs = [
    { id: "P-4401", user: "mdjubairrahman", job: "Watch & Like YouTube Video", category: "YouTube", date: "2 mins ago", status: "Pending", proofText: "Done. My account name is Jubair Dev.", screenshot: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" },
    { id: "P-4402", user: "emonbhuiyan", job: "Follow Facebook Page", category: "Facebook", date: "15 mins ago", status: "Pending", proofText: "Followed successfully.", screenshot: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1000&auto=format&fit=crop" },
    { id: "P-4395", user: "biplob_2004", job: "Instagram Story View", category: "Instagram", date: "1 hour ago", status: "Approved", proofText: "Viewed and liked.", screenshot: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?q=80&w=1000&auto=format&fit=crop" },
];

export default function SubmittedJobs() {
    const [filter, setFilter] = useState("Pending");

    const handleAudit = (id: string, action: 'Approve' | 'Reject') => {
        toast.success(`Submission ${id} ${action}d`, {
            description: `Worker will receive payment instantly.`,
            icon: action === 'Approve' ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />
        });
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-6xl mx-auto px-4 space-y-6">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Proof Verification</h1>
                        <p className="text-slate-500 font-medium text-sm">Audit submitted work and release payments</p>
                    </div>

                    <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 items-center gap-6 px-6">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Awaiting Review</p>
                            <h2 className="text-xl font-black text-amber-500 tracking-tighter">84 Proofs</h2>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-100"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Approved Today</p>
                            <h2 className="text-xl font-black text-emerald-600 tracking-tighter">142</h2>
                        </div>
                    </div>
                </div>

                {/* --- FILTERS --- */}
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {["Pending", "Approved", "Rejected", "All"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input placeholder="Search worker or ID..." className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* --- SUBMISSIONS LIST --- */}
                <div className="space-y-4">
                    {submittedProofs.map((proof) => (
                        <Card key={proof.id} className="bg-white border-none shadow-sm rounded-[24px] overflow-hidden hover:shadow-md transition-all group">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">

                                    {/* Worker Info */}
                                    <div className="flex items-center gap-4 min-w-[220px]">
                                        <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm">
                                            <AvatarFallback className="bg-slate-100 font-black text-slate-400 uppercase text-xs">{proof.user[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <h4 className="text-sm font-black text-slate-800 leading-none mb-1 truncate">{proof.user}</h4>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{proof.id} • {proof.date}</p>
                                        </div>
                                    </div>

                                    {/* Job Info */}
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-slate-50 rounded-lg">{(BrandIcons as any)[proof.category]}</div>
                                            <h3 className="text-sm font-bold text-slate-700 truncate">{proof.job}</h3>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium italic line-clamp-1">"{proof.proofText}"</p>
                                    </div>

                                    {/* Action Area */}
                                    <div className="flex items-center gap-3 justify-between lg:justify-end">

                                        {/* PROOF MODAL TRIGGER */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-600 font-bold px-5 gap-2 hover:bg-slate-50">
                                                    <ImageIcon size={18} /> View Proof
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-3xl border-none">
                                                <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
                                                    <div className="flex items-center gap-3">
                                                        <ImageIcon size={20} className="text-blue-400" />
                                                        <DialogTitle className="text-sm font-black uppercase tracking-widest">Submitted Proof Screenshot</DialogTitle>
                                                    </div>
                                                    <Badge className="bg-white/10 text-white border-none font-bold">{proof.id}</Badge>
                                                </div>
                                                <div className="bg-slate-100 p-2">
                                                    <img src={proof.screenshot} alt="Work Proof" className="w-full h-auto rounded-2xl shadow-inner max-h-[70vh] object-contain" />
                                                </div>
                                                <div className="p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Worker Notes</p>
                                                        <p className="text-sm font-bold text-slate-700 italic">"{proof.proofText}"</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button onClick={() => handleAudit(proof.id, 'Approve')} className="bg-emerald-500 hover:bg-emerald-600 font-black px-6 rounded-xl h-11">Confirm & Pay</Button>
                                                        <Button onClick={() => handleAudit(proof.id, 'Reject')} variant="ghost" className="text-red-500 font-bold px-6 rounded-xl h-11">Reject</Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Quick Desktop Actions */}
                                        <div className="hidden sm:flex items-center gap-2">
                                            <Button
                                                onClick={() => handleAudit(proof.id, 'Approve')}
                                                size="icon"
                                                className="h-11 w-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-md transition-all active:scale-90"
                                            >
                                                <CheckCircle2 size={22} className="text-white" />
                                            </Button>
                                            <Button
                                                onClick={() => handleAudit(proof.id, 'Reject')}
                                                size="icon"
                                                variant="outline"
                                                className="h-11 w-11 rounded-xl border-slate-200 text-red-500 hover:bg-red-50"
                                            >
                                                <XCircle size={22} />
                                            </Button>
                                        </div>

                                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-slate-300">
                                            <ShieldAlert size={20} />
                                        </Button>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Load More */}
                <div className="flex justify-center pt-4">
                    <Button variant="ghost" className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-800">
                        Show 50 more submissions <ChevronRight size={16} />
                    </Button>
                </div>

            </div>
        </div>
    );
}