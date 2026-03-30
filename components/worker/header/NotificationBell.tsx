"use client"
import { Bell, CheckCircle2, MessageSquare, Briefcase } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Mock Data for Notifications
const notifications = [
    {
        id: 1,
        title: "Job Approved",
        description: "Your submission for 'Logo Design' has been approved.",
        time: "2 mins ago",
        icon: <CheckCircle2 className="text-emerald-500 w-4 h-4" />,
        unread: true
    },
    {
        id: 2,
        title: "New Message",
        description: "Client 'atb' sent you a private message.",
        time: "1 hour ago",
        icon: <MessageSquare className="text-blue-500 w-4 h-4" />,
        unread: true
    },
    {
        id: 3,
        title: "New Job Available",
        description: "A new microjob matching your skills was posted.",
        time: "5 hours ago",
        icon: <Briefcase className="text-amber-500 w-4 h-4" />,
        unread: false
    }
];

export default function NotificationBell() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer group outline-none">
                    {/* Icon color changes based on Mobile/Desktop background automatically */}
                    <Bell size={22} color="white" className="transition-transform group-hover:scale-110" />
                    
                    {/* The Red Badge (Hidden if count is 0) */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white md:border-accent-500 text-[10px] text-white flex items-center justify-center font-bold">
                        2
                    </span>
                </div>
            </DropdownMenuTrigger>

            {/* Notification Dropdown Panel */}
            <DropdownMenuContent align="end" className="w-80 p-0 font-poppins shadow-2xl rounded-xl border-slate-100 mt-2">
                <div className="p-4 flex items-center justify-between">
                    <DropdownMenuLabel className="text-lg font-bold text-slate-800 p-0">
                        Notifications
                    </DropdownMenuLabel>
                    <button className="text-xs text-accent-500 font-bold hover:underline">
                        Mark all as read
                    </button>
                </div>
                
                <DropdownMenuSeparator className="m-0" />

                {/* Scrollable List Area */}
                <div className="max-h-87.5 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <DropdownMenuItem 
                                key={notif.id} 
                                className={`flex items-start gap-3 p-4 cursor-pointer focus:bg-slate-50 border-b border-slate-50 last:border-0 ${notif.unread ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className="mt-1 bg-white p-2 rounded-full shadow-sm">
                                    {notif.icon}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center w-full">
                                        <p className={`text-sm leading-none ${notif.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                            {notif.title}
                                        </p>
                                        {notif.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                    </div>
                                    <p className="text-xs text-slate-500 leading-tight">
                                        {notif.description}
                                    </p>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {notif.time}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm">No new notifications</p>
                        </div>
                    )}
                </div>

                <DropdownMenuSeparator className="m-0" />
                
                <div className="p-2">
                    <Button variant="ghost" className="w-full text-accent-500 font-bold text-sm hover:bg-accent-50 rounded-lg">
                        See all notifications
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}