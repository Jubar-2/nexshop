"use client"

import React, { useState } from 'react'
import {
    LayoutGrid,
    Search,
    ClipboardList,
    User,
    RefreshCw,
    Banknote,
    FileText,
    HelpCircle,
    Headphones,
    Settings,
    LogOut,
    Smile,
    TextAlignJustify,
    AlertCircle,
} from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { useGetProfile } from '@/hooks/use-freelancer'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import NavItem from './NavItem'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function MobileSidebar() {
    const { data, isLoading, isError } = useGetProfile();
    
    // 1. Create a state to control the drawer
    const [open, setOpen] = useState(false);

    // 2. Helper function to close the drawer
    const closeDrawer = () => setOpen(false);

    if (isLoading) {
        return (
            <button className="cursor-pointer">
                <TextAlignJustify color="white" size={28} />
            </button>
        );
    }

    if (isError) {
        return (
            <span className="text-red-400 flex items-center gap-1 text-xs">
                <AlertCircle size={12} /> --.--
            </span>
        );
    }

    const email = data?.email;

    return (
        /* 3. Pass open and onOpenChange to the Sheet */
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="cursor-pointer">
                    <TextAlignJustify color="white" size={28} />
                </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-70 p-0 bg-[#F8F9FA] border-l-0 overflow-y-auto font-sans">
                <SheetHeader className="sr-only">
                    <SheetTitle>Mobile Sidebar</SheetTitle>
                </SheetHeader>

                <div className="p-6 flex items-center gap-3">
                    {/* <div className="bg-[#4D5E66] p-1.5 rounded-full">
                        <Smile size={24} className="text-white" />
                    </div> */}
                    <Avatar className="h-8 w-8 border-4 border-slate-50 shadow-md">
                        <AvatarImage
                            src={data?.avatar} />
                        <AvatarFallback className="text-3xl font-bold bg-slate-100 text-slate-500">JR</AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-slate-600 text-sm truncate">{email}</span>
                </div>

                <div className="flex flex-col gap-6 px-6 pb-10">
                    
                    {/* NAVIGATION */}
                    <section className="space-y-3">
                        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Navigation</h3>
                        <div className="space-y-1">
                            {/* 4. Add onClick={closeDrawer} to all Links */}
                            <Link href="/dashboard" onClick={closeDrawer}>
                                <NavItem icon={<LayoutGrid size={20} />} label="Dashboard" />
                            </Link>
                            <Link href="/dashboard/profile" onClick={closeDrawer}>
                                <NavItem icon={<User size={20} />} label="My Profile" />
                            </Link>
                            <Link href="/dashboard/jobs" onClick={closeDrawer}>
                                <NavItem icon={<Search size={20} />} label="Find Jobs" />
                            </Link>
                            {/* <Link href="/dashboard/jobs/submitted" onClick={closeDrawer}>
                                <NavItem icon={<ClipboardList size={20} />} label="Submitted Jobs" />
                            </Link> */}                             
                        </div>
                    </section>

                    {/* WALLET */}
                    <section className="space-y-3">
                        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Wallet</h3>
                        <div className="space-y-1">                            
                            <Link href="/dashboard/withdraw" onClick={closeDrawer}>
                                <NavItem icon={<Banknote size={20} />} label="Withdraw" />
                            </Link>
                            <Link href="/dashboard/statement" onClick={closeDrawer}>
                                <NavItem icon={<FileText size={20} />} label="Wallet Statement" />
                            </Link>
                        </div>
                    </section>

                    {/* HELP & SUPPORT */}
                    {/* <section className="space-y-3">
                        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Help & Support</h3>
                        <div className="space-y-1">
                            <Link href="/faq" onClick={closeDrawer}>
                                <NavItem icon={<HelpCircle size={20} />} label="FAQ" />
                            </Link>
                            <Link href="/support" onClick={closeDrawer}>
                                <NavItem icon={<Headphones size={20} />} label="Contact Support" />
                            </Link>
                        </div>
                    </section> */}

                    {/* ACCOUNT */}
                    <section className="space-y-3">
                        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Account</h3>
                        <div className="space-y-1">
                            <Link href="/dashboard/account-settings" onClick={closeDrawer}>
                                <NavItem icon={<Settings size={20} />} label="Settings" />
                            </Link>
                            <NavItem 
                                icon={<LogOut size={20} />} 
                                label="Logout"
                                onClick={() => {
                                    closeDrawer(); // Close before signing out
                                    signOut({ callbackUrl: "/signin" });
                                }}
                            />
                        </div>
                    </section>

                </div>
            </SheetContent>
        </Sheet>
    )
}