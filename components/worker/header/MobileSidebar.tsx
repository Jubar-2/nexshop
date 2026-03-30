"use client"

import React from 'react'
import {
    LayoutGrid,
    Search,
    ClipboardList,
    RefreshCw,
    Banknote,
    FileText,
    Smartphone,
    HelpCircle,
    ShieldCheck,
    Headphones,
    Settings,
    LogOut,
    Smile,
    TextAlignJustify
} from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="cursor-pointer">
                    <TextAlignJustify color="white" size={28} />
                </button>
            </SheetTrigger>

            {/* side="right" matches your direction="right" requirement */}
            <SheetContent side="right" className="w-70 p-0 bg-[#F8F9FA] border-l-0 overflow-y-auto font-sans">

                {/* --- USER PROFILE HEADER --- */}
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-[#4D5E66] p-1.5 rounded-full">
                        <Smile size={24} className="text-white" />
                    </div>
                    <span className="font-bold text-slate-600 text-sm">mdjubairrahman</span>
                </div>

                <div className="flex flex-col gap-6 px-6 pb-10">

                    {/* --- NAVIGATION SECTION --- */}
                    <section className="space-y-3">
                        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Navigation</h3>
                        <div className="space-y-1">
                            <NavItem icon={<LayoutGrid size={20} />} label="Dashboard" active />
                            <NavItem icon={<Search size={20} />} label="Find Jobs" />
                            <NavItem icon={<ClipboardList size={20} />} label="Submitted Jobs" />
                        </div>
                    </section>

                    {/* --- WALLET SECTION --- */}
                    <section className="space-y-3">
                        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Wallet</h3>
                        <div className="space-y-1">
                            <NavItem icon={<RefreshCw size={20} />} label="Transfer to Deposit" />
                            <NavItem icon={<Banknote size={20} />} label="Withdraw" />
                            <NavItem icon={<FileText size={20} />} label="Wallet Statement" />
                        </div>
                    </section>

                    {/* --- HELP & SUPPORT SECTION --- */}
                    <section className="space-y-3">
                        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Help & Support</h3>
                        <div className="space-y-1">
                            <NavItem icon={<Smartphone size={20} />} label="Download App" />
                            <NavItem icon={<HelpCircle size={20} />} label="FAQ" />
                            <NavItem icon={<ShieldCheck size={20} />} label="Safety Tips" />
                            <NavItem icon={<Headphones size={20} />} label="Contact Support" />
                        </div>
                    </section>

                    {/* --- ACCOUNT SECTION --- */}
                    <section className="space-y-3">
                        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Account</h3>
                        <div className="space-y-1">
                            <NavItem icon={<Settings size={20} />} label="Settings" />
                            <NavItem icon={<LogOut size={20} />} label="Logout" />
                        </div>
                    </section>

                </div>
            </SheetContent>
        </Sheet>
    )
}

// Reusable Navigation Item Component
function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 py-2 cursor-pointer transition-colors group`}>
            <span className={`${active ? 'text-[#10B981]' : 'text-slate-400'} group-hover:text-[#10B981]`}>
                {icon}
            </span>
            <span className={`text-[15px] font-medium ${active ? 'text-[#10B981]' : 'text-slate-500'} group-hover:text-[#10B981]`}>
                {label}
            </span>
        </div>
    )
}