"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetJob } from "@/hooks/use-jobs";
import { AlertTriangle, ExternalLink, Link as LinkIcon, ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";

function JobDescription() {
    const params = useParams();
    const jobId = params?.id as string;
    const { data, isLoading } = useGetJob(jobId);

    // --- LOADING STATE (SKELETON) ---
    if (isLoading) {
        return (
            <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-md bg-slate-100" />
                        <Skeleton className="h-4 w-40 bg-slate-200 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    {/* Description Box Skeleton */}
                    <Skeleton className="h-24 w-full rounded-2xl bg-slate-50" />

                    {/* Instruction Steps Skeleton */}
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-9 w-9 rounded-xl bg-slate-100 shrink-0" />
                                <div className="space-y-2 grow">
                                    <Skeleton className="h-4 w-1/2 bg-slate-100 rounded-md" />
                                    <Skeleton className="h-3 w-1/3 bg-slate-50 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Warning Box Skeleton */}
                    <Skeleton className="h-16 w-full rounded-2xl bg-amber-50/50" />
                </CardContent>
            </Card>
        );
    }


    return (
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden animate-in fade-in duration-500">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                    <LinkIcon className="text-blue-500" size={18} /> Task Workflow & Instructions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">

                {/* --- THE DESCRIPTION BOX --- */}
                <div className="bg-[#F0F2F5] p-6 rounded-2xl border border-slate-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                        <ShieldCheck size={80} />
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed italic whitespace-pre-wrap relative z-10">
                        {data?.description || "No specific description provided by the admin."}
                    </p>
                </div>

                {/* --- DYNAMIC INSTRUCTIONS --- */}
                <div className="space-y-10 py-10">
                    {/* <InstructionItem 
                        step="1" 
                        text="Visit the Target Link" 
                        subtext="Click the primary action button to open the task URL in a new tab." 
                    /> */}

                    <div className="ml-14">
                        <Button
                            onClick={() => window.open(data?.targetLink, '_blank')}
                            className="bg-slate-900 hover:bg-black text-white font-black h-14 rounded-2xl px-10 flex gap-3 transition-all active:scale-95 shadow-lg group"
                        >
                            Open Task URL <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                        <p className="text-[10px] text-blue-500 font-bold mt-4 underline italic cursor-pointer truncate max-w-xs opacity-70">
                            {data?.targetLink}
                        </p>
                    </div>

                    {/* <InstructionItem 
                        step="2" 
                        text="Perform the Required Action" 
                        subtext="Ensure you follow the steps mentioned in the description box above exactly as requested." 
                    />

                    <InstructionItem 
                        step="3" 
                        text="Capture & Submit Evidence" 
                        subtext="Take a screenshot of the completed action and upload it in the section below." 
                    /> */}
                </div>

                {/* --- SAFETY WARNING --- */}
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-5">
                    <div className="bg-white p-2 rounded-xl shadow-sm h-fit">
                        <AlertTriangle className="text-amber-500" size={24} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-amber-900 text-sm uppercase tracking-tight">Royal Audit Policy</h4>
                        <p className="text-xs text-amber-700 leading-relaxed font-medium uppercase tracking-tighter">
                            Note: Do not delete your interaction (Like/Sub/Follow) after payment. Our automated crawler verifies active participants weekly. Violations lead to permanent bans.
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}

// --- SUB-COMPONENT: Instruction Item ---
const InstructionItem = ({ step, text, subtext }: { step: string, text: string, subtext: string }) => (
    <div className="flex items-start gap-5">
        <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0 mt-0.5">
            {step}
        </div>
        <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-lg leading-none">{text}</h4>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{subtext}</p>
        </div>
    </div>
);

export default JobDescription;