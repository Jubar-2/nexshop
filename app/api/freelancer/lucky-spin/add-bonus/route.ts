import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import FreelancerService from "@/lib/freelancer/FreelancerService";
import Settings from "@/lib/Settings";

export async function POST(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return ApiResponse.error("User Id is missing", 409);
        }

        const freelancerService = new FreelancerService(userId)
        const profile = await freelancerService.getProfile();

        const settings = new Settings();
        const luckySpinAmount = await settings.luckySpinAmount();

        if (!luckySpinAmount.switch) {
            return ApiResponse.error("Lucky spin amount is not set", 409)
        }

        if (!luckySpinAmount) {
            return ApiResponse.error("Lucky spin amount is not set", 409)
        }

        let spinX, luckySpinAmounts;

        if (profile.lifeTimeIncome > luckySpinAmount && profile.spinX <= 0) {
            spinX = profile.spinX + 2;
            luckySpinAmounts = luckySpinAmount;
        } else if (luckySpinAmount.toNumber() * profile.spinX > profile.lifeTimeIncome.toNumber()) {
            spinX = profile.spinX + 2;
            luckySpinAmounts = luckySpinAmount.toNumber() * spinX;

            // return ApiResponse.success({ spin: true }, "Lucky spin is available")

        } else {
            return ApiResponse.success({ spin: false }, "Lucky spin is not available")
        }

        const result = db.$transaction(async (tx) => {
            const freelancer = await tx.freelancer.update({
                where: { userId: userId },
                data: {
                    spinX: spinX,
                    currentBalance: {
                        increment: luckySpinAmounts
                    },
                    lifeTimeIncome: {
                        increment: luckySpinAmounts
                    }
                }
            });

            const luckySpin = await tx.luckySpin.create({
                freelancerId: profile.id,
                reword: luckySpinAmounts,
            });

            return { freelancer, luckySpin }
        })

        return ApiResponse.success(result, "Add lucky bonus successful")

    } catch (error) {
        console.error("[SIGNUP_CRITICAL_FAILURE]:", (error as Error).message);

        if ((error as Error).message === "INVALID_REFERRAL_CODE") {
            return ApiResponse.error("The referral code provided is invalid.", 400);
        }

        return ApiResponse.fatal("An internal error occurred during account creation.");
    }
}