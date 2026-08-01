"use client"

import Link from 'next/link';
import { Bell } from 'lucide-react'
import { useGetUnreadCount } from '@/hooks/use-notifications';

export function NotificationBellMobile() {
    const { data: unreadCount, isLoading: isLoadingCount } = useGetUnreadCount();

    return (
        <Link href="/dashboard/notification">
            <div className="relative cursor-pointer group outline-none">
                {/* Icon color changes based on Mobile/Desktop background automatically */}
                <Bell size={22} color="white" />

                {/* The Red Badge (Hidden if count is 0) */}
                {!isLoadingCount && unreadCount?.count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white md:border-accent-500 text-[10px] text-white flex items-center justify-center font-bold">
                        {unreadCount?.count}
                    </span>
                )}
            </div>
        </Link>
    )
}