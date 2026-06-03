import { JWT } from "next-auth/jwt";
import db from "./db";
import { signAccessToken, signRefreshToken } from "./tokens";
import { ApiResponse } from "./apiResponse";
import { Prisma } from "@prisma/client";


/**
 * Helper to refresh the access token automatically
 */
export async function refreshAccessToken(token: JWT) {
    try {
        const user = await db.user.findUnique({
            where: { id: (token as { id: string }).id },
        });

        // Verify if the refresh token in the JWT matches the one in DB
        if (!user || user.refreshToken !== (token as { refreshToken: string }).refreshToken) {
            throw new Error("Refresh token invalid");
        }

        // Sign new access token
        const newAccessToken = signAccessToken({ userId: user.id });
        const newRefreshToken = signRefreshToken({ userId: user.id });

        // UPDATE DB: Overwrite old refresh token with the new one
        await db.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        });

        return {
            ...token,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1000,
        };
    } catch (error: unknown) {
        console.log(error)
        return { ...token, error: "RefreshAccessTokenError" };
    }
}

export function checkUserId(request: Request) {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
        return ApiResponse.error("User Id is missing", 409);
    }

    return userId;
}

// get Settings 
// const settingsData = new Settings();

// const [getOne, getTwo, getThree] = await Promise.all([
//     settingsData.genOneAmount(),
//     settingsData.genTwoAmount(),
//     settingsData.genThreeAmount()
// ])

/**
 * Distributes referral rewards recursively up to a specified generation.
 *
 * @param {Prisma.TransactionClient} tx The active database transaction.
 * @param {string} referralId The ID of the root referral event.
 * @param {string} referrerId The ID of the freelancer receiving the reward.
 * @param {number} gen The current generation depth (starts at 1).
 * @param {number} maxGen The maximum depth for rewards (usually 3).
 */
export async function giveReferralReward(
    tx: Prisma.TransactionClient,
    referralId: string,
    referrerId: string,
    gen: number,
    maxGen: number = 3,
    settings: { getOne: { value: number; switch: boolean }, getTwo: { value: number; switch: boolean }, getThree: { value: number; switch: boolean } }  
): Promise<void> {
    // Base case: Stop if we exceed the maximum allowed generation.
    const switches: Record<number, boolean> = { 1: settings.getOne.switch, 2: settings.getTwo.switch, 3: settings.getThree.switch };
    if (gen > maxGen && switches[gen]) return;

    // Define tiered rewards (e.g., Gen 1 gets 10, Gen 2 gets 5, Gen 3 gets 2)
    const rewards: Record<number, number> = { 1: settings.getOne.value, 2: settings.getTwo.value, 3: settings.getThree.value };
    const currentReward = rewards[gen] || 1.0;

    // Atomically increment the referrer's balance.
    await tx.freelancer.update({
        where: { id: referrerId },
        data: {
            currentBalance: { increment: currentReward },
            // totalEarned: { increment: currentReward }
        },
    });

    // Create an audit log for this specific income generation.
    await tx.referralIncome.create({
        data: {
            freelancerId: referrerId,
            ReferralId: referralId,
            reward: currentReward,
            gen: gen,
        },
    });

    // Recursive Step: Find if the current referrer was also referred by someone else.
    const parent = await tx.referral.findUnique({
        where: { receiverId: referrerId },
        select: { senderId: true }
    });

    // If a parent exists, move up to the next generation.
    if (parent?.senderId) {
        await giveReferralReward(tx, referralId, parent.senderId, gen + 1, maxGen, settings);
    }
}