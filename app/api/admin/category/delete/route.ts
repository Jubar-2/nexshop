import { ApiResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";

interface DeleteRequestBody {
    ids: number[]; // Array of IDs to delete
}

export async function DELETE(request: Request) {
    try {
        const body: DeleteRequestBody = await request.json();

        if (!body.ids || body.ids.length === 0) {
            return new Response(JSON.stringify({ error: "No IDs provided" }), { status: 400 });
        }

        // Delete multiple records at once
        const deleted = await prisma.category.deleteMany({
            where: {
                id: { in: body.ids },
            },
        });

        return ApiResponse.success(deleted, "Category delete successful");
    } catch (error) {
        console.error(error);
        return ApiResponse.error("An error occurred while deleting the category", 500);
    }
}