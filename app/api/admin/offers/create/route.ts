import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { OffersInSchema } from "@/lib/validations/offers";

export async function POST(request: Request) {
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
        const validation = OffersInSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        // Extract validated data
        const { offerTitle } = validation.data;

        // Create the offer in the database
        const offers = await db.offers.create({
            data: {
                offerTitle: offerTitle.trim()
            },
        });

        return ApiResponse.success(offers, "Offer created successfully", 201);

    } catch (error: unknown) {

        console.error("JOB_CREATE_ERROR:", error);
        return ApiResponse.error("Failed to create offer", 500);
    }
}