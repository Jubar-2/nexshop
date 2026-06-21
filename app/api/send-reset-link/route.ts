import bcrypt from "bcrypt";
import db from "@/lib/db";
import { SignUpSchema } from "@/lib/validations/signup";
import Validation from "@/lib/Validation";
import { ApiResponse } from "@/lib/apiResponse";
import { AuthService } from "@/services/auth.service";
import { giveReferralReward } from "@/lib/helper";
import Settings from "@/lib/Settings";
import { sendVerificationEmail } from "@/lib/services/sendVerificationEmail";
import jwt from "jsonwebtoken"

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

        const { email } = validation.data;


        const user = await db.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                fullName: true,
            }
        });

        if (!user) {
            return ApiResponse.error("User is not found.", 400);
        }

        const token = jwt.sign({
            data: {
                email,
                id: user.id
            }
        }, 'secret', { expiresIn: '5m' });

        const link = `${process.env.BASE_URL}/reset-password/${token}`;

        // --- POST-TRANSACTION: Side effects (email) ---
        // Fire and don't block the response — email failure should never
        // roll back an already-committed account creation.
        sendVerificationEmail(email.trim().toLowerCase(), user.fullName, link).catch((err) => {
            console.error("[EMAIL_FAILURE]:", err);
        });

        

        return ApiResponse.success({}, "Account created successfully", 201);

    } catch (error: unknown) {
        console.error("[SIGNUP_CRITICAL_FAILURE]:", (error as Error).message);

        if ((error as Error).message === "INVALID_REFERRAL_CODE") {
            return ApiResponse.error("The referral code provided is invalid.", 400);
        }

        return ApiResponse.fatal("An internal error occurred during account creation.");
    }
}