import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { checkUserId } from "@/lib/helper";

/**
 * Retrieves the list of available membership tiers for freelancers.
 *
 * This endpoint provides the configuration for the membership tiers, 
 * including submission limits and associated features (offers). 
 * It is ordered by 'planOrder' to ensure tiers appear in the correct 
 * sequence (e.g., Basic -> Pro -> VIP).
 *
 * @param {Request} request The incoming HTTP request.
 * @returns {Promise<Response>} Standardized API response with plan data.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    // Identity Guard: Ensure user is logged in to view pricing
    const userId = checkUserId(request);
    if (!userId) {
      return ApiResponse.error("Authentication required", 401);
    }

    // Fetch Membership Plans
    // Pagination is usually not needed for plans (as there are only a few),
    // but we use strict ordering for the UI.
    const plans = await db.membershipPlan.findMany({
      orderBy: {
        planOrder: "asc",
      },
      select: {
        id: true,
        membershipName: true,
        jobsSubmitLimit: true,
        description: true,
        planOrder: true,
        isDefault: true,
        freelancers: {
          where: {
            userId: userId as string
          },
          select: {
            id: true
          }
        },
        // Include the features/offers for each plan
        offers: {
          select: {
            id: true,
            title: true,
            description: true,
          }
        },
        // Meta-data optimization: count how many users are in this plan
        _count: {
          select: { freelancers: true }
        }
      }
    });

    // Return the plans
    return ApiResponse.success(plans, "Membership plans retrieved successfully");

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Plan fetch failure";
    console.error("[MEMBERSHIP_PLANS_GET_ERROR]:", errorMessage);

    return ApiResponse.fatal("An internal error occurred while loading membership options");
  }
}