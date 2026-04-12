import * as z from "zod";

const membershipFiled = {
    membershipName: z
        .string("Membership name is required")
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters"),

    jobsSubmitLimit: z
        .number("Submit limit is required")
        .int()
        .nonnegative("Limit cannot be negative"),

    description: z
        .string()
        .max(100, "Description cannot exceed 100 characters")
        .trim()
        .optional()
        .nullable(),

    planOrder: z
        .number("Plan order is required")
        .int()
        .positive("Order must be a positive integer"),

    offers: z.array(z.string("Ids are must be string")).optional()
}

export const MemberShipInSchema = z.object({ ...membershipFiled });

// Type inference for TypeScript
export type MemberShipInput = z.infer<typeof MemberShipInSchema>;


export const MemberShipUpdateInSchema = z.object({
    ...membershipFiled,
    id: z.string("Offer id must be need"),
});

// Type inference for TypeScript
export type MemberShipUpdateInput = z.infer<typeof MemberShipUpdateInSchema>;
