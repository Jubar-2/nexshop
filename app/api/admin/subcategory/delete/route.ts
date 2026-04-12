import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Updated for CUID strings
interface DeleteRequestBody {
    ids: string[]; 
}

export async function DELETE(request: Request) {
    try {
        // 1. Security Check: Ensure only ADMINS can perform bulk deletes
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return ApiResponse.error("Unauthorized: Admin access required", 401);
        }

        // 2. Safe Body Parsing
        const body: DeleteRequestBody = await request.json().catch(() => null);

        if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
            return ApiResponse.error("No valid IDs provided for deletion", 400);
        }

        // 3. Batch Delete Operation
        // Optimized: One database trip to delete multiple records
        const deleted = await db.subCategory.deleteMany({
            where: {
                id: { in: body.ids },
            },
        });

        return ApiResponse.success(
            { count: deleted.count }, 
            `${deleted.count} subcategories deleted successfully`
        );

    } catch (error: unknown) {
        console.error("[SUB_CATEGORY_BATCH_DELETE_ERROR]:", error);

        // 4. Handle Foreign Key Constraint (Very Important)
        // If a Job or Skill is using this SubCategory, Prisma throws P2003
        if (error instanceof Error && error.message.includes('P2003')) {
            return ApiResponse.error(
                "Cannot delete: Some subcategories are currently linked to active Jobs or Skills.", 
                400
            );
        }

        return ApiResponse.error(
            "An internal error occurred during deletion", 
            500
        );
    }
}