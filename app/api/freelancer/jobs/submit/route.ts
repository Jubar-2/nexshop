import { ApiResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { imageUploader } from "@/lib/services/image-upload";
import { JobSubmissionSchema } from "@/lib/validations/jobs";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
    try {
        // IDENTITY & AUTHORIZATION
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "FREELANCER") {
            return ApiResponse.error("Unauthorized: Freelancer session required", 401);
        }

        // DATA EXTRACTION
        const formData = await request.formData();
        const rawData = {
            jobId: formData.get("jobId"),
            submissionNotes: formData.get("submissionNotes"),
            proofAttachment: formData.get("proofAttachment"),
            profileLink: formData.get("profileLink"),
        };

        // SCHEMA VALIDATION
        const validation = JobSubmissionSchema.safeParse(rawData);
        if (!validation.success) {
            return ApiResponse.error("Input validation failed", 400, validation.error.flatten().fieldErrors);
        }

        const { jobId, submissionNotes, proofAttachment, profileLink } = validation.data;

        // BUSINESS LOGIC GUARDS (THE "PRO" STEP)
        // Fetch User and Job simultaneously to save time (Optimization)
        const [freelancer, job] = await Promise.all([
            db.freelancer.findUnique({ where: { userId: session.user.id } }),
            db.jobs.findUnique({ where: { id: jobId } })
        ]);

        if (!freelancer) return ApiResponse.error("Freelancer profile not found", 404);
        if (!job) return ApiResponse.error("Target job does not exist", 404);
        if (job.status !== "ACTIVE") return ApiResponse.error("This job is no longer active", 400);

        // Prevent Double Submission (Spam Control)
        const alreadySubmitted = await db.submittedJob.findFirst({
            where: { jobId, freelancerId: freelancer.id }
        });
        if (alreadySubmitted) {
            return ApiResponse.error("You have already submitted proof for this job", 409);
        }

        // Check if Job is Full
        if (job.submissionCount >= job.workerRequired) {
            return ApiResponse.error("Job limit reached: No more submissions allowed", 400);
        }

        // EXTERNAL SERVICE (IMAGE UPLOAD)
        // Only upload AFTER all logic guards pass to save your ImgBB quota/bandwidth
        const imageLink = await imageUploader.upload(proofAttachment);

        // ATOMIC TRANSACTION (CRITICAL)
        // We create the submission AND increment counts in one single database trip
        const submittedJob = await db.$transaction(async (tx) => {
            const record = await tx.submittedJob.create({
                data: {
                    jobId,
                    freelancerId: freelancer.id,
                    submissionNotes,
                    proofAttachment: imageLink,
                    profileLink,
                }
            });

            // Increment counters on both the Job and the Freelancer profile
            await tx.jobs.update({
                where: { id: jobId },
                data: { submissionCount: { increment: 1 } }
            });

            await tx.freelancer.update({
                where: { id: freelancer.id },
                data: { totalSubmitted: { increment: 1 } }
            });

            return record;
        });

        return ApiResponse.success(submittedJob, "Work proof submitted successfully", 201);

    } catch (error: unknown) {
        console.error(`[SUBMISSION_POST_FAILURE]:`, error);

        // Handle specific service errors (e.g. ImgBB down)
        // if (error.message.includes("ImgBB")) {
        //     return ApiResponse.error("Storage service error. Please try again.", 503);
        // }

        return ApiResponse.fatal("An unexpected error occurred during submission.");
    }
}