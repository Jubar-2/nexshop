import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper";
import { sendVerificationEmail } from "@/lib/services/sendVerificationEmail";

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

        const user = await db.user.findUnique({
            where: {
                id: userId as string
            },
            select: {
                verifyCode: true,
                verifyCodeExpiry: true,
                status: true,
                fullName: true,
                email: true
            }
        });

        if (!user) {
            return ApiResponse.error("user is not found", 400);
        }

        if (user.status === "ACTIVE") {
            return ApiResponse.error("user is already verified", 400);
        }

        // Check if the code is correct and not expired
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (user.verifyCodeExpiry && isCodeNotExpired) {
            return ApiResponse.error("verify code is not expired", 400);
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpiry = new Date(Date.now() + 2 * 60 * 1000);

        await db.user.update({
            where: {
                id: userId as string
            },
            data: {
                verifyCode,
                verifyCodeExpiry
            }
        });

        sendVerificationEmail(user.email.trim().toLowerCase(), user.fullName, verifyCode).catch((err) => {
            console.error("[EMAIL_FAILURE]:", err);
        });

        return ApiResponse.success({}, "Get profile data")

    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while fetching the profile data"
        )
    }
}