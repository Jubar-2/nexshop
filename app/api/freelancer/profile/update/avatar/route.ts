import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper";
import { imageUploader } from "@/services/image-upload";
import { AvatarSchema } from "@/lib/validations/profile";

export async function PATCH(request: Request) {
    try {

        const userId = checkUserId(request);

        const formData = await request.formData();
        const rawData = {
            avatar: formData.get("avatar"),
        };

        // Validate input using Zod schema
        const validation = AvatarSchema.safeParse(rawData);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const { avatar } = validation.data;

        // EXTERNAL SERVICE (IMAGE UPLOAD)
        // Only upload AFTER all logic guards pass to save your ImgBB quota/bandwidth
        const imageLink = await imageUploader.upload(avatar);

        const profile = await db.user.update({
            where: { id: userId as string },
            data: {
                avatar: imageLink
            }
        });

        return ApiResponse.success(profile, "Update avatar")

    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while updating the profile data"
        )
    }
}