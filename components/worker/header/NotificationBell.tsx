"use client"
import { Bell, MessageSquare, BellOff } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useGetNotifications, useGetUnreadCount, useMarkAllAsRead, useNotifications } from '@/hooks/use-notifications';
import { formatJobTime } from '@/hooks/utility';
import { NotificationTypes } from '@/types/notification';
import Link from 'next/link';
import NotificationSkeleton from './NotificationSkeleton';

export default function NotificationBell() {
    // useNotifications(); // Handles real-time updates

    const { data: unreadCount, isLoading: isLoadingCount } = useGetUnreadCount();
    const { data: notifications, isLoading: isLoadingNotifs } = useGetNotifications(5);

    const { mutate: markAllAsRead } = useMarkAllAsRead();

    const handleMarkAllAsRead = () => {
        if (unreadCount?.count > 0) {
            markAllAsRead();
        }
    }

    return (
        <DropdownMenu onOpenChange={handleMarkAllAsRead}>
            <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer group outline-none">
                    <Bell size={22} color="white" className="transition-transform group-hover:scale-110" />

                    {/* Only show badge if NOT loading and count > 0 */}
                    {!isLoadingCount && unreadCount?.count > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold animate-in zoom-in">
                            {unreadCount?.count}
                        </span>
                    )}
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-0 font-poppins shadow-2xl rounded-xl border-slate-100 mt-2">
                <div className="p-4 flex items-center justify-between">
                    <DropdownMenuLabel className="text-lg font-bold text-slate-800 p-0">
                        Notifications
                    </DropdownMenuLabel>
                    {!isLoadingNotifs && notifications?.data?.length > 0 && (
                        <button className="text-xs text-accent-500 font-bold hover:underline">
                            Mark all as read
                        </button>
                    )}
                </div>

                <DropdownMenuSeparator className="m-0" />

                <div className="max-h-87.5 overflow-y-auto">
                    {isLoadingNotifs ? (
                        /* --- SHOW 4 SKELETONS WHILE LOADING --- */
                        <>
                            <NotificationSkeleton />
                            <NotificationSkeleton />
                            <NotificationSkeleton />
                            <NotificationSkeleton />
                        </>
                    ) : notifications?.length > 0 ? (
                        notifications.map((notif: NotificationTypes) => (
                            <DropdownMenuItem
                                key={notif.id}
                                className={`flex items-start gap-3 p-4 cursor-pointer focus:bg-slate-50 border-b border-slate-50 last:border-0 ${!notif.read ? 'bg-blue-50/20' : ''}`}
                            >
                                <div className="mt-1 bg-slate-100 p-2 rounded-full shrink-0">
                                    {/* Dynamically render icon based on type if available */}
                                    <MessageSquare size={14} className="text-slate-500" />
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex justify-between items-start w-full gap-2">
                                        <p className={`text-sm leading-tight ${!notif.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                            {notif.title}
                                        </p>
                                        {!notif.read && <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full shrink-0"></div>}
                                    </div>
                                    <p className="text-xs text-slate-500 leading-tight line-clamp-2">
                                        {notif.description}
                                    </p>
                                    <span className="text-[10px] text-slate-400 font-medium mt-1">
                                        {formatJobTime(notif.createdAt)}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        /* --- EMPTY STATE --- */
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                            <BellOff size={32} strokeWidth={1} className="mb-2 opacity-20" />
                            <p className="text-sm font-medium">No notifications yet</p>
                        </div>
                    )}
                </div>

                <DropdownMenuSeparator className="m-0" />

                <div className="p-2">
                    <Link href="/dashboard/notification">
                        <Button variant="ghost" className="w-full text-accent-500 font-bold text-sm hover:bg-accent-50 rounded-lg h-10">
                            See all notifications
                        </Button>
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}