import bcrypt from "bcrypt";
import db from "@/lib/db";
import Validation from "@/lib/Validation";
import { ApiResponse } from "@/lib/apiResponse";
import { AuthService } from "@/services/auth.service";
import { giveReferralReward } from "@/lib/helper";
import Settings from "@/lib/Settings";
import { sendVerificationEmail } from "@/lib/services/sendVerificationEmail";
import jwt from "jsonwebtoken";
import { ForgotPasswordSchema } from "@/lib/validations/forgotPassword";

/**
 * Handles OTP generation and rate-limiting for user verification.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        if (!body) return ApiResponse.error("Invalid JSON payload", 400);

        const validation = ForgotPasswordSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error("Validation failed", 400, validation.error.flatten().fieldErrors);
        }

        const { email } = validation.data;
        const normalizedEmail = email.toLowerCase().trim();

        // Single database hit using relation include
        const user = await db.user.findUnique({
            where: { email: normalizedEmail },
            select: {
                id: true,
                fullName: true,
                email: true,
                // Assuming relation is named 'verificationCode' in your Prisma Schema
                verificationCode: {
                    select: {
                        limit: true,
                        block: true,
                        unlockDate: true,
                    }
                }
            }
        });

        if (!user) {
            return ApiResponse.error("Account not found.", 404);
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiry

        const verification = user.verificationCode;

        if (verification) {
            const now = new Date();

            // Check if account is currently locked
            if (verification.block && verification.unlockDate && verification.unlockDate > now) {
                return ApiResponse.error("OTP requests are temporarily locked. Please try again later.", 400);
            }

            // Calculate new limit safely
            const currentLimit = verification.limit ?? 0;
            const newLimit = currentLimit + 1;

            const updateData: any = {
                code: verifyCode,
                expired: verifyCodeExpiry,
                used: false,
                limit: newLimit,
                block: false,
                unlockDate: null
            };

            // Max 3 attempts allowed, then lock for 30 minutes
            if (newLimit >= 3) {
                updateData.limit = 0; // Reset counter for next cycle after unlock
                updateData.block = true;
                updateData.unlockDate = new Date(Date.now() + 30 * 60 * 1000); // 30 mins lock
            }

            await db.verificationCode.update({
                where: { email: normalizedEmail },
                data: updateData
            });

        } else {
            // First time requesting OTP
            await db.verificationCode.create({
                data: {
                    email: normalizedEmail,
                    code: verifyCode,
                    limit: 1,
                    expired: verifyCodeExpiry,
                    used: false,
                    block: false,
                }
            });
        }

        // 2. Post-Transaction: Async background task for Email
        // Always pass user context correctly (user.fullName)
        sendVerificationEmail(normalizedEmail, user.fullName, verifyCode).catch((err) => {
            console.error(`[EMAIL_FAILURE] for ${normalizedEmail}:`, err);
        });

        // --- JWT TOKEN GENERATION ---
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '5m' }
        );

        return ApiResponse.success({}, "Verification OTP sent successfully", 200, {
            cookie: {
                name: "verify_token",
                value: token,
                maxAge: 60 * 5
            }
        });

    } catch (error: unknown) {
        console.error("[OTP_GEN_CRITICAL_FAILURE]:", (error as Error).message);
        return ApiResponse.fatal("An internal error occurred during processing.");
    }
}