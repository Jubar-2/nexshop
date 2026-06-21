import bcrypt from "bcrypt";
import db from "@/lib/db";
import { ApiResponse } from "@/lib/apiResponse";
import { ResetPasswordSchema } from "@/lib/validations/resetPassword";

/**
 * Final step of forgot-password flow.
 * Requires a valid reset_token cookie issued by /api/verify-otp.
 */
export async function PATCH(request: Request) {
    try {

        const email = request.headers.get('x-user-email');
        if (!email) {
            return ApiResponse.error("User email is not found", 401);
        }

        const body = await request.json().catch(() => null);
        if (!body) return ApiResponse.error("Invalid JSON payload", 400);

        const validation = ResetPasswordSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const { password } = validation.data;
        const normalizedEmail = email.toLowerCase().trim();

        const [user, hashedPassword] = await Promise.all([
            db.user.findUnique({
                where: { email: normalizedEmail },
                select: { id: true },
            }),
            bcrypt.hash(password, 12),
        ]);

        if (!user) {
            return ApiResponse.error("Account not found.", 404);
        }

        await db.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return ApiResponse.success(
            {},
            "Password reset successfully. Please sign in with your new password.",
            200,
            {
                clearCookie: { name: "reset_token" },
            }
        );

    } catch (error: unknown) {
        console.error("[RESET_PASSWORD_CRITICAL_FAILURE]:", (error as Error).message);
        return ApiResponse.fatal("An internal error occurred while resetting your password.");
    }
}