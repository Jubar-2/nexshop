import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { SubmitJobSchema } from "@/lib/validations/jobs";

export async function POST(request: Request) {
    try {
        // Safe JSON parsing with error handling
        const body = await request.json().catch(() => null);
        if (!body) {
            return ApiResponse.error("Invalid JSON payload", 400);
        }

        // Validate input using Zod schema
        const validation = SubmitJobSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const { jobId,submissionNotes } = validation.data;

        const submittedJob = await db.submittedJob.create({
            data: {
                jobId,
                freelancerId: "string cuid",
                submissionNotes,
                proofAttachment: ""
            }
        });

        ApiResponse.success(submittedJob, "succfully submit job");

    } catch (error: unknown) {
        console.log(error)
        ApiResponse.fatal("server error")
    }
}