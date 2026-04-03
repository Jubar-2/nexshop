"use client"

import React, { useState } from 'react';
import {
    Zap,
    Plus,
    Search,
    MoreHorizontal,
    Edit3,
    Trash2,
    Users,
    CircleDollarSign,
    Eye,
    Ban,
    CheckCircle2,
    Crown,
    TrendingUp,
    ArrowRight,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from 'next/link';

// --- MOCK DATA ---
const packages = [
    { id: "PKG-01", name: "Free Starter", price: "0", duration: "Lifetime", subscribers: "8,402", status: "Active", revenue: "0" },
    { id: "PKG-02", name: "Premium Pro", price: "499", duration: "Monthly", subscribers: "1,240", status: "Active", revenue: "618,760", isPopular: true },
    { id: "PKG-03", name: "Royal VIP", price: "2499", duration: "Yearly", subscribers: "415", status: "Active", revenue: "1,037,085" },
    { id: "PKG-04", name: "Exclusive Lifetime", price: "9999", duration: "Lifetime", subscribers: "89", status: "Inactive", revenue: "889,911" },
];

export default function AdminPackageList() {
    const [filter, setFilter] = useState("All");

    const handleDelete = (name: string) => {
        toast.error("Package Archived", {
            description: `${name} has been moved to the archives.`,
        });
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-6xl mx-auto px-4 space-y-6">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Membership Packages</h1>
                        <p className="text-slate-500 font-medium text-sm">Manage subscription tiers and pricing strategies</p>
                    </div>
                    <Link href="/admin/packages/create">
                        <Button className="bg-slate-900 hover:bg-black text-white font-black h-12 px-8 rounded-xl shadow-lg flex gap-2 transition-all active:scale-95">
                            <Plus size={20} /> Create New Tier
                        </Button>
                    </Link>
                </div>

                {/* --- ANALYTICS SNAPSHOT --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard label="Active Subscribers" val="10,146" icon={<Users className="text-blue-500" />} />
                    <MetricCard label="Monthly Recurring" val="৳1.2M" icon={<TrendingUp className="text-emerald-500" />} />
                    <MetricCard label="Avg. Conversion" val="12.4%" icon={<Zap className="text-amber-500" />} />
                </div>

                {/* --- TOOLBAR --- */}
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            {["All", "Active", "Inactive"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input placeholder="Search packages..." className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* --- PACKAGE TABLE --- */}
                <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Name</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscribers</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Revenue</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {packages.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shadow-inner">
                                                    <Crown size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-black text-slate-800 leading-none">{pkg.name}</p>
                                                        {pkg.isPopular && <Badge className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0 rounded uppercase">Popular</Badge>}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{pkg.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 tracking-tight">৳{pkg.price}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{pkg.duration}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-700">{pkg.subscribers}</span>
                                                <Users size={14} className="text-slate-300" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-sm font-black text-emerald-600 tracking-tighter">৳{pkg.revenue}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <Badge variant="outline" className={`border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg ${pkg.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {pkg.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/admin/packages/edit/${pkg.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                                        <Edit3 size={18} />
                                                    </Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl font-poppins">
                                                        <DropdownMenuItem className="gap-2 font-bold text-slate-600"><Eye size={14} /> View Statistics</DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 font-bold text-slate-600"><Ban size={14} /> {pkg.status === 'Active' ? 'Deactivate' : 'Activate'}</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(pkg.name)} className="gap-2 font-bold text-red-500"><Trash2 size={14} /> Delete Plan</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-slate-50/50 p-6 flex items-center justify-center border-t border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">End of Package Directory</p>
                    </div>
                </Card>

            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

const MetricCard = ({ label, val, icon }: any) => (
    <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex items-center justify-between group hover:shadow-md transition-all">
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{val}</h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
    </Card>
);