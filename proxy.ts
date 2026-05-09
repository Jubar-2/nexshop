import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isApiRoute = pathname.startsWith("/api");

    const protections = [
        { path: "/api/admin", role: "ADMIN" },
        { path: "/api/freelancer", role: "FREELANCER" },
        { path: "/dashboard", role: "FREELANCER" },
        { path: "/admin", role: "ADMIN" },
    ];

    const activeRoute = protections.find(p =>
        pathname.startsWith(p.path)
    );

    const requestHeaders = new Headers(request.headers);

    // 🔴 NOT AUTHENTICATED
    if (activeRoute && !token) {
        if (isApiRoute) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "Session expired"
                }),
                { status: 401 }
            );
        }

        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // 🔴 ROLE CHECK FAILED
    if (activeRoute && token?.role !== activeRoute.role) {

        if (isApiRoute) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "Forbidden"
                }),
                { status: 403 }
            );
        }

        // page redirect
        if (token?.role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }

        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // inject headers
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
    ],
};