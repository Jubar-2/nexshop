import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper"

export async function GET(request: Request) {
    try {
        const userId = checkUserId(request);

        const userData = await db.user.findUnique({
            where: { id: userId as string },
            select: {
                email: true
            }
        });

        if (!userData) {
            return ApiResponse.error("User profile is not found", 401);
        }

        return ApiResponse.success(userData, "Get email address")
    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while fetching the profile data"
        )
    }
}