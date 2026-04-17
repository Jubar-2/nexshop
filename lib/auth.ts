import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { signAccessToken, signRefreshToken } from "@/lib/tokens";
import { refreshAccessToken } from "@/lib/helper";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            // You MUST define the credentials object
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await db.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !(await bcrypt.compare(credentials.password as string, user.password))) {
                    return null;
                }

                // Generate our custom tokens
                const accessToken = signAccessToken({ userId: user.id });
                const refreshToken = signRefreshToken({ userId: user.id });

                // Professional Step: Save Refresh Token to DB
                await db.user.update({
                    where: { id: user.id },
                    data: { refreshToken },
                });

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.fullName,
                    role: user.role,
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
            // Pass data from JWT to the client-side session
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.accessToken = token.accessToken as string;
                session.error = token.error as string;
            }
            return session;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 Days
    },
    pages: {
        signIn: "/login", // Redirect to your custom login page
    },
    secret: process.env.NEXTAUTH_SECRET,

};