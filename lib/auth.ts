import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { signAccessToken, signRefreshToken } from "@/lib/tokens";
import { refreshAccessToken } from "@/lib/helper";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
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

                const accessToken = signAccessToken({ userId: user.id });
                const refreshToken = signRefreshToken({ userId: user.id });

                await db.user.update({
                    where: { id: user.id },
                    data: { refreshToken },
                });

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.fullName,
                    role: user.role,
                    status: user.status,   // ✅ included
                    accessToken,
                    refreshToken,
                    accessTokenExpires: Date.now() + 15 * 60 * 1000,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger }) {
            // Initial sign in — populate token from user object
            if (user) {
                return { ...token, ...user };
            }
           
            // Client called update() — re-fetch fresh data from DB
            if (trigger === "update") {
                const freshUser = await db.user.findUnique({
                    where: { id: token.id as string },
                    select: { status: true, role: true }
                });

                if (freshUser) {
                    token.status = freshUser.status;
                    token.role = freshUser.role;
                }

                return token;
            }

            // Token still valid
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // Token expired — refresh it
            return refreshAccessToken(token);
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.status = token.status as string;  // ✅ was missing
                session.accessToken = token.accessToken as string;
                session.error = token.error as string;
            }
            return session;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
    },

    pages: {
        signIn: "/signin",  // ✅ was "/login" — match your actual route
    },

    secret: process.env.NEXTAUTH_SECRET,
};