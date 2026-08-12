import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
// import { sseStore } from "@/lib/sse-store";
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

        // FETCH FIRST (To verify current state)
        const requestRecord = await db.membershipUpgradeRequest.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                freelancerId: true,
                requestedPlanId: true,
                requestedPlan: true,
                freelancer: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!requestRecord) {
            return ApiResponse.error("NOT_FOUND", 404)
        }

        if (requestRecord.status !== "PENDING") {
            return ApiResponse.error("ALREADY_PROCESSED", 404)
        }

        // FETCH PLAN DETAILS (To calculate expiry)
        const targetPlan = await db.membershipPlan.findUnique({
            where: { id: requestRecord.requestedPlanId }
        });

        if (!targetPlan) {
            return ApiResponse.error("PLAN_NOT_FOUND", 404);
        }

        // CALCULATE DATES
        // Assuming 'period' is in days (e.g., 30)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + targetPlan.period);

        // Atomic Transaction
        const result = await db.$transaction(async (tx) => {

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

            let notification;

            if (status === "APPROVED") {

                await tx.freelancer.update({
                    where: { id: requestRecord.freelancerId },
                    data: {
                        memberPlanId: requestRecord.requestedPlanId,
                        startAt: startDate,
                        expireAt: endDate
                    }
                });

                notification = await tx.notification.create({
                    data: {
                        userId: requestRecord.freelancer.userId,
                        title: "Membership Request Approved",
                        description: `প্রিয় ব্যবহারকারী,আপনার মেম্বারশিপ রিকোয়েস্টটি অনুমোদিত হয়েছে। আপনার নতুন মেম্বারশিপটি ${startDate.toLocaleDateString()} থেকে কার্যকর হবে এবং ${endDate.toLocaleDateString()} তারিখে শেষ হবে।`
                    },

                    select: {
                        id: true,
                        title: true,
                        description: true,
                        createdAt: true,
                        read: true,
                    }
                });

            } else if (status === "REJECTED") {
                notification = await tx.notification.create({
                    data: {
                        userId: requestRecord.freelancer.userId,
                        title: "Membership Request Rejected",
                        description: `প্রিয় ব্যবহারকারী,আপনার মেম্বারশিপ রিকোয়েস্টটি অনুমোদিত হয়নি। অনুগ্রহ করে আপনার তথ্য যাচাই করুন এবং পুনরায় চেষ্টা করুন।`
                    },

                    select: {
                        id: true,
                        title: true,
                        description: true,
                        createdAt: true,
                        read: true,
                    }
                });
            }

            return { updatedRequest, notification };
        });

        // Send real-time notification via SSE
        // sseStore.send(requestRecord.freelancer.userId, "notification", {
        //     ...result.notification
        // });

        return ApiResponse.success(result, `Membership request ${status.toLowerCase()} successfully`);

    } catch (error: unknown) {
        console.log(error)
        const msg = error instanceof Error ? error.message : "Internal Error";
        console.error("[ADMIN_MEMBERSHIP_PATCH_ERROR]:", msg);

        if (msg === "NOT_FOUND") return ApiResponse.error("Request record not found", 404);
        if (msg === "ALREADY_PROCESSED") return ApiResponse.error("Request has already been processed", 400);
        if (msg === "PLAN_NOT_FOUND") return ApiResponse.error("Target membership plan no longer exists", 404);

        return ApiResponse.fatal("An internal error occurred during membership audit");
    }
}