import { ApiResponse } from "@/lib/apiResponse";

import FreelancerService from "@/lib/freelancer/FreelancerService";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return ApiResponse.error("User Id is missing", 409);
        }

        const { id } = await params;

        const freelancerService = new FreelancerService(userId)
        const job = await freelancerService.jobWithId(id);

        if (!job) {
            return ApiResponse.error("jobs not found", 409);
        }

        // Success Response
        return ApiResponse.success(job, "Jobs data retrieved");

    } catch (error) {
        // Logging with context
        console.error(`[CATEGORY_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the Jobs",
            500
        );
    }
}


