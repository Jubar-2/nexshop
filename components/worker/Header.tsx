import { Bell } from 'lucide-react'
import Image from 'next/image';
import Logo from '@/public/image/logo.png';
import NotificationBell from './header/NotificationBell';
import Link from 'next/link';
import MobileSidebar from './header/MobileSidebar';
import JobMenu from './header/JobMenu';
import Menu from './header/Menu';
import BalanceMenu from './header/BalanceMenu';

export default function Header() {
    return (
        <header className="w-full bg-accent-500 border-b border-gray-100 px-4 h-16 flex items-center justify-between font-sans fixed top-0 z-50">

            {/* LEFT SECTION: Logo & Main Nav */}
            <div className="flex items-center gap-8">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-1 cursor-pointer">
                    <div className="bg-white rounded-full p-1.5 flex items-center justify-center w-10.5 h-10.5">
                        <Image src={Logo} alt="Logo" width={24} height={24} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-xl font-bold text-white tracking-tight font-poppins italic lowercase">NEXSHOP</span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="md:flex items-center gap-2 hidden">
                    {/* <Button variant="ghost" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-medium gap-2">
                        <LayoutGrid size={18} />
                        Dash
                    </Button> */}
                    <JobMenu />
                </nav>
            </div>

            {/* RIGHT SECTION: User Actions */}
            <div className="flex items-center gap-4 md:gap-5">

                <BalanceMenu />

                {/* Notification Icon */}
                <div className="relative cursor-pointer text-gray-400 hover:text-gray-600 hidden md:flex">
                    <NotificationBell />
                </div>

                <div className="relative cursor-pointer text-gray-400 hover:text-gray-600 flex1 md:hidden">
                    <Link href="/dashboard/notification">
                        <div className="relative cursor-pointer group outline-none">
                            {/* Icon color changes based on Mobile/Desktop background automatically */}
                            <Bell size={22} color="white" />
                            {/* The Red Badge (Hidden if count is 0) */}
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white md:border-accent-500 text-[10px] text-white flex items-center justify-center font-bold">
                                2
                            </span>
                        </div>
                    </Link>
                </div>

                {/* User Profile Dropdown */}
                <div className="hidden md:flex">
                    <Menu />
                </div>

                <div className="flex md:hidden">
                    <MobileSidebar />
                </div>
            </div>
        </header>
    )
}

