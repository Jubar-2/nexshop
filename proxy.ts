import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

interface VerifyTokenPayload extends JwtPayload {
    email: string;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isApiRoute = pathname.startsWith("/api");

    const requestHeaders = new Headers(request.headers);
    // =====================================================
    // PUBLIC ROUTES
    // =====================================================
    const publicRoutes = ["/signin", "/signup", "/admin/auth"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // =====================================================
    // FORGOT-PASSWORD FLOW GUARDS
    // =====================================================
    const isVerifyOtpPage = pathname === "/forgot-password/verify";
    const isResetPasswordPage = pathname === "/forgot-password/reset-password";
    const isResetPasswordEmailPage = pathname === "/api/auth/forgot-password/email";
    const isVerifyOtpApi = pathname === "/api/auth/forgot-password/verify";
    const isResendOtpApi = pathname === "/api/auth/forgot-password/verify/resend";
    const isResetPasswordApi = pathname === "/api/auth/forgot-password/reset-password";

    if (isVerifyOtpPage || isResetPasswordEmailPage || isVerifyOtpApi || isResendOtpApi || isResetPasswordPage || isResetPasswordApi) {
        const cookieStore = await cookies();
        const requiredCookieName = isVerifyOtpPage ||
            isResetPasswordEmailPage ||
            isVerifyOtpApi ||
            isResendOtpApi ? "verify_token" : "reset_token";

        const cookieValue = cookieStore.get(requiredCookieName)?.value;

        if (!cookieValue) {
            return NextResponse.redirect(new URL("/forgot-password", request.url));
        }

        try {
            const tokenData = jwt.verify(cookieValue, process.env.JWT_SECRET!) as VerifyTokenPayload;

            if (!tokenData.exp || tokenData.exp * 1000 < Date.now()) {

                if (isApiRoute) {
                    return NextResponse.json(
                        { success: false, message: "Session expired" },
                        { status: 401 }
                    );
                }

                return NextResponse.redirect(new URL("/forgot-password", request.url));
            }

            requestHeaders.set("x-user-email", tokenData?.email as string);

        } catch {
            // Covers both invalid signature AND expired token —
            // jwt.verify throws TokenExpiredError automatically, no need
            // to manually check payload.exp
            if (isApiRoute) {
                return NextResponse.json(
                    { success: false, message: "Session expired" },
                    { status: 401 }
                );
            }

            return NextResponse.redirect(new URL("/forgot-password", request.url));
        }

        // Valid token for this step — let it through.
        // Skip the rest of the auth/role logic below since these
        // pages don't use the NextAuth session token at all.
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // =====================================================
    // ROLE PROTECTION
    // =====================================================
    const protections = [
        { path: "/api/admin", role: "ADMIN" },
        { path: "/api/freelancer", role: "FREELANCER" },
        { path: "/api/resend", role: "FREELANCER" },
        { path: "/api/verify", role: "FREELANCER" },
        { path: "/dashboard", role: "FREELANCER" },
        { path: "/verify", role: "FREELANCER" },
        { path: "/admin", role: "ADMIN" },
    ];

    // Routes only UNVERIFIED users should access
    // ACTIVE users should be redirected away from these
    const unverifiedOnlyPaths = ["/api/resend", "/api/verify", "/verify"];

    const activeRoute = protections.find(
        (p) => pathname !== "/admin/auth" && pathname.startsWith(p.path)
    );

    const isUnverifiedOnlyPath = unverifiedOnlyPaths.some((p) =>
        pathname.startsWith(p)
    );


    // =====================================================
    // PUBLIC PAGE HANDLING — already logged in
    // =====================================================
    if (isPublicRoute && token) {
        if (token.role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // =====================================================
    // PROTECTED ROUTE WITHOUT LOGIN
    // =====================================================
    if (activeRoute && !token) {
        if (isApiRoute) {
            return NextResponse.json(
                { success: false, message: "Session expired" },
                { status: 401 }
            );
        }

        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/admin/auth", request.url));
        }

        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // =====================================================
    // ROLE AUTHORIZATION
    // =====================================================
    if (activeRoute && token?.role !== activeRoute.role) {
        if (isApiRoute) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        if (token?.role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }

        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // =====================================================
    // UNVERIFIED USER — block access to protected routes
    // =====================================================
    if (
        activeRoute &&
        token?.status === "UNVERIFIED" &&
        !isUnverifiedOnlyPath
    ) {
        if (isApiRoute) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        return NextResponse.redirect(new URL("/verify", request.url));
    }

    // =====================================================
    // ACTIVE USER — block access to verify/resend routes
    // =====================================================
    if (isUnverifiedOnlyPath && token?.status === "ACTIVE") {
        if (isApiRoute) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // =====================================================
    // INJECT USER HEADERS
    // =====================================================
    if (token) {
        requestHeaders.set("x-user-id", token.id as string);
        requestHeaders.set("x-user-role", token.role as string);
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: [
        "/api/:path*",
        "/dashboard/:path*",
        "/admin/:path*",
        "/signin",
        "/signup",
        "/verify",
        "/forgot-password/verify/:path*",
        "/forgot-password/reset-password",
        "/api/auth/forgot-password/email",
        "/api/auth/forgot-password/reset-password",
        "/admin/auth",
    ],
};