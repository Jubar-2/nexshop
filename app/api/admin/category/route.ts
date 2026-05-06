import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";


export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url);
        const name = searchParams.get("name") || "";

        // Optimized Database Query
        const category = await db.category.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                name: true,
                icon: true,
                subCategories: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        // Not Found Handling
        if (!category) {
            return ApiResponse.error("Category not found", 404);
        }

        // Success Response
        return ApiResponse.success(category, "Category fetched successfully", 201);

    } catch (error) {
        // Professional Logging (helps in production tracking)
        console.error(`[CATEGORY_GET_ERROR]:`, error);

        return ApiResponse.error(
            "An error occurred while fetching the category",
            500
        );
    }
}