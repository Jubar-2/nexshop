import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ApiResponse } from "./lib/apiResponse";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Decrypt the JWT token directly from the cookie (Fast & Edge-compatible)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Define Protection Map (Easy to maintain)
  const protections = [
    { path: "/api/freelancer", role: "FREELANCER" },
    { path: "/api/admin", role: "ADMIN" },
  ];

  // Find if the current request path matches any protected route
  const activeRoute = protections.find(p => pathname.startsWith(p.path));
  const requestHeaders = new Headers(request.headers);

  if (activeRoute) {

    // Check if Session exists
    if (!token) {
      return ApiResponse.error("Session expired: Please log in again", 401);
    }

    // Check Role Authorization
    if (token.role !== activeRoute.role) {
      console.warn(`[SECURITY_WARN]: Unauthorized ${pathname} access by ${token.email}`);
      return ApiResponse.error(`Forbidden: ${activeRoute.role} access required`, 403);
    }

    // Check Account Integrity (Example: isBanned)
    if (token.isBanned) {
      return ApiResponse.error("Account suspended: Contact support", 403);
    }

    // Inject pre-verified data into headers
    requestHeaders.set('x-user-id', token.id as string);
    requestHeaders.set('x-user-role', token.role as string);
  }

  // Authorized: Continue to the API route
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

// MATCHERS: Tells Next.js exactly which routes trigger this middleware
export const config = {
  matcher: [
    "/api/freelancer/:path*",
    "/api/admin/:path*"
  ],
};