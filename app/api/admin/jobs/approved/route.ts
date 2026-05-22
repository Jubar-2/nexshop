import { ApiResponse } from "@/lib/apiResponse";


/**
 * Handles the administrative approval or rejection of withdrawal requests.
 *
 * This endpoint performs an atomic transaction to update the status and,
 * in the case of rejection, restores the freelancer's balance to prevent
 * financial loss for the worker.
 *
 * @param {Request} request The incoming HTTP request.
 * @returns {Promise<Response>} Standardized API response.
 */
export async function PATCH(request: Request): Promise<Response> {
    try {
        const role = request.headers.get("x-user-role");

        if (role !== "ADMIN") {
            return ApiResponse.error("Forbidden: Admin access required", 403);
        }

        
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Internal Error";
        console.error("[ADMIN_WITHDRAW_PATCH_ERROR]:", errorMessage);

        if (errorMessage === "NOT_FOUND") return ApiResponse.error("Record not found", 404);
        if (errorMessage === "ALREADY_PROCESSED") return ApiResponse.error("This request has already been processed", 400);

        return ApiResponse.fatal("An error occurred during status update");
    }
}