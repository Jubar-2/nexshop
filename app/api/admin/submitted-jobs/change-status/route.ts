import { ApiResponse } from "@/lib/apiResponse";
import { ChangeStatusSchema, ChangeSubmitJobStatusSchema, JobsUpdateInSchema } from "@/lib/validations/jobs";
import db from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

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
        const validation = ChangeSubmitJobStatusSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        // Extract validated data
        const { id, status, freelancerId } = validation.data;

        // find the job
        const findJob = await db.submittedJob.findFirst({
            where: {
                AND: {
                    id,
                    freelancer: {
                        id: freelancerId
                    }
                }
            },
            include: {
                job: {
                    include: {
                        category: true,
                        subCategory: true
                    }
                }
            }
        });

        if (!findJob) {
            return ApiResponse.error("job id is not valid", 400)
        }

        const findSkill = await db.skill.findFirst({
            where: {
                AND: {
                    freelancerId,
                    categoryId: findJob.job.categoryId,
                    subCategoryId: findJob.job.subCategoryId,
                }
            }
        });

        const totalJob = await db.submittedJob.count({
            where: {
                freelancerId,
                job: {
                    subCategoryId: findJob.job.subCategoryId,
                },
                NOT: {
                    status: "PENDING"
                }
            }
        });

        const totalSuccessJob = await db.submittedJob.count({
            where: {
                freelancerId,
                job: {
                    subCategoryId: findJob.job.subCategoryId,
                },

                status: "APPROVED"
            }
        });

        let updateTotalJob = 0;

        if (status === "APPROVED") {
            updateTotalJob = 1
        } else if (status === "REJECTED") {
            updateTotalJob = -1
        }

        const percentage = totalSuccessJob * 100 / totalJob + updateTotalJob || 0;

        const result = await db.$transaction(async tx => {
            const updateStatus = await tx.submittedJob.update({
                where: {
                    id
                },
                data: { status }
            });

            if (!findSkill) {
                await tx.skill.create({
                    data: {
                        freelancerId: findJob.freelancerId,
                        categoryId: findJob.job.categoryId,
                        subCategoryId: findJob.job.subCategoryId,
                        successRate: percentage
                    }
                })
            } else {
                await tx.skill.updateMany({
                    where: {
                        freelancerId: findJob.freelancerId,
                        categoryId: findJob.job.categoryId,
                        subCategoryId: findJob.job.subCategoryId,
                    },
                    data: {
                        successRate: percentage
                    }
                });
            }

            if (status === "APPROVED") {
                await tx.freelancer.update({
                    where: {
                        id: freelancerId
                    },
                    data: {
                        lifeTimeIncome: {
                            increment: findJob.reward,
                        },
                        currentBalance: {
                            increment: findJob.reward
                        }
                    }
                });
            }

            if (status === "REJECTED") {

                if (findJob.status === "APPROVED") {
                    await tx.freelancer.update({
                        where: {
                            id: freelancerId
                        },
                        data: {
                            lifeTimeIncome: {
                                decrement: findJob.reward,
                            },
                            currentBalance: {
                                decrement: findJob.reward
                            }
                        }
                    });
                }

                await tx.jobs.update({
                    where: {
                        id: findJob.jobId
                    },
                    data: {
                        submissionCount: {
                            decrement: 1
                        }
                    }
                });
            }

            return updateStatus

        })

        return ApiResponse.success(result, "Job created successfully", 201);

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