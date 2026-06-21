import { ApiResponse } from "@/lib/apiResponse";
import { sendVerificationEmail } from "@/lib/services/sendVerificationEmail";

export async function GET(request: Request) {
    try {
        

        const sentEmail = await sendVerificationEmail("jubaer00032@gmail.com", "Md Jubaer", "145236");

        return ApiResponse.success(sentEmail, "Account created successfully", 201);

    } catch (error) {
        // Logging with context
        console.error(`[CATEGORY_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the Jobs",
            500
        );
    }
}


