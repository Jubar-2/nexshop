import { ApiResponse } from "@/lib/apiResponse";
import { JobsUpdateInSchema } from "@/lib/validations/jobs";
import db from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import Validation from "@/lib/Validation";

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
        const validation = JobsUpdateInSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        // Extract validated data
        const {
            id,
            jobTitle,
            totalSlots,
            reward,
            description,
            category,
            subCategory,
            targetLink
        } = validation.data;

        // find the job
        const findJob = await db.jobs.findUnique({
            where: { id }
        })

        if (!findJob) {
            return ApiResponse.error("job id is not valid", 400)
        }

        // Check if category and sub-category exist and are valid
        const categoryCheck = new Validation();
        await categoryCheck.existsCategoryAndSubCategory(category, subCategory);

        // If there are any validation errors related to category/sub-category, return a 400 Bad Request with details   
        if (categoryCheck.hasError()) {
            return ApiResponse.error(
                "Invalid category or sub-category",
                400,
                categoryCheck.getErrorMessage()
            );
        }

        // Create the job in the database
        const job = await db.jobs.update({
            where: {
                id
            },
            data: {
                jobTitle: jobTitle.trim(),
                totalSlots,
                reward,
                description: description.trim(),
                categoryId: category,
                subCategoryId: subCategory,
                targetLink: targetLink.trim(),
            },
        });

        return ApiResponse.success(job, "Job created successfully", 201);

    } catch (error: unknown) {

        console.error("JOB_CREATE_ERROR:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2000") {
                return ApiResponse.error(
                    "Value too long for one of the fields",
                    400
                );
            }

            if (error.code === "P2003") {
                return ApiResponse.error(
                    "User id is not exist",
                    400
                );
            }
        }

        return ApiResponse.error("Failed to create job", 500);
    }
}