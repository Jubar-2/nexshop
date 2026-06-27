import bcrypt from "bcrypt";
import db from "@/lib/db";
import { ApiResponse } from "@/lib/apiResponse";
import { checkUserId } from "@/lib/helper";
import { PasswordSchema } from "@/lib/validations/changePassword";

/**
 * Final step of forgot-password flow.
 * Requires a valid reset_token cookie issued by /api/verify-otp.
 */
export async function PATCH(request: Request) {
    try {

        // Authenticate identity from Proxy headers.
        const userId = checkUserId(request);
        if (!userId) {
            return ApiResponse.error("Authentication required", 401);
        }

        const body = await request.json().catch(() => null);
        if (!body) return ApiResponse.error("Invalid JSON payload", 400);

        const validation = PasswordSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const { currentPassword, newPassword } = validation.data;

        const [user, hashedPassword] = await Promise.all([
            db.user.findUnique({
                where: { id: userId as string },
                select: { id: true, password: true },
            }),
            bcrypt.hash(newPassword, 12),
        ]);

        if (!user) {
            return ApiResponse.error("Account not found.", 404);
        }

        if (!user.password) {
            return ApiResponse.error("Account password is not match.", 404, {
                currentPassword: ["Account password is not match."],
            });
        }

        const comparePassword = await bcrypt.compare(currentPassword, user.password)

        if (!comparePassword) {
            return ApiResponse.error("Account password is not match.", 404, {
                currentPassword: ["Account password is not match."],
            });
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