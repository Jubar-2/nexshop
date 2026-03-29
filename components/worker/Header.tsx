import {
    Briefcase,
    ChevronDown,
    Bell,
    Smile
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import Logo from '@/public/image/logo.png';

export default function Header() {
    return (
        <header className="w-full bg-accent-500 border-b border-gray-100 px-4 h-16 flex items-center justify-between font-sans">

            {/* LEFT SECTION: Logo & Main Nav */}
            <div className="flex items-center gap-8">
                {/* Logo */}
                <div className="flex items-center gap-1 cursor-pointer">
                    <div className="bg-white rounded-full p-1.5 flex items-center justify-center w-10.5 h-10.5">
                        <Image src={Logo} alt="Logo" width={24} height={24} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-xl font-bold text-white tracking-tight font-poppins italic lowercase">NEXSHOP</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-2">
                    {/* <Button variant="ghost" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-medium gap-2">
                        <LayoutGrid size={18} />
                        Dash
                    </Button> */}

                    <DropdownMenu>
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
                    </DropdownMenu>
                </nav>
            </div>

            {/* RIGHT SECTION: User Actions */}
            <div className="flex items-center gap-5">

                {/* Wallet Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <span className="font-bold text-white font-poppins">৳0.00</span>
                            <ChevronDown size={14} className="text-white" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Deposit</DropdownMenuItem>
                        <DropdownMenuItem>Withdraw</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Notification Icon */}
                <div className="relative cursor-pointer text-gray-400 hover:text-gray-600">
                    <Bell size={20} color="white" />
                    {/* Red dot badge if needed */}
                    {/* <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span> */}
                </div>


                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <div className="bg-[#4D5E66] p-1 rounded-full">
                                <Smile size={20} className="text-white" />
                            </div>
                            <span className="text-white font-medium text-sm max-w-25 truncate">mdjubairra...</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>My Profile</DropdownMenuItem>
                        <DropdownMenuItem>Account Settings</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

