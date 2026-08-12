import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import FreelancerService from "@/lib/freelancer/FreelancerService";
import { cancelExpiredMemberships, checkUserId } from "@/lib/helper";
// import { sseStore } from "@/lib/sse-store";
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
            planId,
            trxID
        } = validation.data;

        const membershipPlan = await db.membershipPlan.findUnique({
            where: { id: planId },
            select: { price: true }
        })

        if (!membershipPlan) {
            return ApiResponse.error("Membership plan not found", 404);
        }

        const planForFreelancer = await db.freelancer.findUnique({
            where: {
                userId: userId as string,
                memberPlanId: planId,
            }
        });

        if (planForFreelancer) {
            return ApiResponse.error("You have already subscribed to this membership plan", 400);
        }

        const freelancerService = new FreelancerService(userId as string);
        const profile = await freelancerService.getProfile();

        const planForFreelancerRequested = await db.membershipUpgradeRequest.findFirst({
            where: {
                freelancerId: profile.id,
                requestedPlanId: planId,
                status: "PENDING"
            }
        });

        if (planForFreelancerRequested) {
            return ApiResponse.error("You have already requested for this membership plan. Please wait for the approval.", 400);
        }

        const packagePrice = membershipPlan.price.toNumber();


        const freelancer = await db.freelancer.findUnique({
            where: { userId: userId as string },
            select: { id: true, currentBalance: true }
        });


        if (!freelancer) {
            throw new Error("FREELANCER_NOT_FOUND");
        }


        // Cancel expired memberships if any
        cancelExpiredMemberships(freelancer.id);

        // Execute the core financial logic within a database transaction.
        const result = await db.$transaction(async (tx) => {



            const membershipPlan = await tx.membershipPlan.findUnique({
                where: { id: planId }
            });

            if (!membershipPlan) throw new Error("PLAN_NOT_FOUND");

            const membershipRequest = await tx.membershipUpgradeRequest.create({
                data: {
                    freelancerId: freelancer.id,
                    paymentMethod,
                    phoneNumber,
                    accountType,
                    requestedPlanId: membershipPlan.id,
                    trxID
                },
            });

            const invoice = await tx.invoice.create({
                data: {
                    freelancerId: freelancer.id,
                    amount: packagePrice,
                }
            });

            await tx.membershipHistory.create({
                data: {
                    freelancerId: freelancer.id,
                    membershipRequestId: membershipRequest.id,
                    membershipPlanId: membershipPlan.id,
                    invoiceId: invoice.id,
                }
            });

            const notification = await tx.notification.create({
                data: {
                    userId: userId as string,
                    title: "Membership Upgrade Request Submitted",
                    description: `প্রিয় ব্যবহারকারী,আপনার মেম্বারশিপ আপগ্রেড রিকোয়েস্টটি প্রক্রিয়াধীন। অনুগ্রহ করে ধৈর্য ধরুন। নির্ধারিত সময়ের মধ্যে রিকোয়েস্টটি অনুমোদিত না হলে সাপোর্ট টিমের সাথে যোগাযোগ করুন।ধন্যবাদ`
                },

                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                    read: true,
                }
            });

            return { membershipRequest, notification };
        });

        // sseStore.send(userId as string, "notification", {
        //     ...result.notification
        // });

        return ApiResponse.success(result.membershipRequest, "Membership upgrade request submitted successfully", 201);

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