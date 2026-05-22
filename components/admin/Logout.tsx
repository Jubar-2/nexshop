import { ChevronRight, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import React from "react";
import { signOut } from "next-auth/react";

type subItemType = {
    label: string,
    href: string
}

type NavItemType = {
    icon: ReactNode,
    label: string,
    isCollapsed: boolean,
    active?: boolean,
    subItems?: subItemType[],
    href?: string
}

function Logout({ icon, label, isCollapsed, active = false, subItems = [], href = "#" }: NavItemType) {


    // Close sub-menus when sidebar collapses

    // Reusable UI for the row content to avoid duplication
   

    return (
        <div className="flex flex-col gap-1">
            <div
                onClick={
                    () => signOut({
                        callbackUrl: "/admin/auth",
                    })
                }
                className={cn(
                    "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group",
                    active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50",
                    isCollapsed ? "justify-center" : ""
                )}
            >
                <div className="flex items-center gap-4 overflow-hidden">
                    <span className={cn("shrink-0 transition-colors", active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")}>
                        {icon}
                    </span>
                    {!isCollapsed && (
                        <span className={cn("text-sm font-bold whitespace-nowrap", active ? "text-blue-600" : "text-slate-500 group-hover:text-slate-800")}>
                            {label}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Logout