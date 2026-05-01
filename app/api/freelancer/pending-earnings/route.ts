import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper"

export async function GET(request: Request) {
    try {
        const userId = checkUserId(request);

        const result = await db.submittedJob.aggregate({
            where: {
                freelancer: {
                    userId: userId as string,
                },
                status: "PENDING",
            },
            _sum: {
                reward: true,
            },
        });

        if (!result) {
            return ApiResponse.error("User pending earnings is not found", 401);
        }

        return ApiResponse.success({ reward: result._sum.reward }, "Get pending earnings data")
    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while fetching the profile data"
        )
    }
}