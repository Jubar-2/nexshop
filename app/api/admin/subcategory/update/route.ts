import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";

export async function PATCH(request: Request) {
    try {

        const { id, name, categoryId } = await request.json();

        // 4. Duplicate Check (Crucial for micro-job platforms)
        // If name or category is being changed, check if the new name already exists in that category
        if (name || categoryId) {
            // Fetch current record to get existing categoryId if not provided in request
            const current = await db.subCategory.findUnique({ where: { id } });
            if (!current) return ApiResponse.error("SubCategory not found", 404);

            const targetCategoryId = categoryId || current.categoryId;
            const targetName = name || current.name;

            const duplicate = await db.subCategory.findFirst({
                where: {
                    name: targetName.trim(),
                    categoryId: targetCategoryId,
                    NOT: { id: id } // Exclude current record
                }
            });

            if (duplicate) {
                return ApiResponse.error(`A subcategory with name "${targetName}" already exists in this category`, 409);
            }
        }

        // 5. Perform Update
        const updatedSubCategory = await db.subCategory.update({
            where: { id },
            data: {
                ...(name && { name: name.trim() }),
                ...(categoryId && { categoryId }),
            },
            select: {
                id: true,
                name: true,
                categoryId: true,
                updatedAt: true,
                category: { select: { name: true } } // Include parent name for UI confirmation
            }
        });

        return ApiResponse.success(updatedSubCategory, "SubCategory updated successfully");

    } catch (error: unknown) {
        console.error("[SUB_CATEGORY_PATCH_ERROR]:", error);

        // Handle Prisma specific "Record not found" error
        if (error instanceof Error && error.message.includes('P2025')) {
            return ApiResponse.error("SubCategory not found", 404);
        }

        return ApiResponse.error("An internal error occurred while updating", 500);
    }
}