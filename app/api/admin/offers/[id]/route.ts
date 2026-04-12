import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";

export async function GET(
    request: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    try {

        const { id } = await ctx.params;

        // Optimized Database Query
        const offers = await db.offers.findUnique({
            where: { id },
            select: {
                id: true,
                offerTitle: true
            }
        });

        // Handle Not Found
        if (!offers) {
            return ApiResponse.error("offers are not found", 404);
        }

        // Professional Success Response
        return ApiResponse.success(offers, "offers data retrieved", 201);

    } catch (error) {
        // Professional Logging with context
        console.error(`[OFFERS_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the offers",
            500
        );
    }
}