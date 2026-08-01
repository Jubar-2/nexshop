"use client";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

interface Notification {
    type: string;
    title: string;
    message: string;
    timestamp: string;
}

export function useNotifications() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const eventSource = new EventSource("/api/freelancer/notifications/sse");

        eventSource.addEventListener("connected", () => {
            console.log("[SSE] Connected");
        });

        eventSource.addEventListener("notification", (e) => {
            try {

                const notification: Notification = JSON.parse(e.data);
                // console.log("[SSE] Notification received:", notification);

                queryClient.setQueryData(["get-unread-count"], (oldData: { count: number } | undefined) => {
                    if (oldData) {
                        return { ...oldData, count: oldData.count + 1 };
                    }
                    return { count: 1 };
                });


                queryClient.setQueryData(["get-notifications"], (oldData: Notification[] | undefined) => {
                    if (oldData) {
                        return [notification, ...oldData];
                    }
                    return [notification];
                });


                // if (notification.type === "MEMBERSHIP_APPROVED") {
                //     toast.success(notification.title, {
                //         description: notification.message,
                //         duration: 8000,
                //     });
                // }
            } catch {
                console.error("[SSE] Failed to parse notification");
            }
        });

        eventSource.onerror = () => {
            console.warn("[SSE] Reconnecting...");
        };

        return () => eventSource.close();
    }, []);
}

export const useGetUnreadCount = () => {
    return useQuery({
        queryKey: ["get-unread-count"],
        queryFn: async () => {
            const { data } = await axios.get("/api/freelancer/notifications/unread-count");
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useGetNotifications = (limit: number) => {
    return useQuery({
        queryKey: ["get-notifications", limit],
        queryFn: async () => {
            const { data } = await axios.get(`/api/freelancer/notifications?limit=${limit}`);
            return data.data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await axios.patch("/api/freelancer/notifications/mark-all-read");
            return response.data;
        },
        onSuccess: () => {
            // Invalidate the notifications and unread count queries to refetch the updated data
            queryClient.setQueryData(["get-unread-count"], () => {
                return { count: 0 };
            });
        }
    });
}

export const useNotificationsInfinite = () => {
    return useInfiniteQuery({
        queryKey: ['notifications-infinite'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await axios.get(`/api/freelancer/notifications?limit=${5}&page=${pageParam}`);
            return response.data; // Expecting { data: [], meta: { hasNextPage: true, nextCursor: 2 } }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.data.meta.hasNextPage ? lastPage.data.meta.currentPage + 1 : undefined

    });
}