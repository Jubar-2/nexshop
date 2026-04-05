import { NextResponse } from "next/server";

/**
 * Standard API Response Structure
 * T is a Generic that represents the type of data being returned
 */
export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>; // For Zod/Validation errors
}

export class ApiResponse {
  /**
   * Success Response (200, 201)
   */
  static success<T>(
    data: T, 
    message: string = "Request successful", 
    status: number = 200
  ) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
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
        errors, // Structured field errors
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