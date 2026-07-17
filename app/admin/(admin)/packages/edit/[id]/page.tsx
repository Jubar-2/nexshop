"use client"

import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    ArrowLeft,
    Clock,
    ShieldCheck,
    PlusCircle,
    Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from 'next/link';
import FeatureBuilder from '@/components/admin/package/FeatureBuilder';
import { useGetOffers } from '@/hooks/use-offers';
import { Skeleton } from '@/components/ui/skeleton';
import { MemberShipInput, MemberShipInSchema, MemberShipUpdateInSchema } from '@/lib/validations/membership';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useGetMembershipById } from '@/hooks/admin/use-membership';

type features = {
    id: string,
    offerTitle: string
}

type dataState = {
    name: string,
    price: string,
    duration: string,
    badge: string,
    title: string,
    icon: string,
    color: string,
    planOrder: string,
    submitNumber: string,
    limitParDay: string,
    features: features[]
}

export default function AdminUpdatePackage() {
    const params = useParams();
    const pkgId = params?.id as string;

    // State for Live Preview
    const [pkg, setPkg] = useState<dataState>({
        name: "",
        price: "",
        duration: "",
        badge: "",
        title: "",
        icon: "",
        color: "",
        planOrder: "",
        submitNumber: "",
        limitParDay: "",
        // features: ["Instant Job Access", "10% Higher Earnings", "Priority Support"],
        features: []
    });

    const { data, refetch, isLoading } = useGetOffers()
    const { data: packageData } = useGetMembershipById(pkgId)


    useEffect(() => {
        if (Array.isArray(data)) {
            const timeoutId = setTimeout(() => {
                setPkg((prev) => ({
                    ...prev,
                    features: data,
                }));
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [data, refetch]);

    useEffect(() => {
        // console.log("packageData", packageData)
        // if (Array.isArray(packageData)) {
            const timeoutId = setTimeout(() => {
                setPkg((prev) => ({
                    ...prev,
                    name: packageData?.membershipName || "",
                    price: packageData?.price?.toString() || "",
                    duration: packageData?.period?.toString() || "",
                    badge: packageData?.badgeText || "",
                    title: packageData?.title || "",
                    icon: packageData?.icon || "",
                    color: packageData?.color || "",
                    planOrder: packageData?.planOrder?.toString() || "",
                    submitNumber: packageData?.jobsSubmitLimit?.toString() || "",
                    limitParDay: packageData?.limitParDay?.toString() || "",
                }));
                
            }, 0);
            return () => clearTimeout(timeoutId);
        // }
    }, [packageData]);

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: MemberShipInput) => {
            const response = await axios.patch(
                "/api/admin/membership/update",
                payload
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Membership plan updated successfully", {
                description: `The membership plan has been updated.`,
                icon: (
                    <div className="bg-emerald-50 p-1 rounded-lg">
                        <Clock className="text-emerald-500 w-4 h-4" />
                    </div>
                ),
            });

        },
        onError: (error: unknown) => {

            let message = "Something went wrong. Please try again.";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }

            toast.error("Withdrawal Failed", { description: message });
        },
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        const offers = pkg.features.map((feat) => feat.id)

        const result = MemberShipUpdateInSchema.safeParse({
            id: pkgId,
            membershipName: pkg.name,
            jobsSubmitLimit: pkg.submitNumber !== "" ? +pkg.submitNumber : 0,
            limitParDay: pkg.limitParDay !== "" ? +pkg.limitParDay : 0,
            title: pkg.title,
            planOrder: pkg.planOrder !== "" ? +pkg.planOrder : "",
            price: pkg.price !== "" ? +pkg.price : "",
            badgeText: pkg.badge,
            icon: pkg.icon,
            period: pkg.duration !== "" ? +pkg.duration : "",
            color: pkg.color,
            offers
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            console.log(result.error.issues)
            result.error.issues.forEach((err) => {
                const field = err.path[0]; // name, price, etc
                if (field) {
                    fieldErrors[field as string] = err.message;
                }
            });

            setErrors(fieldErrors);

            return;
        }

        mutate(result.data)

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
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Update Membership</h1>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="text-slate-400 font-bold hover:text-red-500 rounded-xl px-6">Discard</Button>
                        <Button onClick={handleUpdate} disabled={isPending} className="bg-slate-900 hover:bg-black text-white font-black h-12 px-10 rounded-xl shadow-lg transition-all active:scale-95">
                            {isPending ? "Saving..." : <><Save size={18} className="mr-2" /> Save Package</>}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* --- LEFT: CONFIGURATION (3/5 Width) --- */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="bg-white border-none shadow-sm rounded-4xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                                    <PlusCircle className="text-blue-500" size={18} /> Package Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Package Name</Label>
                                        <Input
                                            value={pkg.name}
                                            onChange={(e) => setPkg({ ...pkg, name: e.target.value })}
                                            placeholder="e.g. Starter Pack"
                                            className="h-12 rounded-xl border-slate-200"
                                        />
                                        {errors.membershipName && (
                                            <p className="text-red-500 text-xs mt-0 font-bold">
                                                {errors?.membershipName}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Badge Text (Optional)</Label>
                                        <Input
                                            value={pkg.badge}
                                            onChange={(e) => setPkg({ ...pkg, badge: e.target.value })}
                                            placeholder="e.g. Best Value"
                                            className="h-12 rounded-xl border-slate-200" />

                                        {errors.badgeText && (
                                            <p className="text-red-500 text-xs mt-0 font-bold">
                                                {errors?.badgeText}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Price (৳)</Label>
                                        <Input
                                            type="number"
                                            value={pkg.price}
                                            onChange={(e) => setPkg({ ...pkg, price: e.target.value })}
                                            placeholder="0.00"
                                            className="h-12 rounded-xl border-slate-200 font-bold text-emerald-600"
                                        />

                                        {errors.price && (
                                            <p className="text-red-500 text-xs mt-0 font-bold">
                                                {errors?.price}
                                            </p>
                                        )}
                                    </div>
                                    {/* <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Billing Cycle</Label>
                                        <Select onValueChange={(val) => setPkg({ ...pkg, duration: val })}>
                                            <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                                <SelectValue placeholder="Select Cycle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                                <SelectItem value="Yearly">Yearly</SelectItem>
                                                <SelectItem value="Lifetime">Lifetime</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div> */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                            Period (Monthly)
                                        </Label>
                                        <Input
                                            type="number"
                                            value={pkg.duration}
                                            onChange={(e) => setPkg({ ...pkg, duration: e.target.value })}
                                            placeholder="0 / month"
                                            className="h-12 rounded-xl border-slate-200 font-bold text-emerald-600"
                                        />

                                        {errors.period && (
                                            <p className="text-red-500 text-xs mt-0 font-bold">
                                                {errors?.period}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                            Title
                                        </Label>
                                        <Input
                                            type="text"
                                            value={pkg.title}
                                            onChange={(e) => setPkg({ ...pkg, title: e.target.value })}
                                            placeholder="Inter your package title"
                                            className="h-12 rounded-xl border-slate-200 font-bold text-emerald-600"
                                        />

                                        {errors.title && (
                                            <p className="text-red-500 text-xs mt-0 font-bold">
                                                {errors?.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                            Icon
                                        </Label>
                                        <Input
                                            type="text"
                                            value={pkg.icon}
                                            onChange={(e) => setPkg({ ...pkg, icon: e.target.value })}
                                            placeholder="Svg icon"
                                            className="h-12 rounded-xl border-slate-200 font-bold text-emerald-600"
                                        />

                                        {errors.icon && (
                                            <p className="text-red-500 text-xs mt-0 font-bold">
                                                {errors?.icon}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                            Color
                                        </Label>
                                        <Input
                                            type="text"
                                            value={pkg.color}
                                            onChange={(e) => setPkg({ ...pkg, color: e.target.value })}
                                            placeholder="# code"
                                            className="h-12 rounded-xl border-slate-200 font-bold text-emerald-600"
                                        />

                                        {errors.color && (
                                            <p className="text-red-500 text-xs mt-0 font-bold">
                                                {errors?.color}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                            Plan Order
                                        </Label>
                                        <Input
                                            type="number"
                                            value={pkg.planOrder}
                                            onChange={(e) => setPkg({ ...pkg, planOrder: e.target.value })}
                                            placeholder="Order Number"
                                            className="h-12 rounded-xl border-slate-200 font-bold text-emerald-600"
                                        />
                                        {errors.planOrder && (
                                            <p className="text-red-500 text-xs mt-0 font-bold">
                                                {errors?.planOrder}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                            Jobs Submit Limit
                                        </Label>
                                        <Input
                                            type="number"
                                            value={pkg.submitNumber}
                                            onChange={(e) => setPkg({ ...pkg, submitNumber: e.target.value })}
                                            placeholder="Jobs Submit Number"
                                            className="h-12 rounded-xl border-slate-200 font-bold text-emerald-600"
                                        />

                                        {errors.jobsSubmitLimit && (
                                            <p className="text-red-500 text-xs mt-0 font-bold">
                                                {errors?.jobsSubmitLimit}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                            Jobs Submit Limit (par day)
                                        </Label>
                                        <Input
                                            type="number"
                                            value={pkg.limitParDay}
                                            onChange={(e) => setPkg({ ...pkg, limitParDay: e.target.value })}
                                            placeholder="Jobs Submit Number of a day"
                                            className="h-12 rounded-xl border-slate-200 font-bold text-emerald-600"
                                        />

                                        {errors.jobsSubmitLimit && (
                                            <p className="text-red-500 text-xs mt-0 font-bold">
                                                {errors?.limitParDay}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Feature Builder */}
                                <FeatureBuilder pkg={pkg} refetch={refetch} isLoading={isLoading} setPkg={setPkg} />
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

                                        <div
                                            className={`w-14 h-14 bg-[${pkg.color}] rounded-2xl flex items-center justify-center text-amber-500 mb-4 shadow-inner`}
                                            dangerouslySetInnerHTML={{ __html: pkg.icon }}>
                                            {/* <Crown size={32} /> */}
                                            {/*#fffbeb {pkg.icon} */}

                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{pkg.name || "Package Name"}</h3>
                                        <p className="text-sm text-slate-400 font-medium">
                                            {/* Enjoy exclusive royal features and higher earning potential. */}
                                            {pkg.title}
                                        </p>
                                    </div>

                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-slate-900 tracking-tighter">৳{pkg.price || "0"}</span>
                                        <span className="text-slate-400 font-bold text-sm">/ {pkg.duration === "0" ? "Unlimited" : pkg.duration.toLowerCase() + " month"}</span>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                                <CheckCircle2 size={12} className="text-emerald-600" />
                                            </div>
                                            Jobs submission limit is {pkg.submitNumber === "" ? "unlimited" : pkg.submitNumber}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                                <CheckCircle2 size={12} className="text-emerald-600" />
                                            </div>
                                            Jobs submission limit is {pkg.limitParDay === "" ? "unlimited" : pkg.limitParDay} par day
                                        </div>
                                        {isLoading ? (
                                            [1, 2, 3].map((feat, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                                        <CheckCircle2 size={12} className="text-emerald-600" />
                                                    </div>
                                                    <Skeleton className="h-5 w-20 bg-slate-200" />
                                                </div>
                                            ))
                                        ) : (
                                            pkg.features.map((feat, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                                        <CheckCircle2 size={12} className="text-emerald-600" />
                                                    </div>
                                                    {feat.offerTitle}
                                                </div>
                                            ))
                                        )}

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
        </div >
    );
}