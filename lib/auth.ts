import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { signAccessToken, signRefreshToken } from "@/lib/tokens";
import { refreshAccessToken } from "@/lib/helper";
import { AuthService } from "@/services/auth.service";

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

                if (!user || !user.password) return null;

                if (!(await bcrypt.compare(credentials.password as string, user.password))) {
                    return null;
                }

                const accessToken = signAccessToken({ userId: user.id });
                const refreshToken = signRefreshToken({ userId: user.id });

                await db.user.update({
                    where: { id: user.id },
                    data: { refreshToken },
                });

                return {
                    id: user.id,
                    email: user.email,
                    name: user.fullName,
                    role: user.role,
                    status: user.status,
                    accessToken,
                    refreshToken,
                    accessTokenExpires: Date.now() + 15 * 60 * 1000,
                };
            },
        }),

        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "google") return true;

            try {
                const [existingUser, defaultPlan] = await Promise.all([
                    db.user.findUnique({
                        where: { email: user.email! },
                        select: { id: true, status: true, role: true },
                    }),
                    db.membershipPlan.findFirst({
                        where: { isDefault: true },
                        select: { id: true },
                    }),
                ]);

                if (!existingUser) {
                    if (!defaultPlan) {
                        console.error("[GOOGLE_SIGNIN] No default plan found");
                        return false; // block sign in — system misconfiguration
                    }

                    const refreshToken = signRefreshToken({ userId: user.email! });

                    const result = await db.$transaction(async (tx) => {
                        const newUser = await tx.user.create({
                            data: {
                                email: user.email!.toLowerCase(),
                                fullName: user.name ?? "Unnamed User",
                                password: null,
                                phoneNumber: "",
                                status: "ACTIVE",
                                role: "FREELANCER",
                                avatar: user.image,
                                refreshToken,
                            },
                        });

                        // ✅ Use newUser.id — not user.id which is the Google profile id
                        await AuthService.registerFreelancer(tx, newUser.id, defaultPlan.id);

                        return newUser;
                    });

                    // ✅ Now assign the real DB id so jwt() picks it up
                    user.id = result.id;

                } else {
                    const refreshToken = signRefreshToken({ userId: existingUser.id });

                    await db.user.update({
                        where: { id: existingUser.id },
                        data: { refreshToken },
                    });

                    // ✅ Assign real DB id
                    user.id = existingUser.id;
                }

                return true;

            } catch (error) {
                console.error("[GOOGLE_SIGNIN_FAILURE]:", error);
                return false; // return false, not throw — throwing causes redirect loop
            }
        },

        async jwt({ token, user, account, trigger }) {
            if (user) {
                if (account?.provider === "google") {
                    // user.id is now the correct DB id set in signIn() above
                    const dbUser = await db.user.findUnique({
                        where: { id: user.id },
                        select: { id: true, role: true, status: true, fullName: true, email: true },
                    });

                    if (dbUser) {
                        return {
                            ...token,
                            id: dbUser.id,
                            role: dbUser.role,
                            status: dbUser.status,
                            name: dbUser.fullName,
                            email: dbUser.email,
                            accessTokenExpires: Date.now() + 15 * 60 * 1000,
                        };
                    }

                    // dbUser not found — block session
                    return { ...token, error: "UserNotFound" };
                }

                // Credentials provider
                return { ...token, ...user };
            }

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

            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            return refreshAccessToken(token);
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.status = token.status as string;
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
        signIn: "/signin",
    },

    secret: process.env.NEXTAUTH_SECRET,
};