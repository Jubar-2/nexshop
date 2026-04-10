import { ApiResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib//prisma";


export async function GET() {
    try {

        // Optimized Database Query
        const category = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                subCategories: {
                    select: {
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