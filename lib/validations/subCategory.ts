import * as z from "zod";

export const subCategorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters"),
    categoryId: z.number("Invalid category ID")
});

// Type inference for TypeScript
export type subCategoryInput = z.infer<typeof subCategorySchema>;