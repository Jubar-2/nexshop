import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";

export async function GET(request: Request) {
    try {

        const email = request.headers.get('x-user-email');
        
        if (!email) {
            return ApiResponse.error("User email is not found", 401);
        }

        const userData = await db.user.findUnique({
            where: { email: email as string },
            select: {
                verificationCode: true
            }
        });

        if (!userData) {
            return ApiResponse.error("User profile is not found", 401);
        }

        return ApiResponse.success(userData, "Get profile data")
    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while fetching the profile data"
        )
    }
}