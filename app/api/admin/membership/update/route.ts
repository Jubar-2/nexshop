import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { MemberShipUpdateInSchema } from "@/lib/validations/membership";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request) {
    try {
        // const session = await getServerSession(authOptions);

        // if (!session || session.user.role !== "ADMIN" || !session.user.id) {
        //     return ApiResponse.error("Forbidden: Admin access required", 403);
        // }

        // Safe JSON parsing with error handling
        const body = await request.json().catch(() => null);
        if (!body) {
            return ApiResponse.error("Invalid JSON payload", 400);
        }

        // Validate input using Zod schema
        const validation = MemberShipUpdateInSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        // Extract validated data
        const {
            membershipName,
            jobsSubmitLimit,
            description,
            planOrder,
            offers,
            price,
            color,
            icon,
            title,
            badgeText,
            limitParDay,
            id,
            period
        } = validation.data;

        // find the job
        const membershipFind = await db.membershipPlan.findUnique({
            where: { id }
        });

        if (!membershipFind) {
            return ApiResponse.error("Membership plan id is not valid", 400)
        }

        // Create the membership plan in the database
        const result = await db.$transaction(async (tx) => {
            // Create the job in the database
            const createMembership = await tx.membershipPlan.update({
                where: { id },
                data: {
                    membershipName: membershipName.trim(),
                    jobsSubmitLimit,
                    limitParDay,
                    description: description?.trim(),
                    planOrder,
                    price,
                    color,
                    icon,
                    title,
                    badgeText,
                    period
                },
            });

            let offer = {}
            if (Array.isArray(offers) && offers.length > 0) {
                await tx.memberOffer.deleteMany({
                    where: {
                        membershipPlanId: createMembership.id,
                    }
                });

                const memberOffer = await tx.memberOffer.createManyAndReturn({
                    data: offers?.map((offerId: string) => ({
                        membershipPlanId: createMembership.id,
                        offerId: offerId,
                    })),
                    select: {
                        offer: {
                            select: {
                                offerTitle: true
                            }
                        }
                    }
                });

                offer = memberOffer;
            }

            return { membership: createMembership, offers: offer }
        });

        return ApiResponse.success(result, "Offer created successfully", 201);

    } catch (error: unknown) {

        console.error("OFFER_CREATE_ERROR:", error);
        return ApiResponse.error("Failed to create offer", 500);
    }
}