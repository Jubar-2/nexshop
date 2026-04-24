import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper";
import { WithdrawSchema } from "@/lib/validations/payment";

/**
 * Handles the creation of a withdrawal request for a freelancer.
 *
 * This endpoint validates the user's identity, verifies their available balance,
 * and performs an atomic database transaction to create the request, an invoice,
 * and an audit log, while immediately deducting the funds to prevent double-spending.
 *
 * @param {Request} request The incoming HTTP request object.
 * @returns {Promise<Response>} A standardized API response indicating success or failure.
 */
export async function POST(request: Request): Promise<Response> {
    try {
        // Authenticate the user from the verified headers.
        const userId = checkUserId(request);

        // Parse and sanitize the request body.
        const body = (await request.json().catch(() => null)) as unknown;
        if (!body) {
            return ApiResponse.error("Invalid request payload", 400);
        }

        // Validate the input data against the business rules schema.
        const validation = WithdrawSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const { amount, phoneNumber, paymentMethod, accountType } = validation.data;

        // Execute the core financial logic within a database transaction.
        const result = await db.$transaction(async (tx) => {

            const freelancer = await tx.freelancer.findUnique({
                where: { userId: userId as string },
                select: { id: true, currentBalance: true }
            });

            if (!freelancer) {
                throw new Error("FREELANCER_NOT_FOUND");
            }

            if (Number(freelancer.currentBalance) < amount) {
                throw new Error("INSUFFICIENT_BALANCE");
            }

            await tx.freelancer.update({
                where: { id: freelancer.id },
                data: {
                    currentBalance: { decrement: amount }
                }
            });

            const withdrawal = await tx.withdrawRequest.create({
                data: {
                    freelancerId: freelancer.id,
                    amount,
                    paymentMethod,
                    phoneNumber,
                    accountType
                },
            });

            await tx.invoice.create({
                data: {
                    freelancerId: freelancer.id,
                    amount: amount,
                }
            });

            await tx.transaction.create({
                data: {
                    invoiceId: withdrawal.id, // Using withdrawal ID as ref for this logic
                    withdrawRequestId: withdrawal.id,
                    amount: amount,
                    freelancerId: freelancer.id
                }
            });

            return withdrawal;
        });

        return ApiResponse.success(result, "Withdrawal request submitted successfully", 201);

    } catch (error: unknown) {
        // Determine the error message safely without using 'any'.
        const errorMessage = error instanceof Error ? error.message : "Unknown logic failure";

        // Log the full error context for server-side debugging.
        console.error("[WITHDRAW_PROCESS_ERROR]:", errorMessage);

        // Map internal error codes to user-friendly HTTP responses.
        if (errorMessage === "FREELANCER_NOT_FOUND") {
            return ApiResponse.error("Freelancer profile not found", 404);
        }
        if (errorMessage === "INSUFFICIENT_BALANCE") {
            return ApiResponse.error("You do not have enough balance in your wallet", 400);
        }

        return ApiResponse.fatal("An internal error occurred while processing your withdrawal");
    }
}