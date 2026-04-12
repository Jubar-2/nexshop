import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db"; // Professional singleton

export async function GET() {
    try {

        // Optimized Database Query
        const membershipPlan = await db.membershipPlan.findMany({
            select: {
                id: true,
                membershipName: true,
                jobsSubmitLimit: true,
                description: true,
                planOrder: true,
            }
        });

        // Handle Not Found
        if (!membershipPlan) {
            return ApiResponse.error("Membership plan are not found", 404);
        }

        // Professional Success Response
        return ApiResponse.success(membershipPlan, "Membership plan retrieved", 201);

    } catch (error) {
        // Professional Logging with context
        console.error(`[MEMBERSHIP_PLAN_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the offers",
            500
        );
    }
}