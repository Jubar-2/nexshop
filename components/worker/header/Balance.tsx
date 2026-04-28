"use client"


import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function Balance() {
    
    return (
        < DropdownMenu >
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-1 md:gap-2 cursor-pointer group">
                    <span className="font-bold text-white font-poppins">৳0.00</span>
                    <ChevronDown size={14} className="text-white" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Deposit</DropdownMenuItem>
                <DropdownMenuItem>Withdraw</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}