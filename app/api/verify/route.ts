import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId, giveReferralReward } from "@/lib/helper";
import Settings from "@/lib/Settings";
import { otpSchema } from "@/lib/validations/otpCode";

export async function PATCH(request: Request) {

    try {
        const userId = checkUserId(request);

        if (!userId) {
            return ApiResponse.error("User Id is missing", 409);
        }

        const body = await request.json().catch(() => null);
        if (!body) {
            return ApiResponse.error("Invalid JSON payload", 400);
        }

        // Validate input using Zod schema
        const validation = otpSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const { otp } = validation.data;

        const user = await db.user.findUnique({
            where: {
                id: userId as string
            },
            select: {
                verifyCode: true,
                verifyCodeExpiry: true,
                status: true,
                freelancer: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!user) {
            return ApiResponse.error("user is not found", 400);
        }

        if (user.status === "ACTIVE") {
            return ApiResponse.error("user is already verified", 400);
        }

        // Check if the code is correct and not expired
        const isCodeNotExpired = user?.verifyCodeExpiry && new Date(user.verifyCodeExpiry) < new Date();

        if (isCodeNotExpired) {
            return ApiResponse.error("Verify code is expired", 400);
        }

        // Check if the code is correct and not expired
        const isCodeValid = user.verifyCode === otp;
        if (!isCodeValid) {
            return ApiResponse.error("Otp is not valid", 404);
        }

        const userUpdate = await db.user.update({
            where: {
                id: userId as string
            },
            data: {
                status: "ACTIVE"
            }
        })

        const referralHistory = await db.referralHistory.findUnique({
            where: {
                receiverId: user.freelancer?.id as string
            }
        });

        if (!referralHistory) {
            return ApiResponse.success(userUpdate, "Get profile data")
        }

        const referrer = await db.freelancer.findUnique({ where: { referKey: referralHistory.referralCode } });

        if (!referrer) {
            return ApiResponse.success(userUpdate, "Get profile data")
        }

        // Trigger Referral MLM Logic
        if (referrer) {
            const referralCreate = await db.referral.create({
                data: {
                    senderId: referrer.id,
                    receiverId: user.freelancer?.id as string,
                }
            });

            const settingsData = new Settings();

            const [getOne, getTwo, getThree] = await Promise.all([
                settingsData.genOneAmount(),
                settingsData.genTwoAmount(),
                settingsData.genThreeAmount()
            ]);

            // Distribute 3 generations of rewards
            // await giveReferralReward(tx, referral.id, referrer.id, 1, 3, { getOne, getTwo, getThree });
            giveReferralReward(db, referralCreate.id, referrer.id, 3, { getOne, getTwo, getThree });
        }

        return ApiResponse.success(userUpdate, "Get profile data")

    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while fetching the profile data"
        )
    }
}