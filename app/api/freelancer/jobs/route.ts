import { ApiResponse } from "@/lib/apiResponse";

import FreelancerService from "@/lib/freelancer/FreelancerService";

export async function GET() {
    try {

        const freelancerService = new FreelancerService(1)
        const jobs = await freelancerService.findJobs();

        // Success Response
        return ApiResponse.success(jobs, "Jobs data retrieved");

    } catch (error) {
        // Logging with context
        console.error(`[CATEGORY_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the Jobs",
            500
        );
    }
}


