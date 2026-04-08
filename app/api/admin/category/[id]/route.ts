import { ApiResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib//prisma";


export async function GET(
    request: Request,
    ctx: { params: Promise<{ id: string }> } // Standard Next.js 15+ Async Params
) {
    try {
        const { id } = await ctx.params;

        // Optimized Database Query
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            // Optimization: Only fetch sub-categories if needed. 
            // Remove the 'include' block if you strictly just want the category name.
            include: {
                subCategories: {
                    select: {
                        id: true,
                        name: true,
                        subcategories: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        // Not Found Handling
        if (!category) {
            return ApiResponse.error("Category not found", 404);
        }

        // Success Response
        return ApiResponse.success(category, "Category fetched successfully");

    } catch (error) {
        // Professional Logging (helps in production tracking)
        console.error(`[CATEGORY_GET_ERROR]:`, error);

        return ApiResponse.error(
            "An error occurred while fetching the category",
            500
        );
    }
}