import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import db from "@/lib/db";
import { ApiResponse } from "@/lib/apiResponse";

async function handler(request: Request) {
    try {
        const body = await request.json();
        const { freelancerId } = body;

        if (!freelancerId) {
            return ApiResponse.error("freelancerId missing", 400);
        }

        const [freelancer, defaultPlan] = await Promise.all([
            db.freelancer.findUnique({
                where: { id: freelancerId },
                select: {
                    id: true,
                    expireAt: true,
                    memberPlanId: true,
                }
            }),
            db.membershipPlan.findFirst({
                where: { isDefault: true },
                select: { id: true }
            }),
        ]);

        if (!freelancer) {
            // Freelancer deleted after job was scheduled — not an error
            return ApiResponse.success({}, "Freelancer not found, skipping");
        }

        if (!defaultPlan) {
            // Can't downgrade without a default plan — but don't retry forever
            console.error("[EXPIRE_WEBHOOK] No default plan found — system misconfiguration");
            return ApiResponse.success({}, "Default plan not found, skipping");
        }

        // Already on default plan or expiry was renewed after this job was scheduled
        if (freelancer.memberPlanId === defaultPlan.id) {
            return ApiResponse.success({}, "Already on default plan, skipping");
        }

        // Guard: only downgrade if expireAt is actually in the past
        // Protects against the case where the admin approved a renewal
        // between when this job was scheduled and when it fired
        if (!freelancer.expireAt || freelancer.expireAt > new Date()) {
            return ApiResponse.success({}, "Subscription still active, skipping");
        }

        await db.freelancer.update({
            where: { id: freelancerId },
            data: {
                memberPlanId: defaultPlan.id,
                startAt: null,
                expireAt: null,
            }
        });

        return ApiResponse.success({}, "Subscription expiry processed");

    } catch (error: unknown) {
        console.error("[SUBSCRIPTION_EXPIRE_WEBHOOK_FAILURE]:", (error as Error).message);
        // 500 tells QStash to retry automatically
        return ApiResponse.fatal("Failed to process expiry.");
    }
}

// QStash signature verification wrapper — ensures only QStash can call this
export const POST = verifySignatureAppRouter(handler);