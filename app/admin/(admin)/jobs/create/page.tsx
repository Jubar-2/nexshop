"use client"

import React, { useState, useMemo } from 'react';
import {
    PlusCircle,
    CircleDollarSign,
    Users,
    Clock,
    Globe,
    ExternalLink,
    ShieldCheck,
    CheckCircle2,
    Trash2,
    Zap,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from 'react-hook-form'; // Added Controller
import { JobsInput, JobsInSchema } from '@/lib/validations/jobs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCategory } from '@/hooks/admin/use-category';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { cn } from '@/lib/utils';

const BrandIcons: Record<string, React.ReactNode> = {
    Youtube: <Clock className="text-[#FF0000]" />,
    Facebook: <Clock className="text-[#1877F2]" />,
    Instagram: <Clock className="text-[#E4405F]" />,
};

type SubCategory = {
    id: string;
    name: string;
};

type Category = {
    id: string;
    name: string;
    subCategories: SubCategory[];
};

export default function AdminPostJob() {
    const { data: categories } = useGetCategory("");

    // Setup Form
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm<JobsInput>({
        resolver: zodResolver(JobsInSchema),
        defaultValues: {
            jobTitle: "",
            description: "",
            category: "",
            subCategory: "",
            targetLink: "",
            reward: undefined,
            workerRequired: undefined
        }
    });

    // Watch values for Live Preview & Dynamic Logic
    const watchedCategory = watch("category");
    const watchedReward = watch("reward");
    const watchedSlots = watch("workerRequired");
    const watchedTitle = watch("jobTitle");
    const watchedDescription = watch("description");

    // Logic for filtering Sub-Categories
    const currentCategoryData = useMemo(() => {
        return categories?.find((cat: Category) => cat.id === watchedCategory);
    }, [categories, watchedCategory]);

    // Calculate total budget
    const totalCost = (Number(watchedReward) || 0) * (Number(watchedSlots) || 0);

    // Mutation for API call
    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: JobsInput) => {
            const response = await axios.post("/api/admin/jobs/create", payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Job Published Successfully!", {
                description: "The task is now live for all eligible workers.",
                icon: <div className="bg-emerald-50 p-1.5 rounded-lg"><Zap className="text-emerald-500 w-4 h-4" /></div>
            });
            reset();
        },
        onError: (error: unknown) => {
            let message = "Failed to publish";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message;
            }

            toast.error("Failed to publish", { description: message });
        }
    });

    const onSubmit = (data: JobsInput) => {
        mutate(data);
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-5 pb-12 font-poppins">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="max-w-6xl mx-auto px-4">
                    {/* --- PAGE HEADER --- */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-1">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Post New Micro-Job</h1>
                            <p className="text-slate-500 font-medium text-sm">Create a verified task for the NexShop community</p>
                        </div>
                        <div className="flex gap-3">
                            <Button type="button" variant="ghost" onClick={() => reset()} className="text-slate-400 font-bold hover:text-red-500 hover:bg-red-50 rounded-xl">
                                <Trash2 size={18} /> Discard
                            </Button>
                            <Button
                                disabled={isPending}
                                className="bg-[#10B981] hover:bg-[#0da06f] text-white font-black h-12 px-8 rounded-xl shadow-lg flex gap-2 transition-all active:scale-95">
                                {isPending ? <Loader2 className="animate-spin" /> : <><PlusCircle size={18} /> Publish Job</>}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* --- LEFT: CONFIGURATION FORM --- */}
                        <div className="lg:col-span-2 space-y-6">
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
                                                {...register("jobTitle")}
                                                placeholder="e.g. Watch & Like YouTube Video"
                                                className={cn("h-12 rounded-xl border-2", errors.jobTitle ? "border-red-500" : "border-slate-200 focus:border-blue-500")}
                                            />
                                            {errors.jobTitle && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.jobTitle.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Platform Category</Label>
                                            <Controller
                                                name="category"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="h-12 rounded-xl border-slate-200 font-semibold">
                                                            <SelectValue placeholder="Select Platform" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories?.map((cat: Category) => (
                                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.category && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.category.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Platform Sub-Category</Label>
                                            <Controller
                                                name="subCategory"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value} disabled={!watchedCategory}>
                                                        <SelectTrigger className="h-12 rounded-xl border-slate-200 font-semibold">
                                                            <SelectValue placeholder="Select Task Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {currentCategoryData?.subCategories?.map((sub: SubCategory) => (
                                                                <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.subCategory && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.subCategory.message}</p>}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Target Link</Label>
                                            <Input
                                                {...register("targetLink")}
                                                placeholder="https://..."
                                                className="h-12 rounded-xl border-slate-200 focus:border-blue-500 font-semibold"
                                            />
                                            {errors.targetLink && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.targetLink.message}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

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
                                                    {...register("reward")}
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="h-12 rounded-xl border-slate-200 font-black text-emerald-600 text-lg"
                                                />
                                                {errors.reward && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.reward.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Total Slots (Workers)</Label>
                                                <Input
                                                    {...register("workerRequired")}
                                                    type="number"
                                                    placeholder="e.g. 500"
                                                    className="h-12 rounded-xl border-slate-200 font-black text-slate-800"
                                                />
                                                {errors.workerRequired && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.workerRequired.message}</p>}
                                            </div>
                                        </div>
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

                            <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                    <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                                        <Clock className="text-amber-500" size={18} /> Worker Instructions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <Textarea
                                        {...register("description")}
                                        placeholder="Step 1: Open the link... Step 2: Like & Comment..."
                                        className="min-h-37.5 rounded-2xl border-slate-200 focus:border-blue-500 font-medium"
                                    />
                                </CardContent>
                            </Card>
                            {errors.description && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.description.message}</p>}
                        </div>

                        {/* --- RIGHT: LIVE PREVIEW --- */}
                        <div className="space-y-6">
                            <div className="sticky top-24">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Live Preview</h3>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Updating</span>
                                    </div>
                                </div>

                                <Card className="bg-white border-none shadow-lg rounded-3xl overflow-hidden border-2 border-emerald-500/20">
                                    <CardContent className="p-6 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                                                {BrandIcons[currentCategoryData?.name] || <Globe className="text-slate-400" />}
                                            </div>
                                            <div className="space-y-1 overflow-hidden">
                                                <h4 className="text-base font-black text-slate-900 truncate tracking-tight">
                                                    {watchedTitle || "Job Title Appears Here..."}
                                                </h4>
                                                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> 5m</span>
                                                    <span className="flex items-center gap-1"><Globe size={12} /> Global</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Reward</p>
                                                <p className="text-xl font-black text-emerald-600 tracking-tighter">৳{watchedReward as string || "0.00"}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Slots</p>
                                                <p className="text-base font-black text-slate-800">{watchedSlots as string || "0"} Active</p>
                                            </div>
                                        </div>

                                        <Button disabled className="w-full bg-slate-900 text-white font-black h-12 rounded-xl text-sm gap-2">
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
            </form>
        </div>
    );
}