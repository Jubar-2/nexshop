import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { ChangeWithdrawStatusSchema } from "@/lib/validations/payment";

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
    // Security Check
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN") {
      return ApiResponse.error("Forbidden: Admin access required", 403);
    }

    // Parse and Validate Body
    const body = await request.json().catch(() => ({}));
    const validation = ChangeWithdrawStatusSchema.safeParse(body);

    if (!validation.success) {
      return ApiResponse.error("Validation failed", 400, validation.error.flatten().fieldErrors);
    }

    const { id, status } = validation.data;

    // Execute Transaction
    const result = await db.$transaction(async (tx) => {

      // Fetch current request and ensure it's PENDING
      const currentRequest = await tx.withdrawRequest.findUnique({
        where: { id },
        select: { id: true, status: true, amount: true, freelancerId: true }
      });

      if (!currentRequest) throw new Error("NOT_FOUND");
      if (currentRequest.status !== "PENDING") throw new Error("ALREADY_PROCESSED");

      // If REJECTED, Refund the money to the Freelancer
      if (status === "REJECTED") {
        await tx.freelancer.update({
          where: { id: currentRequest.freelancerId },
          data: {
            currentBalance: { increment: currentRequest.amount }
          }
        });
      }

      // Update the Withdrawal Request status
      const updated = await tx.withdrawRequest.update({
        where: { id },
        data: {
          status,
          // If you have an adminNote field in schema, add it here
        },
      });

      await tx.transaction.update({
        where: { withdrawRequestId: updated.id },
        data: {
          status: status === "APPROVED" ? "COMPLETED" : "FAILED",
          invoice: {
            update: {
              status: status === "APPROVED" ? "PAID" : "CANCELLED",
            },
          },
        },
      });

      return updated;
    });

    return ApiResponse.success(result, `Withdrawal ${status.toLowerCase()} successfully`);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Error";
    console.error("[ADMIN_WITHDRAW_PATCH_ERROR]:", errorMessage);

    if (errorMessage === "NOT_FOUND") return ApiResponse.error("Record not found", 404);
    if (errorMessage === "ALREADY_PROCESSED") return ApiResponse.error("This request has already been processed", 400);

    return ApiResponse.fatal("An error occurred during status update");
  }
}