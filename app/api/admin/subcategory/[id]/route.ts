import { ApiResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma"; // Professional singleton

export async function GET(
    request: Request,
    ctx: { params: Promise<{ id: string }> } // Correct Next.js 15+ Async Params
) {
    try {
        const { id } = await ctx.params;

        // 3. Optimized Database Query
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) }, // Ensure ID is an integer
            // Optimization: Fetch sub-categories with only necessary fields
            include: {
                subCategories: { // This matches the relation name in our professional schema
                    select: {
                        id: true,
                        name: true,
                        createdAt: true
                    },
                    orderBy: {
                        name: 'asc' // Nice professional touch: keep list alphabetized
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