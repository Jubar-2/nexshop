import Settings from "@/lib/Settings";
import { ApiResponse } from "@/lib/apiResponse";
import FreelancerService from "@/lib/freelancer/FreelancerService";

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return ApiResponse.error("User Id is missing", 409);
        }

        const freelancerService = new FreelancerService(userId)
        const profile = await freelancerService.getProfile();
        const settings = new Settings();
        const luckySpinAmount = await settings.luckySpinAmount();
    
        const luckySpinAmountValue = luckySpinAmount.value

        if (!luckySpinAmount.switch) {
            return ApiResponse.error("Lucky spin amount is not set", 409)
        }

        if (!luckySpinAmount) {
            return ApiResponse.error("Lucky spin amount is not set", 409)
        }

        if (profile.lifeTimeIncome > luckySpinAmountValue && profile.spinX <= 0) {
            return ApiResponse.success({ spin: true }, "Lucky spin is available")
        }

        if (luckySpinAmountValue * profile.spinX > profile.lifeTimeIncome.toNumber()) {
            return ApiResponse.success({ spin: true }, "Lucky spin is available")
        } else {
            return ApiResponse.success({ spin: false }, "Lucky spin is not available")
        }

    } catch (error: unknown) {
        console.error(`[CATEGORY_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the Jobs",
            500
        );
    }
}