import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper";
import { Pagination } from "@/lib/pagination";

/**
 * Retrieves paginated withdrawal history for the authenticated freelancer.
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

        // Initialize Pagination utility using search params from the URL.
        const { searchParams } = new URL(request.url);
        const pagination = new Pagination(searchParams, 10);

        // Define a shared filter object to ensure count and data are synchronized.
        // This looks through the Freelancer relation to the base User ID.
        const whereClause = {
            freelancer: {
                userId: userId as string,
            },
        };

        // Execute parallel queries for optimized performance.
        // We strictly 'select' fields to minimize database I/O and prevent data leakage.
        const [total, data] = await Promise.all([
            db.withdrawRequest.count({
                where: whereClause,
            }),
            db.withdrawRequest.findMany({
                where: whereClause,
                orderBy: {
                    createdAt: "desc",
                },
                ...pagination.prismaOptions,
                select: {
                    id: true,
                    amount: true,
                    paymentMethod: true,
                    phoneNumber: true,
                    accountType: true,
                    status: true,
                    createdAt: true,
                    transactions: {
                        select: {
                            invoice: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    }
                },
            }),
        ]);

        // If no freelancer profile exists, return a clear business error.
        // (Checked here to avoid an extra DB hit before the main query).
        if (total === 0) {
            const profileCheck = await db.freelancer.findUnique({
                where: { userId: userId as string },
            });
            if (!profileCheck) {
                return ApiResponse.error("Freelancer profile not found", 404);
            }
        }

        // Return response with standardized metadata envelope.
        return ApiResponse.success({
            data,
            meta: pagination.getMetadata(total, data.length),
        }, "Withdrawal history retrieved successfully");

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Internal Failure";
        console.error("[WITHDRAW_HISTORY_GET_ERROR]:", errorMessage);

        return ApiResponse.fatal("An internal error occurred while fetching your records");
    }
}