import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib//db";
import { cancelExpiredMemberships } from "@/lib/helper";


export async function GET(
    request: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    try {

        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return ApiResponse.error("User Id is missing", 409);
        }

        // Fetch freelancer details to get the freelancer ID
        const freelancer = await db.freelancer.findUnique({
            where: { userId },
            select: {
                id: true,
            }
        });

        if (!freelancer) {
            return ApiResponse.error("Freelancer not found", 404);
        }

        // Cancel expired memberships if any
        cancelExpiredMemberships(freelancer.id);

        const { id } = await ctx.params;

        // Optimized Database Query
        const plan = await db.membershipPlan.findUnique({
            where: {
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