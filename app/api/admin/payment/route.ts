import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { Pagination } from "@/lib/pagination";
import { Prisma } from "@prisma/client";

export async function GET(request: Request): Promise<Response> {
    try {
        const role = request.headers.get("x-user-role");
        if (role !== "ADMIN") {
            return ApiResponse.error("Forbidden", 403);
        }

        const { searchParams } = new URL(request.url);
        const pagination = new Pagination(searchParams, 15);

        const status = searchParams.get("status");
        const search = searchParams.get("search");

        // Define the Where Clause with correct typing
        const whereClause: Prisma.TransactionWhereInput = {
            // Validate status enum casting
            ...(status && { status: status as Prisma.EnumTransactionStatusFilter<"Transaction"> }),

            // We search by ID (String) and FullName (String).
            // We REMOVED 'createdAt' because you cannot use 'contains' on a Date.
            ...(search && {
                OR: [
                    {
                        freelancer: {
                            user: {
                                fullName: {
                                    contains: search,
                                    mode: 'insensitive' as Prisma.QueryMode
                                }
                            }
                        }
                    }
                ]
            })
        };

        // Execute queries
        const [total, data] = await Promise.all([
            db.transaction.count({ where: whereClause }),
            db.transaction.findMany({
                where: whereClause,
                orderBy: { createdAt: "desc" },
                ...pagination.prismaOptions,
                select: {
                    id: true,
                    amount: true,
                    invoiceId: true,
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
        console.error("[ADMIN_TRANSACTION_GET_ERROR]:", error);
        return ApiResponse.fatal("Internal Server Error");
    }
}