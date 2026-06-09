import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper"

export async function GET(request: Request) {
    try {
        const userId = checkUserId(request);
        
        const [jobsIncome, referIncome] = await Promise.all([
            await db.submittedJob.aggregate({
                where: {
                    freelancer: {
                        userId: userId as string,
                    },
                    status: "APPROVED",
                },
                _sum: {
                    reward: true,
                },

            }),

            await db.referralIncome.aggregate({
                where: {
                    Freelancer: {
                        userId: userId as string,
                    }
                },
                _sum: {
                    reward: true
                }

            })
        ])

        if (!jobsIncome && !referIncome) {
            return ApiResponse.error("User pending earnings is not found", 401);
        }

        const jobsTotal = Number(jobsIncome._sum.reward ?? 0);
        const referTotal = Number(referIncome._sum.reward ?? 0);

        const total = jobsTotal + referTotal;

        return ApiResponse.success({ amount: total }, "Get pending earnings data")
    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while fetching the profile data"
        )
    }
}