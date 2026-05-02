import { ApiResponse } from "@/lib/apiResponse";
import FreelancerService from "@/lib/freelancer/FreelancerService";


export async function GET(request: Request) {
    try {

        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return ApiResponse.error("User Id is missing", 409);
        }


        // Get jobs
        const freelancerService = new FreelancerService(userId);
        const jobs = await freelancerService.countOfApprovedJobs()

        if (!jobs) {
            return ApiResponse.error("jobs not found", 409);
        }

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


