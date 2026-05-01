"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProfile } from "@/hooks/use-freelancer";
import { cn } from "@/lib/utils";
import { AlertCircle, ChevronDown, RefreshCcw, Smile } from "lucide-react";

export default function Menu() {
    const { data, isLoading, isError, refetch } = useGetProfile();

    // Helper: Shared container class to ensure ZLS (Zero Layout Shift)
    const containerClasses = "p-6 flex items-center gap-3 w-full border-b border-slate-50";

    // --- LOADING STATE ---
    // The loading state now has the exact same padding/gap as the success state
    if (isLoading) {
        return (
            <div className={containerClasses}>
                <div className="bg-slate-200 p-1.5 rounded-full animate-pulse">
                    <div className="size-6 rounded-full bg-slate-300" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                    <Skeleton className="h-3 w-24 bg-slate-200" />
                </div>
            </div>
        );
    }

    // --- ERROR STATE ---
    // Instead of a tiny span, we maintain the sidebar structure so it doesn't look broken
    if (isError) {
        return (
            <div className={cn(containerClasses, "bg-red-50/30")}>
                <div className="bg-red-100 p-1.5 rounded-full text-red-600">
                    <AlertCircle size={20} />
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Error</span>
                    <button
                        onClick={() => refetch()}
                        className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors"
                    >
                        <RefreshCcw size={10} /> Retry
                    </button>
                </div>
            </div>
        );
    }

    // --- SUCCESS STATE ---
    const email = data?.email;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="bg-[#4D5E66] p-1 rounded-full">
                        <Smile size={20} className="text-white" />
                    </div>
                    <span className="text-white font-medium text-sm max-w-25 truncate">{email}</span>
                    <ChevronDown size={14} className="text-white" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>My Profile</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}