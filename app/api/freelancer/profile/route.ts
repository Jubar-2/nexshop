import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper"

export async function GET(request: Request) {
    try {
        const userId = checkUserId(request);

        const userData = await db.user.findUnique({
            where: { id: userId as string },
            select: {
                fullName: true,
                email: true,
                phoneNumber: true,
                status: true,
                avatar: true,
                freelancer: {
                    select: {
                        membershipPlan: {
                            select: {
                                id: true,
                                membershipName: true,
                                jobsSubmitLimit: true,
                                description: true,
                                planOrder: true,
                                period: true,
                            }
                        },
                        referKey: true,
                        totalSuccessRate: true,
                        currentBalance: true,
                        totalApproved: true,
                        totalRejected: true,
                        totalSubmitted: true,
                        referralBalance: true
                    }
                },
                address: true
            }
        });

        if (!userData) {
            return ApiResponse.error("User profile is not found", 401);
        }

        return ApiResponse.success(userData, "Get profile data")
    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while fetching the profile data"
        )
    }
}