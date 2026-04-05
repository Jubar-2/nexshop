import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/tokens";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            // ✅ 1. You MUST define the credentials object
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !(await bcrypt.compare(credentials.password as string, user.password))) {
                    return null;
                }

                // Generate our custom tokens
                const accessToken = signAccessToken({ userId: user.id });
                const refreshToken = signRefreshToken({ userId: user.id });

                // Professional Step: Save Refresh Token to DB
                await prisma.user.update({
                    where: { id: user.id },
                    data: { refreshToken },
                });

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.fullName,
                    accessToken,
                    refreshToken,
                    accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 mins from now
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                return { ...token, ...user };
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.accessToken = token.accessToken as string;
            session.error = token.error as string;
            return session;
        },
    },
    session: { strategy: "jwt" },
};

/**
 * Helper to refresh the access token automatically
 */
async function refreshAccessToken(token: any) {
    try {
        const user = await prisma.user.findUnique({
            where: { customerId: parseInt(token.id) },
        });

        // Verify if the refresh token in the JWT matches the one in DB
        if (!user || user.refreshToken !== token.refreshToken) {
            throw new Error("Refresh token invalid");
        }

        // Sign new access token
        const newAccessToken = signAccessToken({ id: user.customerId });

        return {
            ...token,
            accessToken: newAccessToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1000,
        };
    } catch (error) {
        return { ...token, error: "RefreshAccessTokenError" };
    }
}