import { ApiResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { id, name } = await request.json();

    const updated = await prisma.user.update({
      where: { id },
      data: { name },
    });

    return ApiResponse.success(updated, "Category updated successful");
    
  } catch (error) {
    console.error(error)
    return ApiResponse.error("An error occurred while updating the category", 500);
  }
}