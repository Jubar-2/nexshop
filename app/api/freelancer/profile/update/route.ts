import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper";
import { ProfileSchema } from "@/lib/validations/profile";

export async function PATCH(request: Request) {
    try {

        const userId = checkUserId(request);

        const body = await request.json().catch(() => null);
        if (!body) {
            return ApiResponse.error("Invalid JSON payload", 400);
        }

        // Validate input using Zod schema
        const validation = ProfileSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const {
            fullName,
            phoneNumber,
            country,
            division,
            district,
            subDivision,
            postalCode
        } = validation.data;

        const profile = await db.user.update({
            where: { id: userId as string },
            data: {
                fullName,
                phoneNumber,
                country,
                division,
                district,
                subDivision,
                postalCode
            }
        });

        return ApiResponse.success(profile, "Get profile data")

    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while updating the profile data"
        )
    }
}