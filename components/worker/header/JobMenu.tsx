"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Briefcase, ChevronDown } from "lucide-react";


export default function JobMenu() {
    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-gray-500 hover:bg-primary-500 gap-2 font-medium data-[state=open]:bg-primary-500
                            data-[state=open]:text-white">
                <Briefcase size={20} className="text-white" />
                <span className="text-white font-poppins font-medium text-[14px]">Jobs</span>
                <ChevronDown size={14} className="text-white" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
            <DropdownMenuItem>Available Jobs</DropdownMenuItem>
            <DropdownMenuItem>My Applications</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>)
}