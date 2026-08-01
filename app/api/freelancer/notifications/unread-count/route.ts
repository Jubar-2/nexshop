import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper";

/**
 * Retrieves the count of unread notifications for the authenticated freelancer.
 *
 * This implementation uses nested relational filtering to ensure that workers
 * can only access their own financial records, maintaining high security and
 * data integrity.
 *
 * @param {Request} request Incoming HTTP request.
 * @returns {Promise<Response>} Standardized API response with data and metadata.
 */
export async function GET(request: Request): Promise<Response> {
    try {
        // Authenticate identity from Proxy headers.
        const userId = checkUserId(request);
        if (!userId) {
            return ApiResponse.error("Authentication required", 401);
        }

        // Execute parallel queries for optimized performance.
        // We strictly 'select' fields to minimize database I/O and prevent data leakage.
        const notificationCount = await db.notification.count({
            where: {
                userId: userId as string,
                read: false, // Only fetch unread notifications
            },          
        });

        // Return response with standardized metadata envelope.
        return ApiResponse.success({ count: notificationCount }, "Unread notification count retrieved successfully");

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Internal Failure";
        console.error("[NOTIFICATION_HISTORY_GET_ERROR]:", errorMessage);

        return ApiResponse.fatal("An internal error occurred while fetching your records");
    }
}