import jwt from "jsonwebtoken";
import db from "@/lib/db";
import { ApiResponse } from "@/lib/apiResponse";
import { otpSchema } from "@/lib/validations/otpCode";

/**
 * Verifies the OTP for the forgot-password flow.
 * On success, issues a short-lived reset_token cookie that authorizes
 * the next step (changing the password) without re-checking the OTP.
 */
export async function PATCH(request: Request) {
    try {
        // --- Read verify_token cookie (issued by /api/forgot-password) ---
        const email = request.headers.get('x-user-email');
        if (!email) {
            return ApiResponse.error("User email is not found", 401);
        }

        const body = await request.json().catch(() => null);
        if (!body) return ApiResponse.error("Invalid JSON payload", 400);

        const validation = otpSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const { otp } = validation.data;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await db.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true },
        });

        if (!user) {
            return ApiResponse.error("Account not found.", 404);
        }

        const verification = await db.verificationCode.findUnique({
            where: { email: normalizedEmail },
            select: {
                code: true,
                expired: true,
                used: true,
                block: true,
                unlockDate: true,
            },
        });

        if (!verification) {
            return ApiResponse.error("No OTP request found. Please request a new OTP.", 400);
        }

        const now = new Date();

        // if (verification.block && verification.unlockDate && verification.unlockDate > now) {
        //     return ApiResponse.error("Too many attempts. Please try again later.", 400);
        // }

        if (verification.used) {
            return ApiResponse.error("This OTP has already been used.", 400);
        }

        if (verification.expired < now) {
            return ApiResponse.error("OTP has expired. Please request a new one.", 400);
        }

        if (verification.code !== otp) {
            return ApiResponse.error("Invalid OTP.", 400);
        }

        // Mark OTP as used so it can't be replayed
        await db.verificationCode.update({
            where: { email: normalizedEmail },
            data: { used: true, code: "" },
        });

        // Issue a short-lived reset token — authorizes ONLY the password change step
        const resetToken = jwt.sign(
            { id: user.id, email: normalizedEmail, purpose: "password_reset" },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "10m" }
        );

        return ApiResponse.success(
            {},
            "OTP verified. You may now reset your password.",
            200,
            {
                cookie: {
                    name: "reset_token",
                    value: resetToken,
                    maxAge: 60 * 10, // 10 minutes
                },
                clearCookie: { name: "verify_token" },
            }
        );

    } catch (error: unknown) {
        console.error("[OTP_VERIFY_CRITICAL_FAILURE]:", (error as Error).message);
        return ApiResponse.fatal("An internal error occurred during verification.");
    }
}