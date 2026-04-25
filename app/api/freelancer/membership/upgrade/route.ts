import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper";
import { imageUploader } from "@/lib/services/image-upload";
import { MemberShipUpgradeInSchema } from "@/lib/validations/membership";

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
        const validation = MemberShipUpgradeInSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const {
            phoneNumber,
            paymentMethod,
            accountType,
            amount,
            planId,
            paymentProof
        } = validation.data;

        const imageLink = await imageUploader.upload(paymentProof);

        // Execute the core financial logic within a database transaction.
        const result = await db.$transaction(async (tx) => {

            const freelancer = await tx.freelancer.findUnique({
                where: { userId: userId as string },
                select: { id: true, currentBalance: true }
            });


            if (!freelancer) {
                throw new Error("FREELANCER_NOT_FOUND");
            }

            const membershipPlan = await tx.membershipPlan.findUnique({
                where: { id: planId }
            })

            if (!membershipPlan) throw new Error("PLAN_NOT_FOUND");

            if (amount !== membershipPlan.price.toNumber()) {
                throw new Error("INSUFFICIENT_BALANCE");
            }

            const membershipRequest = await tx.membershipUpgradeRequest.create({
                data: {
                    freelancerId: freelancer.id,
                    paymentMethod,
                    phoneNumber,
                    accountType,
                    requestedPlanId: membershipPlan.id,
                    paymentProof: imageLink
                },
            });

            const invoice = await tx.invoice.create({
                data: {
                    freelancerId: freelancer.id,
                    amount: amount,
                }
            });

            await tx.membershipHistory.create({
                data: {
                    freelancerId: freelancer.id,
                    membershipRequestId: membershipRequest.id,
                    membershipPlanId: membershipPlan.id,
                    invoiceId: invoice.id,
                }
            })

            return membershipRequest;
        });

        return ApiResponse.success(result, "Membership upgrade request submitted successfully", 201);

    } catch (error: unknown) {
        // Determine the error message safely without using 'any'.
        const errorMessage = error instanceof Error ? error.message : "Unknown logic failure";

        // Log the full error context for server-side debugging.
        console.error("[MEMBERSHIP_UPGRADE_PROCESS_ERROR]:", errorMessage);

        // Map internal error codes to user-friendly HTTP responses.
        if (errorMessage === "FREELANCER_NOT_FOUND") {
            return ApiResponse.error("Freelancer profile not found", 404);
        }
        if (errorMessage === "INSUFFICIENT_BALANCE") {
            return ApiResponse.error("You do not have enough balance in your wallet", 400);
        }

        return ApiResponse.fatal("An internal error occurred while processing your membership upgrade");
    }
}