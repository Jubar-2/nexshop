import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { MemberShipUpgradeStatusChangeInSchema } from "@/lib/validations/membership";

/**
 * Handles the administrative audit of membership upgrade requests.
 *
 * This endpoint processes tier transitions by verifying the request state,
 * updating the freelancer's active plan, logging history, and finalizing
 * associated invoices within an atomic database transaction.
 *
 * @param {Request} request The incoming HTTP request.
 * @returns {Promise<Response>} Standardized API response.
 */
export async function PATCH(request: Request): Promise<Response> {
    try {
        // Authorization Guard
        const role = request.headers.get("x-user-role");
        if (role !== "ADMIN") {
            return ApiResponse.error("Forbidden: Admin privileges required", 403);
        }

        // Data Validation
        const body = await request.json().catch(() => ({}));
        const validation = MemberShipUpgradeStatusChangeInSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error("Validation failed", 400, validation.error.flatten().fieldErrors);
        }

        const { id, status } = validation.data;

        // Atomic Transaction
        const result = await db.$transaction(async (tx) => {

            // FETCH FIRST (To verify current state)
            const requestRecord = await tx.membershipUpgradeRequest.findUnique({
                where: { id },
                select: {
                    id: true,
                    status: true,
                    freelancerId: true,
                    requestedPlanId: true
                }
            });

            if (!requestRecord) throw new Error("NOT_FOUND");
            if (requestRecord.status !== "PENDING") throw new Error("ALREADY_PROCESSED");

            // FETCH PLAN DETAILS (To calculate expiry)
            const targetPlan = await tx.membershipPlan.findUnique({
                where: { id: requestRecord.requestedPlanId }
            });

            if (!targetPlan) throw new Error("PLAN_NOT_FOUND");

            // CALCULATE DATES
            // Assuming 'period' is in days (e.g., 30)
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + targetPlan.period);

            // UPDATE REQUEST STATUS
            const updatedRequest = await tx.membershipUpgradeRequest.update({
                where: { id },
                data: { status }
            });

            // UPDATE HISTORY & INVOICE
            await tx.membershipHistory.update({
                where: { membershipRequestId: id },
                data: {
                    status,
                    startDate: status === "APPROVED" ? startDate : null,
                    endDate: status === "APPROVED" ? endDate : null,
                    invoice: {
                        update: {
                            status: status === "APPROVED" ? "PAID" : "CANCELLED",
                        }
                    }
                }
            });

            return updatedRequest;
        });

        return ApiResponse.success(result, `Membership request ${status.toLowerCase()} successfully`);

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Internal Error";
        console.error("[ADMIN_MEMBERSHIP_PATCH_ERROR]:", msg);

        if (msg === "NOT_FOUND") return ApiResponse.error("Request record not found", 404);
        if (msg === "ALREADY_PROCESSED") return ApiResponse.error("Request has already been processed", 400);
        if (msg === "PLAN_NOT_FOUND") return ApiResponse.error("Target membership plan no longer exists", 404);

        return ApiResponse.fatal("An internal error occurred during membership audit");
    }
}