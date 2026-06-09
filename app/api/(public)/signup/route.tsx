import bcrypt from "bcrypt";
import db from "@/lib/db";
import { SignUpSchema } from "@/lib/validations/signup";
import Validation from "@/lib/Validation";
import { ApiResponse } from "@/lib/apiResponse";
import { AuthService } from "@/services/auth.service";
import { giveReferralReward } from "@/lib/helper";
import Settings from "@/lib/Settings";

/**
 * Handles multi-step user registration including MLM referral processing.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        if (!body) return ApiResponse.error("Invalid JSON payload", 400);

        const validation = SignUpSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error("Validation failed", 400, validation.error.flatten().fieldErrors);
        }

        const { fullName, email, password, phoneNumber, referCode } = validation.data;

        // Perform async conflict checks (Email/Phone)
        const v = new Validation();
        await Promise.all([v.emailConflict(email), v.phoneNumberConflict(phoneNumber)]);
        if (v.hasError()) return ApiResponse.error("Conflict detected", 409, v.getErrorMessage());

        const hashedPassword = await bcrypt.hash(password, 12);

        // --- EXECUTE ATOMIC WORKFLOW ---
        const result = await db.$transaction(async (tx) => {
            // Get Default Plan
            const defaultPlan = await tx.membershipPlan.findFirst({ where: { isDefault: true } });
            if (!defaultPlan) throw new Error("SYSTEM_CONFIG_ERROR: Default plan missing");

            // Create Base User
            const user = await tx.user.create({
                data: {
                    fullName,
                    phoneNumber: phoneNumber.trim(),
                    email: email.trim().toLowerCase(),
                    password: hashedPassword
                },
                select: { id: true, fullName: true, email: true }
            });

            // Process Referral Code if provided
            let referrer = null;
            if (referCode) {
                referrer = await tx.freelancer.findUnique({ where: { referKey: referCode } });
                if (!referrer) throw new Error("INVALID_REFERRAL_CODE");
            }

            // Create Freelancer Profile (Shared Transaction)
            const freelancer = await AuthService.registerFreelancer(tx, user.id, defaultPlan.id);

            // Trigger Referral MLM Logic
            if (referrer) {
                const referral = await tx.referral.create({
                    data: {
                        senderId: referrer.id,
                        receiverId: freelancer.id,
                    }
                });

                const settingsData = new Settings();

                const [getOne, getTwo, getThree] = await Promise.all([
                    settingsData.genOneAmount(),
                    settingsData.genTwoAmount(),
                    settingsData.genThreeAmount()
                ])

                // Distribute 3 generations of rewards
                // await giveReferralReward(tx, referral.id, referrer.id, 1, 3, { getOne, getTwo, getThree });
                await giveReferralReward(tx, referral.id, referrer.id, 3, { getOne, getTwo, getThree });
            }

            return { user, freelancer };
        });

        return ApiResponse.success(result, "Account created successfully", 201);

    } catch (error: unknown) {
        console.error("[SIGNUP_CRITICAL_FAILURE]:", (error as Error).message);

        if ((error as Error).message === "INVALID_REFERRAL_CODE") {
            return ApiResponse.error("The referral code provided is invalid.", 400);
        }

        return ApiResponse.fatal("An internal error occurred during account creation.");
    }
}