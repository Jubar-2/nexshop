import { JWT } from "next-auth/jwt";
import db from "./db";
import { signAccessToken, signRefreshToken } from "./tokens";
import { ApiResponse } from "./apiResponse";

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

