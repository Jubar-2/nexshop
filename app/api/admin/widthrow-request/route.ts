import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { Pagination } from "@/lib/pagination";
import { Prisma } from "@prisma/client"; // Import Prisma for types

export async function GET(request: Request): Promise<Response> {
    try {
        // Check Role Authorization
        const role = request.headers.get("x-user-role");
        if (role !== "ADMIN") {
            return ApiResponse.error("Forbidden", 403);
        }

        const { searchParams } = new URL(request.url);
        const pagination = new Pagination(searchParams, 15);

        const status = searchParams.get("status");
        const search = searchParams.get("search");

        // Strongly Type the Where Clause
        // This ensures TypeScript knows exactly what fields are allowed.
        const whereClause: Prisma.WithdrawRequestWhereInput = {
            // Handle the status enum safely
            ...(status && { status: status as Prisma.EnumPaymentRequestStatusFilter<"WithdrawRequest"> }),

            // Handle the search logic with explicit QueryMode casting
            ...(search && {
                OR: [
                    {
                        phoneNumber: {
                            contains: search,
                            mode: 'insensitive' as Prisma.QueryMode // FIX: Cast to QueryMode
                        }
                    },
                    {
                        freelancer: {
                            user: {
                                fullName: {
                                    contains: search,
                                    mode: 'insensitive' as Prisma.QueryMode // FIX: Cast to QueryMode
                                }
                            }
                        }
                    }
                ]
            })
        };

        // Execute queries with the typed filter
        const [total, data] = await Promise.all([
            db.withdrawRequest.count({ where: whereClause }),
            db.withdrawRequest.findMany({
                where: whereClause,
                orderBy: { createdAt: "desc" },
                ...pagination.prismaOptions,
                select: {
                    id: true,
                    amount: true,
                    paymentMethod: true,
                    phoneNumber: true,
                    status: true,
                    createdAt: true,
                    freelancer: {
                        select: {
                            user: {
                                select: {
                                    fullName: true,
                                    email: true
                                }
                            }
                        }
                    }
                },
            }),
        ]);

        return ApiResponse.success({
            data,
            meta: pagination.getMetadata(total, data.length),
        }, "Records retrieved");

    } catch (error: unknown) {
        console.error("[ADMIN_WITHDRAW_GET_ERROR]:", error);
        return ApiResponse.fatal("Internal Server Error");
    }
}