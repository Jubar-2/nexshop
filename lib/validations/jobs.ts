import * as z from "zod";

const jobsFiled = {
    jobTitle: z.string()
        .trim()
        .min(1, "Job title is required")
        .min(2, "Job title must be at least 2 characters")
        .max(100, "Job title cannot exceed 100 characters"),
    workerRequired: z
        .number()
        .int("Slots must be a whole number")
        .min(1, "At least 1 slot is required"),
    reward: z.coerce
        .number()
        .min(0.01, "Reward must be at least 0.01"),

    description: z
        .string()
        .trim()
        .min(10, "Provide at least 10 characters of instruction")
        .max(1000, "Description cannot exceed 1000 characters"),
    category: z.string().min(1, "select at least one category").cuid("Invalid sub-category format"),
    subCategory: z.string()
        .cuid("Invalid sub-category format"),
    targetLink: z.string()
        .trim()
        .url("Please enter a valid URL (e.g., https://...)")
}

export const JobsInSchema = z.object({ ...jobsFiled });

// Type inference for TypeScript
export type JobsInput = z.infer<typeof JobsInSchema>;


export const JobsUpdateInSchema = z.object({
    ...jobsFiled,
    id: z.string("id must be a string").cuid("Invalid id format")
});

// Type inference for TypeScript
export type JobsUpdateInput = z.infer<typeof JobsUpdateInSchema>;

export const SubmitJobSchema = z.object({
    jobId: z
        .string("Job Id is must be string")
        .cuid("Job Id type is must be cuid"),
    submissionNotes: z.string("Submission Notes is must be string")
        .trim()
        .max(225, "Use maximum 225 letters")
})

export type SubmitJobInput = z.infer<typeof SubmitJobSchema>;


// Shared constants for NexShop standards
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

/**
 * SCHEMA: Job Submission (For Workers)
 * Used in Server Actions to validate form data before ImgBB upload.
 */
export const JobSubmissionSchema = z.object({
    jobId: z
        .string("Job reference is missing")
        .cuid("Invalid Job ID format"),

    submissionNotes: z
        .string()
        .trim()
        .min(10, "Please provide at least 10 characters describing your work.")
        .max(255, "Notes must be under 255 characters."),

    // Validate the File object before sending to ImgBB
    proofAttachment: z
        .any()
        .refine((file) => file instanceof File, "Please upload a screenshot of your work.")
        .refine((file) => file?.size <= MAX_FILE_SIZE, "Screenshot must be smaller than 5MB.")
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, and .png formats are accepted."
        ),

    // Profile link is optional but must be a valid URL if provided
    profileLink: z
        .string()
        .trim()
        .url("Please enter a valid social profile URL (e.g., https://facebook.com/...)")
        .optional()
        .or(z.literal("")), // Allows empty string to be valid
});


// TypeScript Types for safety across the app
export type JobSubmissionInput = z.infer<typeof JobSubmissionSchema>;
