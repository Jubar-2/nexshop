import { NextResponse } from "next/server";

export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// কুকি কনফিগারেশনের জন্য টাইপ ডিফাইন করে নেওয়া ভালো
interface CookieOptions {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
}

// NextResponse.json এর ২য় প্যারামিটারের টাইপ এক্সটেন্ড করা
interface ResponseOptions extends ResponseInit {
  cookie?: CookieOptions;
  clearCookie?: {
    name: string;
  }
}

export class ApiResponse {
  /**
   * Success Response (200, 201) with optional Cookie support
   */
  static success<T>(
    data: T,
    message: string = "Request successful",
    status: number = 200,
    options?: ResponseOptions // নতুন প্যারামিটার যোগ করা হলো
  ) {
    const response = NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status, ...options }
    );

    if (options?.cookie) {
      response.cookies.set({
        name: options.cookie.name,
        value: options.cookie.value,
        httpOnly: options.cookie.httpOnly ?? true,
        secure: options.cookie.secure ?? process.env.NODE_ENV === "production",
        sameSite: options.cookie.sameSite ?? "lax",
        path: options.cookie.path ?? "/",
        maxAge: options.cookie.maxAge,
      });
    }

    if (options?.clearCookie) {
      response.cookies.delete(options.clearCookie.name);
    }

    return response;
  }

  /**
   * Error Response (400, 401, 403, 404, 409)
   */
  static error(
    message: string = "An error occurred",
    status: number = 400,
    errors?: Record<string, string[]>
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      { status }
    );
  }

  /**
   * Server Error (500)
   */
  static fatal(message: string = "Internal Server Error") {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}