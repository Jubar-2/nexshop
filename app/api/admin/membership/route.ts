import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db"; // Professional singleton
import { Pagination } from "@/lib/pagination";
import { Prisma } from "@prisma/client";

export async function GET(request: Request): Promise<Response> {
    try {

        // Initialize Pagination and Extract Search Filters
        const { searchParams } = new URL(request.url);
        const pagination = new Pagination(searchParams, 15); // Default to 15 records per page

        const status = searchParams.get("status");
        const search = searchParams.get("search");

        const whereClause: Prisma.MembershipPlanWhereInput = {
            // ...(status && { status: status as Prisma.EnumPaymentRequestStatusFilter<"MembershipPlan"> }),
            ...(search && {
                OR: [
                    {
                        membershipName: {
                            contains: search,
                            mode: 'insensitive' as Prisma.QueryMode
                        }
                    }
                ]
            })
        };

        // Optimized Database Query


        const [total, membershipPlan] = await Promise.all([
            db.membershipPlan.count({ where: whereClause }),
            db.membershipPlan.findMany({
                where: whereClause,
                select: {
                    id: true,
                    membershipName: true,
                    jobsSubmitLimit: true,
                    limitParDay: true,
                    description: true,
                    planOrder: true,
                    price: true,
                    icon: true,
                    color: true,
                    _count: {
                        select: {
                            freelancers: true
                        }
                    }
                },
                orderBy: {
                    planOrder: 'asc'
                }
            })
        ])

        // Handle Not Found
        if (!membershipPlan) {
            return ApiResponse.error("Membership plan are not found", 404);
        }

        // Professional Success Response
        // return ApiResponse.success(membershipPlan, "Membership plan retrieved", 201);

        return ApiResponse.success({
            data: membershipPlan,
            meta: pagination.getMetadata(total, membershipPlan.length),
        }, "Membership plans retrieved");

    } catch (error) {
        // Professional Logging with context
        console.error(`[MEMBERSHIP_PLAN_GET_BY_ID_ERROR]:`, error);

        return ApiResponse.error(
            "An internal server error occurred while fetching the offers",
            500
        );
    }
}