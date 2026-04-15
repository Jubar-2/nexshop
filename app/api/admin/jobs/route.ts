import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";

export async function GET() {
    try {

        // Optimized Database Query
        const jobs = await db.jobs.findMany({
            select: {
                id: true,
                jobTitle: true,
                targetLink: true,
                description: true,
                totalSlots: true,
                reward: true,
                status: true,
                category: {
                    select: {
                        name: true
                    }
                },
                subCategory: {
                    select: { name: true }
                },
                createdAt: true
            }
        });

        // Handle Not Found
        if (!jobs) {
            return ApiResponse.error("Jobs are not found", 404);
        }

        // Professional Success Response
        return ApiResponse.success(jobs, "Jobs data retrieved");

    } catch (error) {
        // Professional Logging with context
        console.error(`[CATEGORY_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the Jobs",
            500
        );
    }
}