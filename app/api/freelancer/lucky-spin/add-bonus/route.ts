import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import FreelancerService from "@/lib/freelancer/FreelancerService";
import Settings from "@/lib/Settings";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: Request) {
    try {
        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return ApiResponse.error("User Id is missing", 409);
        }

        // -------------------------
        // GET PROFILE
        // -------------------------
        const freelancerService = new FreelancerService(userId);
        const profile = await freelancerService.getProfile();

        // -------------------------
        // GET SETTINGS
        // -------------------------
        const settings = new Settings();
        const luckySpinSetting = await settings.luckySpinAmount();

        if (!luckySpinSetting?.switch) {
            return ApiResponse.error("Lucky spin is disabled", 409);
        }

        const spinValue = new Decimal(luckySpinSetting.value);
        const lifeTimeIncome = new Decimal(profile.lifeTimeIncome);

        let spinX: number;
        let luckySpinAmounts: Decimal;

        // -------------------------
        // BUSINESS LOGIC
        // -------------------------
        if (lifeTimeIncome.gt(spinValue) && profile.spinX <= 0) {
            spinX = profile.spinX + 2;
            luckySpinAmounts = spinValue;
        }
        else if (spinValue.mul(profile.spinX).gt(lifeTimeIncome)) {
            spinX = profile.spinX + 2;
            luckySpinAmounts = spinValue.mul(spinX);
        }
        else {
            return ApiResponse.success(
                { spin: false },
                "Lucky spin is not available"
            );
        }

        // -------------------------
        // TRANSACTION
        // -------------------------
        const result = await db.$transaction(async (tx) => {

            const freelancer = await tx.freelancer.update({
                where: { userId },
                data: {
                    spinX,
                    currentBalance: {
                        increment: luckySpinAmounts,
                    },
                    lifeTimeIncome: {
                        increment: luckySpinAmounts,
                    },
                },
            });

            const luckySpin = await tx.luckySpin.create({
                data: {
                    freelancerId: profile.id,
                    reword: luckySpinAmounts,
                },
            });

            return { freelancer, luckySpin };
        });

        // -------------------------
        // RESPONSE
        // -------------------------
        return ApiResponse.success(
            result,
            "Lucky spin added successfully"
        );

    } catch (error) {
        console.error("[SIGNUP_CRITICAL_FAILURE]:", (error as Error).message);

        if ((error as Error).message === "INVALID_REFERRAL_CODE") {
            return ApiResponse.error("The referral code provided is invalid.", 400);
        }

        return ApiResponse.fatal("An internal error occurred during account creation.");
    }
}