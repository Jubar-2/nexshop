import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { categorySchema } from "@/lib/validations/category";
// import { getServerSession } from "next-auth"; 
// import { authOptions } from "@/lib/auth"; 

export async function POST(request: Request) {
    try {
        // Security Check: Ensure only ADMINS can create categories
        // const session = await getServerSession(authOptions);
        // if (!session || session.user.role !== "ADMIN") {
        //     return ApiResponse.error("Unauthorized: Admin access required", 401);
        // }

        // Safe JSON Parsing
        const body = await request.json().catch(() => null);
        if (!body) {
            return ApiResponse.error("Invalid JSON payload", 400);
        }

        // Schema Validation
        const validation = categorySchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const { name } = validation.data;
        const normalizedName = name.trim();

        // Duplicate Check (Optimization: Check before Create)
        // This prevents the DB from throwing a generic 500 error on unique constraint
        const existingCategory = await db.category.findUnique({
            where: { name: normalizedName }
        });

        if (existingCategory) {
            return ApiResponse.error(`Category "${normalizedName}" already exists`, 409);
        }

        // Database Operation
        const category = await db.category.create({
            data: { name: normalizedName },
            // Select only necessary fields for the response
            select: {
                id: true,
                name: true,
            }
        });

        return ApiResponse.success(category, "Category created successfully", 201);

    } catch (error: unknown) {
        console.error(`[CATEGORY_CREATE_ERROR]:`, error); // Professional logging with context
        // Professional Error Handling & Logging
        return ApiResponse.error(
            "An internal server error occurred while creating the category",
            500
        );
    }
}