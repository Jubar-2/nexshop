"use client"

import { 
  ArrowLeft, 
  Search, 
  Settings, 
  MoreHorizontal, 
  CheckCircle2, 
  MessageSquare, 
  DollarSign,
  Clock,
  Bell
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';

// Mock Notification Data
const notifications = [
    {
        id: 1,
        type: 'job_approved',
        user: { name: 'Admin', image: '' },
        content: 'Your submission for "Mobile App UI Design" has been approved.',
        time: 'Just now',
        unread: true,
        icon: <CheckCircle2 className="w-3 h-3 text-white" />,
        iconBg: 'bg-emerald-500'
    },
    {
        id: 2,
        type: 'payment',
        user: { name: 'Finance Team', image: '' },
        content: 'Payment of ৳500.00 has been added to your wallet.',
        time: '45 mins ago',
        unread: true,
        icon: <DollarSign className="w-3 h-3 text-white" />,
        iconBg: 'bg-blue-500'
    },
    {
        id: 3,
        type: 'message',
        user: { name: 'atb_worker', image: 'https://github.com/shadcn.png' },
        content: 'atb_worker replied to your comment on the task.',
        time: '2 hours ago',
        unread: false,
        icon: <MessageSquare className="w-3 h-3 text-white" />,
        iconBg: 'bg-purple-500'
    },
    {
        id: 4,
        type: 'system',
        user: { name: 'NexShop', image: '' },
        content: 'System Maintenance scheduled for tonight at 12:00 AM.',
        time: 'Yesterday',
        unread: false,
        icon: <Clock className="w-3 h-3 text-white" />,
        iconBg: 'bg-slate-500'
    },
];

export default function Notification() {
    return (
        <div className="min-h-screen bg-white font-poppins md:hidden mt-16">
            {/* --- TOP STICKY HEADER --- */}
            <header className="fixed top-16 w-full z-50 bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 h-9 w-9">
                        <Search className="w-5 h-5 text-slate-700" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 h-9 w-9">
                        <Settings className="w-5 h-5 text-slate-700" />
                    </Button>
                </div>
            </header>

            {/* --- FILTER TABS --- */}
            <div className="flex items-center gap-2 px-4 py-3 mt-2">
                <Button size="sm" className="rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 font-bold px-4 border-none shadow-none">
                    All
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full text-slate-600 font-bold px-4">
                    Unread
                </Button>
            </div>

            {/* --- NOTIFICATION LIST --- */}
            <div className="pb-20">
                <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">New</span>
                    <button className="text-xs text-blue-600 font-bold">Mark all as read</button>
                </div>

                <div className="flex flex-col">
                    {notifications.map((item) => (
                        <div 
                            key={item.id} 
                            className={`flex items-start gap-3 px-4 py-4 transition-colors active:bg-slate-100 ${item.unread ? 'bg-blue-50/50' : ''}`}
                        >
                            {/* Left Side: Avatar with Icon Badge */}
                            <div className="relative shrink-0">
                                <Avatar className="w-16 h-16 border border-slate-100 shadow-sm">
                                    <AvatarImage src={item.user.image} />
                                    <AvatarFallback className="bg-slate-200 font-bold text-slate-500">
                                        {item.user.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Small Action Icon Badge */}
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${item.iconBg} border-2 border-white flex items-center justify-center shadow-sm`}>
                                    {item.icon}
                                </div>
                            </div>

                            {/* Middle Side: Content */}
                            <div className="grow flex flex-col gap-0.5">
                                <p className="text-sm text-slate-800 leading-[1.3]">
                                    <span className="font-bold text-black">{item.user.name}</span> {item.content}
                                </p>
                                <span className={`text-[11px] mt-1 ${item.unread ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'}`}>
                                    {item.time}
                                </span>
                            </div>

                            {/* Right Side: Options & Unread Dot */}
                            <div className="flex flex-col items-center justify-between h-full gap-4">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                    <MoreHorizontal className="w-5 h-5" />
                                </Button>
                                {item.unread && (
                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Earlier Section */}
                <div className="px-4 py-4">
                    <span className="text-sm font-bold text-slate-900">Earlier</span>
                </div>
                <div className="px-10 py-10 text-center flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Bell className="text-slate-300 w-8 h-8" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">No more notifications</p>
                </div>
            </div>

          
        </div>
    );
}