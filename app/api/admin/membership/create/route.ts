import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { MemberShipInSchema } from "@/lib/validations/membership";

export async function POST(request: Request) {
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
        const validation = MemberShipInSchema.safeParse(body);
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
            offers
        } = validation.data;

        const result = await db.$transaction(async (tx) => {
            // Create the job in the database
            const createMembership = await tx.membershipPlan.create({
                data: {
                    membershipName: membershipName.trim(),
                    jobsSubmitLimit,
                    description: description?.trim(),
                    planOrder
                },
            });


            let offer = {}
            if (Array.isArray(offers) && offers.length > 0) {
                const memberOffer = await tx.memberOffer.createManyAndReturn({
                    data: offers?.map((offerId) => ({
                        membershipPlanId: createMembership.id,
                        offerId: offerId
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

        return ApiResponse.success(result, "Membership created successfully", 201);

    } catch (error: unknown) {

        console.error("JOB_CREATE_ERROR:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2000") {
                return ApiResponse.error(
                    "Value too long for one of the fields",
                    400
                );
            }

            if (error.code == "P2002") {
                return ApiResponse.error(
                    "Make sure membershipName or planOrder is unique",
                    400
                );
            }
        }

        return ApiResponse.error("Failed to create membership", 500);
    }
}