import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib//db";


export async function GET(
    request: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params;

        // Optimized Database Query
        const plan = await db.membershipPlan.findUnique({
            where:{
                id
            },
            select: {
                id: true,
                membershipName: true,
                price: true,
                badgeText: true,
                icon: true,
                jobsSubmitLimit: true,
                title: true,
                color: true,
                period: true,
                description: true,
                planOrder: true,
                isDefault: true,
                // Include the features/offers for each plan
                offers: {
                    select: {
                        id: true,
                        offer: true
                    }
                }
            }
        });

        // Not Found Handling
        if (!plan) {
            return ApiResponse.error("Plan not found", 404);
        }

        // Success Response
        return ApiResponse.success(plan, "Plan fetched successfully");

    } catch (error) {
        // Professional Logging (helps in production tracking)
        console.error(`[CATEGORY_GET_ERROR]:`, error);

        return ApiResponse.error(
            "An error occurred while fetching the category",
            500
        );
    }
}