import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";

import FreelancerService from "@/lib/freelancer/FreelancerService";

export async function GET(request: Request) {
    try {

        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return ApiResponse.error("User Id is missing", 409);
        }

        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const [freelancer, count] = await Promise.all([
            db.freelancer.findUnique({
                where: { userId },
                include: {
                    membershipPlan: {
                        select: {
                            jobsSubmitLimit: true,
                            limitParDay: true
                        }
                    },
                    _count: {
                        select: {
                            submissions: true
                        },
                    },
                }
            }),

            db.submittedJob.count({
                where: {
                    freelancer: {
                        userId,
                    },
                    submittedAt: {
                        gte: last24Hours,
                    },
                },
            })
        ]);

        if (!freelancer) {
            return ApiResponse.error("Freelancer not found", 409);
        }

        const permission: {
            limitParDay: boolean;
            jobsSubmitLimit: boolean;
        } = {
            limitParDay: false,
            jobsSubmitLimit: false
        }

        // Check if Job is Full
        if (count >= freelancer.membershipPlan.limitParDay ||
            freelancer._count.submissions >= freelancer.membershipPlan.jobsSubmitLimit) {

            permission.jobsSubmitLimit = freelancer._count.submissions >= freelancer.membershipPlan.jobsSubmitLimit;
            permission.limitParDay = count >= freelancer.membershipPlan.limitParDay;

            return ApiResponse.success({ jobs: [], permission }, "Jobs data retrieved");
        }

        const freelancerService = new FreelancerService(userId)
        const jobs = await freelancerService.findJobs();

        if (!jobs) {
            return ApiResponse.error("jobs not found", 409);
        }

        // Success Response
        return ApiResponse.success({ jobs, permission }, "Jobs data retrieved");

    } catch (error) {
        // Logging with context
        console.error(`[CATEGORY_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the Jobs",
            500
        );
    }
}


