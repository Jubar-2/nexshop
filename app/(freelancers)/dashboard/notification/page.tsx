"use client"

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer'; // Detects scroll bottom
import {
    ArrowLeft, MoreHorizontal,
    BellOff, Loader2,
    MessageSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from 'next/link';
import { NotificationTypes } from '@/types/notification';
import { formatJobTime } from '@/hooks/utility';
import { useNotificationsInfinite } from '@/hooks/use-notifications';
import NotificationSkeleton from '@/components/worker/notification/NotificationSkeleton';

export default function NotificationPage() {
    // --- INFINITE QUERY HOOK ---
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotificationsInfinite();

    // --- INTERSECTION OBSERVER SETUP ---
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="min-h-screen bg-white font-poppins md:max-w-4xl md:mx-auto md:px-4 md:space-y-6 mt-14">
            {/* HEADER */}
            <header className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between mt-14 md:max-w-4xl md:top-2">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard"><ArrowLeft className="w-6 h-6 text-slate-700" /></Link>
                    <h1 className="text-xl font-extrabold text-slate-900">Notifications</h1>
                </div>
                {/* <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 h-9 w-9">
                    <Search className="w-5 h-5 text-slate-700" />
                </Button> */}
            </header>

            <div className="pt-20 pb-10">
                {isLoading ? (
                    [...Array(6)].map((_, i) => <NotificationSkeleton key={i} />)
                ) : (
                    <div className="flex flex-col">
                        {/* --- 3. MAPPING THROUGH PAGES --- */}
                        {data?.pages.map((page, pageIndex) => (
                            <div key={pageIndex}>
                                {page.data.data.map((item: NotificationTypes) => {

                                    return (
                                        <div
                                            key={item.id}
                                            className={`flex items-start gap-4 px-4 py-5 border-b border-slate-50 active:bg-slate-50 ${!item.read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="relative shrink-0">
                                                <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                                                    <AvatarFallback className="bg-slate-100 font-black text-slate-400 uppercase">
                                                        <MessageSquare size={18} className="text-slate-500" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                {/* <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${config.bg} border-2 border-white flex items-center justify-center text-white`}>
                                                    {config.icon}
                                                </div> */}
                                            </div>

                                            <div className="grow">
                                                <p className={`text-sm leading-[1.4] ${!item.read ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                                    {item.description}
                                                </p>
                                                <span className="text-[11px] mt-1 text-slate-400 font-bold uppercase tracking-tighter">
                                                    {formatJobTime(item.createdAt)}
                                                </span>
                                            </div>

                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                                                <MoreHorizontal size={20} />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* --- 4. THE SENTINEL (Target for Scroll) --- */}
                        <div ref={ref} className="py-10 flex flex-col items-center justify-center">
                            {isFetchingNextPage ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading more...</p>
                                </div>
                            ) : hasNextPage ? (
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Scroll for more</p>
                            ) : (
                                <div className="flex flex-col items-center gap-2 opacity-40">
                                    <BellOff size={24} className="text-slate-300" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End of notifications</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}