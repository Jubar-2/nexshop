// Global map: userId → SSE controller
// This persists across requests on the same server instance
const clients = new Map<string, ReadableStreamDefaultController>();

export const sseStore = {
    add(userId: string, controller: ReadableStreamDefaultController) {
        clients.set(userId, controller);
    },

    remove(userId: string) {
        clients.delete(userId);
    },

    send(userId: string, event: string, data: unknown) {
        const controller = clients.get(userId);
        if (!controller) return false; // user is offline

        const encoder = new TextEncoder();
        controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
        return true;
    },
};