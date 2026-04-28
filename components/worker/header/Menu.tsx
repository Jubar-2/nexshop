"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Smile } from "lucide-react";

export default function Menu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="bg-[#4D5E66] p-1 rounded-full">
                        <Smile size={20} className="text-white" />
                    </div>
                    <span className="text-white font-medium text-sm max-w-25 truncate">mdjubairra...</span>
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