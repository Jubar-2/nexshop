"use client";
import { useEffect } from "react";
import { toast } from "sonner";

interface Notification {
    type: string;
    title: string;
    message: string;
    timestamp: string;
}

export function useNotifications() {
    useEffect(() => {
        const eventSource = new EventSource("/api/notifications/sse");

        eventSource.addEventListener("connected", () => {
            console.log("[SSE] Connected");
        });

        eventSource.addEventListener("notification", (e) => {
            try {
                const notification: Notification = JSON.parse(e.data);

                if (notification.type === "MEMBERSHIP_APPROVED") {
                    toast.success(notification.title, {
                        description: notification.message,
                        duration: 8000,
                    });
                }
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