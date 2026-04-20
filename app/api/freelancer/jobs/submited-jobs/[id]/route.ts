import { ApiResponse } from "@/lib/apiResponse";
import FreelancerService from "@/lib/freelancer/FreelancerService";


export async function GET(request: Request,
    ctx: { params: Promise<{ id: string }> }) {
    try {

        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return ApiResponse.error("User Id is missing", 409);
        }

        const { id } = await ctx.params;

        // Get jobs
        const freelancerService = new FreelancerService(userId);
        const jobs = await freelancerService.getSubmittedJob(id)

        // Not Found Handling
        if (!jobs) {
            return ApiResponse.error("Jobs not found", 404);
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


