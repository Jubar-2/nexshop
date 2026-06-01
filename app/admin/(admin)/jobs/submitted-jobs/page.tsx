"use client"

import React, { useState } from 'react';
import {
    Search, CheckCircle2, XCircle, Clock,
    Image as ImageIcon, Globe, ShieldAlert,
    ChevronLeft, ChevronRight, Loader2, ExternalLink,
    Zap
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from 'next/image';
import { useGetSubmittedJobs } from '@/hooks/admin/use-jobs';
import { useDebounce } from 'use-debounce';
import { cn } from '@/lib/utils';
import SubmissionSkeleton from '@/components/admin/jobs/SubmissionSkeleton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ChangeSubmitJobStatusType } from '@/lib/validations/jobs';
import Pagination from '@/components/admin//submittedJob/Pagination';
import { SubmittedJob } from '@/types/jobs';

export default function SubmittedJobs() {
    const queryClient = useQueryClient();

    const [filter, setFilter] = useState("PENDING");
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [page, setPage] = useState(1);

    const { data: response, isLoading } = useGetSubmittedJobs(page, filter, debouncedSearch);

    const submissions = response?.data || [];
    const meta = response?.meta;

    // Mutation for API call
    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: ChangeSubmitJobStatusType) => {
            const response = await axios.patch("/api/admin/submitted-jobs/change-status", payload);
            return response.data;
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["admin-submitted-jobs"] });

            toast.success("Job Published Successfully!", {
                description: "The task is now live for all eligible workers.",
                icon: <div className="bg-emerald-50 p-1.5 rounded-lg">
                    <Zap className="text-emerald-500 w-4 h-4" />
                </div>
            });

        },
        onError: (error: unknown) => {
            let message = "Failed to publish";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message;
            }

            toast.error("Failed to publish", { description: message });
        }
    });


    const handleAudit = (id: string, status: 'REJECTED' | 'APPROVED', freelancerId: string) => {
        mutate({
            id,
            status,
            freelancerId
        });
        toast.promise(new Promise((r) => setTimeout(r, 1000)), {
            loading: 'Processing payout...',
            success: `Submission ${status}d successfully`,
            error: 'Database update failed',
        });
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-16 md:pt-20 pb-12 font-poppins">
            <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-4 md:space-y-6">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-1">
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Proof Verification</h1>
                        <p className="text-slate-500 font-medium text-xs md:text-sm">Audit submitted work and release payouts</p>
                    </div>

                    <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 items-center justify-around md:justify-center gap-2 md:gap-6 px-4 md:px-6">
                        <div className="text-center">
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Awaiting</p>
                            <h2 className="text-lg md:text-xl font-black text-amber-500 tracking-tighter">
                                {isLoading ? "..." : (meta?.totalItems || 0)}
                            </h2>
                        </div>
                        <div className="w-px h-6 md:h-8 bg-slate-100"></div>
                        <div className="text-center">
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Limit</p>
                            <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tighter">{meta?.itemsPerPage || 15}</h2>
                        </div>
                    </div>
                </div>

                {/* --- FILTERS & SEARCH --- */}
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-3 md:p-4 flex flex-col xl:flex-row items-center justify-between gap-4">
                        {/* Horizontal Scrollable Tabs on Mobile */}
                        <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar pb-1 xl:pb-0">
                            {["PENDING", "APPROVED", "REJECTED", "ALL"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setFilter(tab === "ALL" ? "" : tab); setPage(1); }}
                                    className={cn(
                                        "px-4 md:px-5 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                        filter === (tab === "ALL" ? "" : tab) || (tab === "ALL" && filter === "")
                                            ? 'bg-slate-900 text-white shadow-md'
                                            : 'text-slate-400 hover:bg-slate-50'
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full xl:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                                placeholder="Search worker..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="h-10 md:h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-emerald-500 font-semibold text-sm"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* --- SUBMISSIONS LIST --- */}
                <div className="grid grid-cols-1 gap-4">
                    {isLoading ? (
                        [1, 2, 3].map(i => <SubmissionSkeleton key={i} />)
                    ) : submissions.map((proof: SubmittedJob) => (
                        <Card key={proof.id} className="bg-white border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all group">
                            <CardContent className="p-4 md:p-6">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 md:gap-6">

                                    {/* Worker Info */}
                                    <div className="flex items-center gap-3 md:gap-4 w-full lg:w-auto sm:min-w-55">
                                        <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-slate-50 shadow-sm shrink-0">
                                            <AvatarFallback className="bg-slate-100 font-black text-slate-400 uppercase text-xs">
                                                {proof.freelancer.user.avatar || proof.freelancer.user.fullName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <h4 className="text-sm font-black text-slate-800 leading-none mb-1 truncate">
                                                {proof.freelancer.user.email}
                                            </h4>
                                            <p className="text-[9px] md:text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                                                {proof.freelancer.user.fullName}
                                                {/* ID: {proof.id.slice(-8).toUpperCase()} */}
                                            </p>
                                        </div>
                                        <Badge className="ml-auto lg:hidden bg-slate-100 text-slate-500 border-none text-[8px] font-black uppercase">
                                            {proof.status}
                                        </Badge>
                                    </div>

                                    {/* Job Info */}
                                    <div className="grow w-full border-t border-slate-50 pt-3 lg:border-none lg:pt-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className="p-1 bg-slate-50 rounded-lg w-5 h-5 md:w-6 md:h-6 flex items-center justify-center shrink-0 [&_svg]:w-full [&_svg]:h-full"
                                                dangerouslySetInnerHTML={{ __html: proof.job.category.icon }}
                                            />
                                            <h3 className="text-xs md:text-sm font-bold text-slate-700 truncate">{proof.job.jobTitle}</h3>
                                        </div>
                                        <p className="text-[11px] md:text-xs text-slate-400 font-medium italic line-clamp-1">
                                            {proof.submissionNotes || "No worker comments"}
                                        </p>
                                    </div>

                                    {/* Action Area */}
                                    <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto justify-between border-t border-slate-50 pt-3 lg:border-none lg:pt-0">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 lg:flex-none h-10 rounded-xl border-slate-200 text-slate-600 font-bold px-4 gap-2 text-xs md:text-sm"
                                                >
                                                    <ImageIcon size={16} className="text-blue-500" /> View Proof
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent className="max-w-[95vw] sm:max-w-3xl p-0 overflow-hidden rounded-[24px] md:rounded-[32px] border-none font-poppins shadow-2xl">
                                                {/* MODAL HEADER */}
                                                <div className="bg-slate-900 p-4 md:p-6 flex items-center justify-between text-white">
                                                    <div className="flex items-center gap-3">
                                                        <ShieldAlert size={20} className="text-blue-400 hidden xs:block" />
                                                        <div className="flex flex-col">
                                                            <DialogTitle className="text-xs md:text-sm font-black uppercase tracking-widest leading-none">Proof Audit</DialogTitle>
                                                            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mt-1">Ref: {proof.id.toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-emerald-500 text-white border-none font-black uppercase px-3 py-1 rounded-full text-[8px] md:text-[10px]">{proof.status}</Badge>
                                                </div>

                                                {/* MODAL CONTEXT BAR */}
                                                <div className="bg-slate-50 border-b border-slate-100 px-4 md:px-8 py-3 md:py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                                    <div className="flex items-center gap-4 justify-between sm:justify-start">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Worker</p>
                                                            <h4 className="text-xs md:text-sm font-extrabold text-slate-800 truncate">{proof.freelancer.user.fullName}</h4>
                                                        </div>
                                                        <div className="w-px h-6 bg-slate-200 hidden sm:block" />
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Campaign</p>
                                                            <h4 className="text-xs md:text-sm font-extrabold text-slate-800 truncate">{proof.job.jobTitle}</h4>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost" size="sm" onClick={() => window.open(proof.job.targetLink, '_blank')}
                                                        className="text-blue-600 font-black text-[9px] md:text-[10px] uppercase h-8 rounded-lg border border-blue-100 w-full sm:w-fit sm:ml-auto"
                                                    >
                                                        Target Link <ExternalLink size={10} className="ml-1" />
                                                    </Button>
                                                </div>

                                                {/* IMAGE VIEWPORT */}
                                                <div className="bg-slate-100 p-4 md:p-8 flex justify-center items-center">
                                                    <div className="relative w-full aspect-video rounded-xl md:rounded-[24px] overflow-hidden shadow-2xl border-4 md:border-[6px] border-white group">
                                                        <Image src={proof.proofAttachment} alt="Proof" fill className="object-contain bg-slate-900" unoptimized />
                                                    </div>
                                                </div>

                                                {/* MODAL FOOTER */}
                                                <div className="p-4 md:p-10 bg-white space-y-6">
                                                    <div className="bg-slate-50/80 p-4 rounded-xl md:rounded-3xl border border-slate-100">
                                                        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Worker Note</p>
                                                        <p className="text-xs md:text-sm font-bold text-slate-700 italic leading-relaxed">
                                                            &ldquo;{proof.submissionNotes || "Empty submission notes."}&rdquo;
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                        <div className="flex gap-2">
                                                            <Badge variant="outline" className="text-slate-400 text-[8px] md:text-[10px]">Reward: ৳{proof.reward}</Badge>
                                                            <Badge variant="outline" className="text-slate-400 text-[8px] md:text-[10px]">{new Date(proof.submittedAt).toLocaleDateString()}</Badge>
                                                        </div>
                                                        <div className="flex gap-3 w-full sm:w-auto">
                                                            {proof.status !== "APPROVED" ?
                                                                <Button onClick={() => handleAudit(proof.id, "APPROVED", proof.freelancer.id)} className="flex-1 sm:flex-none bg-[#10B981] font-black h-12 md:h-14 rounded-xl px-6 md:px-10">Approve</Button>
                                                                : ""}
                                                            {proof.status !== "REJECTED" ?
                                                                <Button onClick={() => handleAudit(proof.id, "REJECTED", proof.freelancer.id)} variant="ghost" className="flex-1 sm:flex-none text-red-500 font-black h-12 md:h-14">Reject</Button> :
                                                                ""}

                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Mobile-Hidden Quick Actions */}
                                        <div className="hidden sm:flex items-center gap-2">
                                            {proof.status !== "APPROVED" ?
                                                <Button
                                                    onClick={() => handleAudit(proof.id, "APPROVED", proof.freelancer.id)}
                                                    size="icon"
                                                    className="h-10 w-10 md:h-11 md:w-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-md transition-all active:scale-90"
                                                >
                                                    <CheckCircle2 size={20} className="text-white" />
                                                </Button>
                                                : ""}

                                            {proof.status !== "REJECTED" ?
                                                <Button onClick={() => handleAudit(proof.id, 'REJECTED', proof.freelancer.id)} size="icon" variant="outline" className="h-10 w-10 md:h-11 md:w-11 rounded-xl border-slate-200 text-red-500 hover:bg-red-50 transition-all active:scale-90">
                                                    <XCircle size={20} />
                                                </Button> : ""}

                                        </div>

                                        {/* Status Only Visible on Desktop for quick glance */}
                                        <Badge className="hidden lg:flex bg-slate-50 text-slate-400 border-none text-[8px] font-black uppercase">
                                            {proof.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* --- PAGINATION --- */}
                <Pagination meta={meta} isLoading={isLoading} setPage={setPage} />
            </div>
        </div>
    );
}

