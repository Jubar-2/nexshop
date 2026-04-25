import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { Pagination } from "@/lib/pagination";
import { Prisma } from "@prisma/client";

/**
 * Retrieves a paginated list of membership upgrade requests for administrative audit.
 *
 * This endpoint allows authorized administrators to review pending tier upgrades,
 * filter by processing status, and search for specific identities via TXID or 
 * user full name. It hydrates the response with nested user and plan details.
 *
 * @param {Request} request The incoming HTTP request.
 * @returns {Promise<Response>} Standardized API response containing request data and metadata.
 */
export async function GET(request: Request): Promise<Response> {
    try {
        // Authorization Guard
        // Identity and Role are injected by the proxy.ts middleware.
        const role = request.headers.get("x-user-role");
        if (role !== "ADMIN") {
            return ApiResponse.error("Forbidden: Administrative privileges required", 403);
        }

        // Initialize Pagination and Extract Search Filters
        const { searchParams } = new URL(request.url);
        const pagination = new Pagination(searchParams, 15); // Default to 15 records per page

        const status = searchParams.get("status");
        const search = searchParams.get("search");

        // Build Strongly Typed Filter Clause
        // We search TXID directly and FullName through the Freelancer -> User relation.
        const whereClause: Prisma.MembershipUpgradeRequestWhereInput = {
            ...(status && { status: status as Prisma.EnumPaymentRequestStatusFilter<"MembershipUpgradeRequest"> }),
            ...(search && {
                OR: [
                    {
                        id: {
                            contains: search,
                            mode: 'insensitive' as Prisma.QueryMode
                        }
                    },
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

        // Execute Parallel Queries for Performance
        // count() and findMany() run simultaneously to reduce database wait time.
        const [total, requests] = await Promise.all([
            db.membershipUpgradeRequest.count({ where: whereClause }),
            db.membershipUpgradeRequest.findMany({
                where: whereClause,
                orderBy: {
                    createdAt: "desc", // Latest requests appear at the top
                },
                ...pagination.prismaOptions,
                select: {
                    id: true,
                    amount: true,
                    method: true,
                    txid: true,
                    status: true,
                    createdAt: true,
                    // Hydrate specific fields for UI display
                    freelancer: {
                        select: {
                            user: {
                                select: {
                                    fullName: true,
                                    image: true
                                }
                            }
                        }
                    },
                    plan: {
                        select: {
                            membershipName: true,
                            planOrder: true
                        }
                    }
                }
            }),
        ]);

        // Successful Response
        return ApiResponse.success({
            data: requests,
            meta: pagination.getMetadata(total, requests.length),
        }, "Membership upgrade audit records retrieved");

    } catch (error: unknown) {
        // Standardize error logging for production monitoring
        const errorMessage = error instanceof Error ? error.message : "Internal system failure";
        console.error("[ADMIN_UPGRADE_AUDIT_GET_ERROR]:", errorMessage);

        return ApiResponse.fatal("An internal error occurred while processing the audit list");
    }
}