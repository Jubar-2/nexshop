import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { Pagination } from "@/lib/pagination";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
    try {


        const { searchParams } = new URL(request.url);
        const pagination = new Pagination(searchParams, 15);

        const status = searchParams.get("status");
        const search = searchParams.get("search");

        // STATUS VALIDATION
        const statusInputs: Array<string> = ["ACTIVE", "INACTIVE", "COMPLETED"];
        if (status && !statusInputs.some(e => status === e)) {
            return ApiResponse.error("Status is invalid", 401);
        }

        const whereClause: Prisma.JobsWhereInput = {
            // Validate status enum casting
            ...(status && { status: status as Prisma.EnumJobStatusFilter<"Jobs"> }),

            // We search by ID (String) and FullName (String).
            // We REMOVED 'createdAt' because you cannot use 'contains' on a Date.
            ...(search && {
                OR: [
                    {
                        jobTitle: {
                            contains: search.trim() || "",
                            mode: 'insensitive'
                        }
                    }
                ]
            })
        };

        const [total, jobs] = await Promise.all([
            db.jobs.count({ where: whereClause }),

            db.jobs.findMany({
                where: whereClause,
                ...pagination.prismaOptions,
                select: {
                    id: true,
                    jobTitle: true,
                    targetLink: true,
                    description: true,
                    workerRequired: true,
                    reward: true,
                    status: true,
                    category: {
                        select: {
                            name: true,
                            icon: true
                        }
                    },
                    subCategory: {
                        select: { name: true }
                    },
                    createdAt: true
                }
            })

        ])
        // Optimized Database Query

        // Handle Not Found
        if (!jobs) {
            return ApiResponse.error("Jobs are not found", 404);
        }

        // Professional Success Response
        return ApiResponse.success({
            data: jobs,
            meta: pagination.getMetadata(total, jobs.length)
        }, "Jobs data retrieved");

    } catch (error) {
        // Professional Logging with context
        console.error(`[CATEGORY_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the Jobs",
            500
        );
    }
}