import { sseStore } from "@/lib/sse-store";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            // Register this client
            sseStore.add(userId, controller);

            // Initial confirmation
            controller.enqueue(
                encoder.encode(`event: connected\ndata: ${JSON.stringify({ connected: true })}\n\n`)
            );

            // Heartbeat every 30s to keep connection alive through proxies
            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(`: heartbeat\n\n`));
                } catch {
                    clearInterval(heartbeat);
                }
            }, 30000);

            // Cleanup on disconnect
            request.signal.addEventListener("abort", () => {
                clearInterval(heartbeat);
                sseStore.remove(userId);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}