import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isApiRoute = pathname.startsWith("/api");

    // -----------------------------
    // PUBLIC ROUTES
    // -----------------------------
    const publicRoutes = [
        "/signin",
        "/signup",
        "/admin/login",
    ];

    const isPublicRoute = publicRoutes.includes(pathname);

    // -----------------------------
    // ROLE PROTECTION
    // -----------------------------
    const protections = [
        { path: "/api/admin", role: "ADMIN" },
        { path: "/api/freelancer", role: "FREELANCER" },

        { path: "/dashboard", role: "FREELANCER" },
        { path: "/admin", role: "ADMIN" },
    ];

    const activeRoute = protections.find((p) =>
        pathname.startsWith(p.path)
    );

    const requestHeaders = new Headers(request.headers);

    // =====================================================
    // PUBLIC PAGE HANDLING
    // =====================================================
    if (isPublicRoute && token) {

        // already logged in
        if (token.role === "ADMIN") {
            return NextResponse.redirect(
                new URL("/admin", request.url)
            );
        }

        return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
    }

    // =====================================================
    // PROTECTED ROUTE WITHOUT LOGIN
    // =====================================================
    if (activeRoute && !token) {

        // API response
        if (isApiRoute) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Session expired",
                },
                { status: 401 }
            );
        }

        // Page redirect
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(
                new URL("/admin/login", request.url)
            );
        }

        return NextResponse.redirect(
            new URL("/signin", request.url)
        );
    }

    // =====================================================
    // ROLE AUTHORIZATION
    // =====================================================
    if (activeRoute && token?.role !== activeRoute.role) {

        if (isApiRoute) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden",
                },
                { status: 403 }
            );
        }

        // redirect based on role
        if (token?.role === "ADMIN") {
            return NextResponse.redirect(
                new URL("/admin", request.url)
            );
        }

        return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
    }

    // =====================================================
    // INJECT USER HEADERS
    // =====================================================
    if (token) {
        requestHeaders.set("x-user-id", token.id as string);
        requestHeaders.set("x-user-role", token.role as string);
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        "/api/:path*",
        "/dashboard/:path*",
        "/admin/:path*",
        "/signin",
        "/signup",
        "/admin/login",
    ],
};