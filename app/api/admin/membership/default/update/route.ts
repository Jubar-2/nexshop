import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
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

        // Extract validated data
        const { planOrder } = body;

        // find the job
        const membershipFind = await db.membershipPlan.findUnique({
            where: { planOrder }
        });

        if (!membershipFind) {
            return ApiResponse.error("Membership plan id is not valid", 400)
        }

        // Create the membership plan in the database
        const result = await db.$transaction(async (tx) => {

            const findDefault = await tx.membershipPlan.findFirst({
                where: { isDefault: true }
            })

            await tx.membershipPlan.updateMany({
                where: { isDefault: true },
                data: {
                    isDefault: false,
                },
            });

            // Create the job in the database
            const membership = await tx.membershipPlan.update({
                where: { planOrder },
                data: {
                    isDefault: true,
                },
            });

            if (findDefault) {
                await tx.freelancer.updateMany({
                    where: {
                        memberPlanId: findDefault.id
                    },
                    data: {
                        memberPlanId: membership.id
                    }
                });
            }


            return membership;
        });

        return ApiResponse.success(result, "Offer created successfully", 201);

    } catch (error: unknown) {

        console.error("OFFER_CREATE_ERROR:", error);
        return ApiResponse.error("Failed to create offer", 500);
    }
}