import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { Pagination } from "@/lib/pagination"; // adjust path to where your Pagination class lives

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const pagination = new Pagination(searchParams, 10);

        const [userData, totalItems] = await Promise.all([
            db.freelancer.findMany({
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
                        }
                    },
                    referKey: true,
                    totalSuccessRate: true,
                    currentBalance: true,
                    totalApproved: true,
                    totalRejected: true,
                    totalSubmitted: true,
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