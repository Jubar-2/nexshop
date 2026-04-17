import { JWT } from "next-auth/jwt";
import db from "./db";
import { signAccessToken } from "./tokens";

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

        return {
            ...token,
            accessToken: newAccessToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1000,
        };
    } catch (error: unknown) {
        console.log(error)
        return { ...token, error: "RefreshAccessTokenError" };
    }
}