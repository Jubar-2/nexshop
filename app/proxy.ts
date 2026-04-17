import { ApiResponse } from '@/lib/apiResponse';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function proxy() {
    console.log("this proxy is it")
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "FREELANCER") {
        return ApiResponse.error("Unauthorized: Freelancer session required", 401);
    }

    return NextResponse.next();
}

export const config = {
    matcher: 'api/admin/:path*',
}