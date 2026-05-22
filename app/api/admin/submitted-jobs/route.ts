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
        const statusInputs: Array<string> = ["PENDING", "APPROVED", "REJECTED"];
        if (status && !statusInputs.some(e => status === e)) {
            return ApiResponse.error("Status is invalid", 401);
        }

        const whereClause: Prisma.SubmittedJobWhereInput = {
            // Validate status enum casting
            ...(status && { status: status as Prisma.EnumSubmittedJobStatusFilter<"SubmittedJob"> }),

            // We search by ID (String) and FullName (String).
            // We REMOVED 'createdAt' because you cannot use 'contains' on a Date.
            ...(search && {
                OR: [
                    {
                        job: {
                            jobTitle: {
                                contains: search.trim() || "",
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        freelancer: {
                            user: {
                                email: {
                                    contains: search.trim() || "",
                                    mode: 'insensitive'
                                }
                            }
                        }
                    }
                ]
            })
        };

        const [total, jobs] = await Promise.all([
            db.submittedJob.count({ where: whereClause }),

            db.submittedJob.findMany({
                where: whereClause,
                ...pagination.prismaOptions,
                select: {
                    id: true,
                    jobId: true,
                    freelancerId: true,
                    submissionNotes: true,
                    proofAttachment: true,
                    profileLink: true,
                    reward: true,
                    status: true,
                    submittedAt: true,

                    // Relations
                    job: {
                        select: {
                            id: true,
                            jobTitle: true,
                            targetLink: true,
                            description: true,
                            workerRequired: true,
                            reward: true,
                            status: true,
                            submissionCount: true,
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

                    },
                    freelancer: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    email: true,
                                    fullName: true,
                                    avatar: true
                                }
                            }
                        }
                    }


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