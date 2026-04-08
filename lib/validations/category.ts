import * as z from "zod";

export const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters"),
});

// Type inference for TypeScript
export type categoryInput = z.infer<typeof categorySchema>;