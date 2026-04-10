import { ApiResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma"; // Professional singleton

export async function GET(
    request: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    try {

        const { id } = await ctx.params;

        // Optimized Database Query
        const offers = await prisma.membershipPlan.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                membershipName: true,
                jobsSubmitLimit: true,
                description: true,
                planOrder: true,
                offers: {
                    select: {
                        offer: {
                            select: {
                                id: false,
                                offerTitle: true
                            }
                        }
                    }
                }
            }
        });

        // Handle Not Found
        if (!offers) {
            return ApiResponse.error("Membership plan are not found", 404);
        }

        // Professional Success Response
        return ApiResponse.success(offers, "Membership plan data retrieved", 201);

    } catch (error) {
        // Professional Logging with context
        console.error(`[OFFERS_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the offers",
            500
        );
    }
}