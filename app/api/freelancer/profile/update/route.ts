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
            postalCode,
            addressLine1
        } = validation.data;

        const [address, user] = await Promise.all([
            db.address.upsert({
                where: {
                    userId: userId as string,
                },
                update: {
                    country,
                    division,
                    district,
                    subDistrict: subDivision,
                    postalCode,
                    addressLine1,
                },
                create: {
                    userId: userId as string,
                    country,
                    division,
                    district,
                    subDistrict: subDivision,
                    postalCode,
                    addressLine1,
                },
            }),


            db.user.update({
                where: { id: userId as string },
                data: {
                    fullName,
                    phoneNumber,
                }
            })
        ])

        return ApiResponse.success({ ...address, ...user }, "Get profile data")

    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while updating the profile data"
        )
    }
}