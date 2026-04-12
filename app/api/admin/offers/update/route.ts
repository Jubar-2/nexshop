import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { OffersUpdateInSchema } from "@/lib/validations/offers";

export async function PATCH(request: Request) {
    try {
        // const session = await getServerSession(authOptions);

        // if (!session || session.user.role !== "ADMIN" || !session.user.id) {
        //     return ApiResponse.error("Forbidden: Admin access required", 403);
        // }

        // Safe JSON parsing with error handling
        const body = await request.json().catch(() => null);
        if (!body) {
            return ApiResponse.error("Invalid JSON payload", 400);
        }

        // Validate input using Zod schema
        const validation = OffersUpdateInSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        // Extract validated data
        const { offerTitle, id } = validation.data;

        // find the job
        const findOffer = await db.offers.findUnique({
            where: { id }
        })

        if (!findOffer) {
            return ApiResponse.error("Offer id is not valid", 400)
        }

        // Create the job in the database
        const offer = await db.offers.update({
            where: { id },
            data: {
                offerTitle: offerTitle.trim()
            },
        });

        return ApiResponse.success(offer, "Offer created successfully", 201);

    } catch (error: unknown) {

        console.error("OFFER_CREATE_ERROR:", error);
        return ApiResponse.error("Failed to create offer", 500);
    }
}