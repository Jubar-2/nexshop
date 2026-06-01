import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, Edit3, MoreHorizontal, PauseCircle, PlayCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';
import { Job } from '@/types/jobs';

type JobStatus = "ACTIVE" | "INACTIVE";

type UpdateJobPayload = {
    id: string;
    status: JobStatus;
};

export default function JobRow({ job }: { job: Job }) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: UpdateJobPayload) => {
            const response = await axios.patch(
                "/api/admin/jobs/change-status",
                payload
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });

            toast.success("Withdrawal Request Sent", {
                description: `Paused is now pending review.`,
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

    function handelPaused() {
        mutate(
            {
                id: job.id,
                status: "INACTIVE"
            }
        )
    }

    function handelReActive() {
        mutate(
            {
                id: job.id,
                status: "ACTIVE"
            }
        )
    }

    return (
        <tr className="hover:bg-slate-50/50 transition-colors group">
            <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                    {/* Render raw SVG from payload */}
                    <div
                        className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 p-2 overflow-hidden [&_svg]:w-full [&_svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: job.category.icon }}
                    />
                    <div>
                        <p className="text-sm font-black text-slate-800 leading-none mb-1">{job.jobTitle}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                            {job.category.name} • {job.subCategory.name}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-8 py-6 min-w-50">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                        <span>Campaign Running</span>
                        <span>{job.workerRequired} Required</span>
                    </div>
                    {/* Map actual completion data if available, otherwise 0 */}
                    <Progress value={job.submissionCount * job.workerRequired / 100} className="h-1.5 bg-slate-100 [&>div]:bg-blue-500" />
                </div>
            </td>

            <td className="px-8 py-6 text-center">
                <span className="text-sm font-black text-slate-700 tracking-tighter">
                    ৳{Number(job.reward).toFixed(2)}
                </span>
            </td>

            <td className="px-8 py-6 text-center">
                <Badge className={`border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg mx-auto ${job.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {job.status}
                </Badge>
            </td>

            <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button
                        onClick={job.status === 'ACTIVE' ? handelPaused : handelReActive}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-500">
                        {job.status === 'ACTIVE' ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                    </Button>
                    <Link href={`/admin/jobs/update/${job.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                            <Edit3 size={18} />
                        </Button>
                    </Link>
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400"><MoreHorizontal size={18} /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl font-poppins shadow-2xl border-slate-100">
                            <DropdownMenuItem className="font-bold text-xs">Edit Campaign</DropdownMenuItem>
                            <DropdownMenuItem className="font-bold text-xs text-red-500">Delete Job</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                </div>
            </td>
        </tr>
    );
}