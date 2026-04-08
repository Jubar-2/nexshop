import { ApiResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
import { subCategorySchema } from "@/lib/validations/subCategory";

export async function POST(request: Request) {
    try {

        // Safe JSON Parsing
        const body = await request.json().catch(() => null);
        if (!body) {
            return ApiResponse.error("Invalid JSON payload", 400);
        }

        // Schema Validation
           const validation = subCategorySchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const { name, categoryId } = validation.data;
        const normalizedName = name.trim();

        // Category Existence Check (reuse)
        const category = await prisma.category.findUnique({
            where: { id: categoryId },  // No parseInt (CUID)
        });

        if (!category) {
            return ApiResponse.error(`Category with ID "${categoryId}" does not exist`, 404);
        }
        
        // 5. Duplicate SubCategory Check
        const existingSubCategory = await prisma.subCategory.findFirst({
            where: {
                name: normalizedName,
                categoryId: categoryId, // Ensures uniqueness within the category
            },
        });

        if (existingSubCategory) {
            return ApiResponse.error(
                `SubCategory "${normalizedName}" already exists in Category "${category.name}"`,
                409
            );
        }

        // Database Operation
        const subCategory = await prisma.subCategory.create({
            data: {
                name: normalizedName,
                categoryId: categoryId
            },
            // Select only necessary fields for the response
            select: {
                id: true,
                name: true,
            }
        });

        return ApiResponse.success(subCategory, "Category created successfully", 201);

    } catch (error: unknown) {
        console.error(`[SUBCATEGORY_CREATE_ERROR]:`, error); // Professional logging with context
        // Professional Error Handling & Logging
        return ApiResponse.error(
            "An internal server error occurred while creating the category",
            500
        );
    }
}