import { ApiResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";

export async function DELETE(request: Request) {
    try {
        // const session = await getServerSession(authOptions);

        // if (!session || session.user.role !== "ADMIN" || !session.user.id) {
        //     return ApiResponse.error("Forbidden: Admin access required", 403);
        // }

        // Safe JSON parsing with error handling
        const body = await request.json().catch(() => null);
        if (!body) {
            return ApiResponse.error("Invalid JSON payload", 400);
        }

        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length <= 0) {
            return ApiResponse.error("Confirm that ids are an Array", 400);
        }

        // Create the job in the database
        const deleted = await prisma.offers.deleteMany({
            where: {
                id: { in: ids }
            }
        });

        return ApiResponse.success(deleted, "offers delete successfully", 201);

    } catch (error: unknown) {

        console.error("JOB_CREATE_ERROR:", error);

        return ApiResponse.error("Failed to delete offers", 500);
    }
}