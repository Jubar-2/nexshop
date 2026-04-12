import * as z from "zod";

const jobsFiled = {
    jobTitle: z.string()
        .trim()
        .min(1, "Job title is required")
        .min(2, "Job title must be at least 2 characters")
        .max(100, "Job title cannot exceed 100 characters"),
    totalSlots: z
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
