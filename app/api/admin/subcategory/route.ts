import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";

export async function GET() {
    try {

        // Optimized Database Query
        const category = await db.category.findMany({
            include: {
                subCategories: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true
                    },
                    orderBy: {
                        name: 'asc'
                    }
                }
            }
        });

        // 4. Handle Not Found
        if (!category) {
            return ApiResponse.error("Category not found", 404);
        }

        // 5. Professional Success Response
        return ApiResponse.success(category, "Category data retrieved");

    } catch (error) {
        // Professional Logging with context
        console.error(`[CATEGORY_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the category",
            500
        );
    }
}