import * as z from "zod";

const jobsFiled = {
    jobTitle: z.string()
        .min(2, "Job title must be at least 2 characters")
        .max(100, "Job title must be at most 100 characters"),
    totalSlots: z
        .number("Total slots must be a number")
        .min(1, "Total slots must be at least 1"),
    reward: z.number("Reward must be a number")
        .min(0, "Reward must be a positive number"),

    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be at most 500 characters"),
    category: z.number().min(1, "select at least one category"),
    subCategory: z.number().min(1, "select a sub-category"),
    targetLink: z.string().url("Target link must be a valid URL"),
}

export const JobsInSchema = z.object({...jobsFiled});

// Type inference for TypeScript
export type JobsInput = z.infer<typeof JobsInSchema>;


export const JobsUpdateInSchema = z.object({
    ...jobsFiled,
    id: z.number("id must be a number")
});

// Type inference for TypeScript
export type JobsUpdateInput = z.infer<typeof JobsUpdateInSchema>;
