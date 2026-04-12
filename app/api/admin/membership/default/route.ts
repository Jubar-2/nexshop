import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db"; // Professional singleton

export async function GET() {
    try {

        // Optimized Database Query
        const offers = await db.membershipPlan.findFirst({
            where: { isDefault: true },
            select: {
                id: true,
                membershipName: true,
                jobsSubmitLimit: true,
                description: true,
                planOrder: true,
            }
        });

        // Handle Not Found
        if (!offers) {
            return ApiResponse.error("Default membership plan are not found", 404);
        }

        // Professional Success Response
        return ApiResponse.success(offers, "Default membership plan data retrieved", 201);

    } catch (error) {
        // Professional Logging with context
        console.error(`[DEFAULT_MEMBERSHIP_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the Default membership",
            500
        );
    }
}