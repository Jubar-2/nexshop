"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Plus, Search, Edit3, Trash2, Globe, Loader2, FolderPlus, Zap,
    Clock
} from 'lucide-react';
import { toast } from "sonner";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import SubCategoryDlt from '@/components/admin/category/SubCategoryDlt';

// Types & Hooks
import { categoryInput, categorySchema } from '@/lib/validations/category';
import { subCategoryInput, subCategorySchema } from '@/lib/validations/subCategory';
import { categoryType, subCatType, useGetCategory } from '@/hooks/admin/use-category';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from "use-debounce";


export default function AdminCategoryPage() {
    const queryClient = useQueryClient();


    const [search, setSearch] = useState<string>("");
    const [debouncedSearch] = useDebounce<string>(search, 400);

    const { data, isLoading } = useGetCategory(debouncedSearch);


    const [isAddingCat, setIsAddingCat] = useState(false);
    const [isAddingSub, setIsAddingSub] = useState(false);
    const [activeParent, setActiveParent] = useState<{ id: string, name: string } | null>(null);

    const catForm = useForm<categoryInput>({ resolver: zodResolver(categorySchema) });
    const subForm = useForm<subCategoryInput>({ resolver: zodResolver(subCategorySchema) });

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: categoryInput) => {
            const response = await axios.post(
                "/api/admin/category/create",
                payload
            );
            return response.data;
        },
        onSuccess: () => {

            toast.success("Category Created", { description: `${data.name} is now live.` });

            catForm.reset();

            queryClient.invalidateQueries({ queryKey: ["category"] });

            toast.success("Withdrawal Request Sent", {
                description: `add is now pending review.`,
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


    const { mutate: subMutate, isPending: subPending } = useMutation({
        mutationFn: async (payload: subCategoryInput) => {
            const response = await axios.post(
                "/api/admin/subcategory/create",
                payload
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category"] });

            toast.success("Category Created", { description: `${data.name} is now live.` });
            subForm.reset();

            toast.success("Withdrawal Request Sent", {
                description: `add is now pending review.`,
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

    const onCatSubmit = async (data: categoryInput) => {
        mutate(data)
    };

    const onSubSubmit = async (data: subCategoryInput) => {
        // close model
        setIsAddingSub(false);
        subMutate(data)
    };

    const handleOpenSubDialog = (id: string, name: string) => {
        setActiveParent({ id, name });
        subForm.setValue("categoryId", id);
        setIsAddingSub(true);
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins w-full">
            <div className="max-w-5xl mx-auto px-4 space-y-8">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Taxonomy Manager</h1>
                        <p className="text-slate-500 font-medium text-sm italic">Organize job categories and worker skill-sets</p>
                    </div>

                    <Dialog open={isAddingCat} onOpenChange={setIsAddingCat}>
                        <DialogTrigger asChild>
                            <Button className="bg-slate-900 hover:bg-black text-white font-black h-12 px-8 rounded-xl shadow-lg flex gap-2 transition-all active:scale-95">
                                <Plus size={20} /> New Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[32px] border-none font-poppins sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black">Create Main Category</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={catForm.handleSubmit(onCatSubmit)} className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Category Name</Label>
                                    <Input
                                        {...catForm.register("name")}
                                        placeholder="e.g. Social Media"
                                        className={cn("h-12 rounded-xl border-2", catForm.formState.errors.name ? "border-red-500" : "border-slate-100")}
                                    />
                                    {catForm.formState.errors.name && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{catForm.formState.errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">
                                        Category Icon
                                    </Label>
                                    <Input
                                        {...catForm.register("icon")}
                                        placeholder="e.g. Social Media Icon"
                                        className={cn("h-12 rounded-xl border-2", catForm.formState.errors.icon ? "border-red-500" : "border-slate-100")}
                                    />
                                    {catForm.formState.errors.icon && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{catForm.formState.errors.icon.message}</p>}
                                </div>

                                <Button
                                    disabled={isPending}
                                    className="w-full bg-[#10B981] font-black h-14 rounded-2xl shadow-xl transition-all">
                                    {isPending ? <Loader2 className="animate-spin" /> : <><FolderPlus size={18} className="mr-2" /> Save Category</>}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {isLoading ? (
                        [1, 2, 3, 4].map(i => <MetricSkeleton key={i} />)
                    ) : (
                        <>
                            <MetricBox label="Total Categories" val="12" />
                            <MetricBox label="Total Sub-Cats" val="84" />
                            <MetricBox label="Active Jobs" val="1.4k" />
                            <MetricBox label="Top Payout" val="YouTube" />
                        </>
                    )}
                </div>

                {/* --- CATEGORY LIST --- */}
                <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden">
                    <CardHeader className="border-b border-slate-50 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <CardTitle className="text-lg font-bold text-slate-800 tracking-tight leading-none">Structure Tree</CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <Input placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 pl-10 rounded-xl bg-slate-50 border-none text-xs" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="divide-y divide-slate-50">
                                {[1, 2, 3].map(i => <CategorySkeleton key={i} />)}
                            </div>
                        ) : (
                            <Accordion type="single" collapsible className="w-full">
                                {data?.map((cat: categoryType) => (
                                    <AccordionItem key={cat.id} value={cat.id} className="border-b border-slate-50 last:border-none">
                                        <AccordionTrigger className="px-8 py-6 hover:bg-slate-50/50 transition-all hover:no-underline group">
                                            <div className="flex items-center gap-4 text-left">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-data-[state=open]:bg-white group-data-[state=open]:shadow-md transition-all shrink-0"
                                                    dangerouslySetInnerHTML={{ __html: cat.icon }}
                                                >
                                                    {/* <Globe className="text-slate-400" size={20} /> */}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-slate-800 leading-none mb-1">{cat.name}</h3>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.subCategories?.length || 0} Sub-categories</p>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent
                                            key={cat.subCategories?.length}
                                            className="bg-slate-50/30 px-8 pb-6 pt-2"
                                        >
                                            <div className="space-y-2 ml-0 sm:ml-14">
                                                {cat.subCategories?.map((sub: subCatType) => (
                                                    <div key={sub.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm group/sub animate-in fade-in slide-in-from-left-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                            <span className="text-sm font-bold text-slate-600">{sub.name}</span>
                                                            {/* <Badge variant="outline" className="bg-slate-50 text-[9px] border-none font-bold text-slate-400">0 Jobs</Badge> */}
                                                        </div>
                                                        <div className="flex gap-1 md:opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                            {/* <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-300 hover:text-blue-500"><Edit3 size={14} /></Button> */}
                                                            <SubCategoryDlt id={sub.id} />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => handleOpenSubDialog(cat.id, cat.name)}
                                                    className="w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all font-bold text-xs uppercase tracking-widest"
                                                >
                                                    <Plus size={16} /> Add Sub-category to {cat.name}
                                                </button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </CardContent>
                </Card>

                {/* SHARED SUB-CATEGORY DIALOG */}
                <Dialog open={isAddingSub} onOpenChange={setIsAddingSub}>
                    <DialogContent className="rounded-[32px] border-none font-poppins sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black">Add to {activeParent?.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={subForm.handleSubmit(onSubSubmit)} className="space-y-6 py-4">
                            <input type="hidden" {...subForm.register("categoryId")} />
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Sub-category Name</Label>
                                <Input
                                    {...subForm.register("name")}
                                    placeholder="e.g. Subscribe & Bell"
                                    className={cn("h-12 rounded-xl border-2", subForm.formState.errors.name ? "border-red-500" : "border-slate-100")}
                                />
                                {subForm.formState.errors.name && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{subForm.formState.errors.name.message}</p>}
                            </div>
                            <Button disabled={subPending} className="w-full bg-[#3b82f6] hover:bg-blue-600 font-black h-14 rounded-2xl shadow-xl">
                                {subPending ? <Loader2 className="animate-spin" /> : <><Zap size={18} className="mr-2" /> Create Sub-category</>}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}

// --- SUB-COMPONENTS & SKELETONS ---

function MetricBox({ label, val }: { label: string, val: string }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-black text-slate-800 tracking-tighter leading-none">{val}</p>
        </div>
    );
}

function MetricSkeleton() {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-2">
            <Skeleton className="h-2.5 w-20 bg-slate-100" />
            <Skeleton className="h-6 w-12 bg-slate-200" />
        </div>
    );
}

function CategorySkeleton() {
    return (
        <div className="px-8 py-6 flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32 bg-slate-200" />
                <Skeleton className="h-2.5 w-24 bg-slate-100" />
            </div>
            <Skeleton className="h-4 w-4 bg-slate-100 rounded-full" />
        </div>
    );
}