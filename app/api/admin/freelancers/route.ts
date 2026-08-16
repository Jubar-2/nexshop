import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { Pagination } from "@/lib/pagination"; // adjust path to where your Pagination class lives
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const search = searchParams.get("search");

        const pagination = new Pagination(searchParams, 10);

        // Define the Where Clause with correct typing
        const whereClause: Prisma.FreelancerWhereInput = {

            // We search by ID (String) and FullName (String).
            // We REMOVED 'createdAt' because you cannot use 'contains' on a Date.
            ...(search && {
                OR: [
                    {
                        user: {
                            fullName: {
                                contains: search,
                                mode: 'insensitive' as Prisma.QueryMode
                            },
                            email: {
                                contains: search,
                                mode: 'insensitive' as Prisma.QueryMode
                            }
                        }
                    }
                ]
            })
        };

        const [userData, totalItems] = await Promise.all([
            db.freelancer.findMany({
                where: whereClause,
                ...pagination.prismaOptions,
                select: {
                    membershipPlan: {
                        select: {
                            id: true,
                            membershipName: true,
                            jobsSubmitLimit: true,
                            description: true,
                            planOrder: true,
                            offers: true,
                        }
                    },
                    user: {
                        select: {
                            fullName: true,
                            email: true,
                            avatar: true,
                            status: true,
                        }
                    },
                    referKey: true,
                    totalSuccessRate: true,
                    currentBalance: true,
                    totalApproved: true,
                    totalRejected: true,
                    totalSubmitted: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            }),
            db.freelancer.count(),
        ]);

        const meta = pagination.getMetadata(totalItems, userData.length);

        return ApiResponse.success({ data: userData, meta }, "Get freelancers data", 200);

    } catch (error) {
        console.log(error);
        return ApiResponse.fatal(
            "An internal server error occurred while fetching the profile data"
        );
    }
}