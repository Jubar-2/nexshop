import { AccountType, PaymentMethod } from "@prisma/client";
import { isValidPhoneNumber } from "libphonenumber-js";
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


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const MemberShipUpgradeInSchema = z.object({
    planId: z.string("Plan id is required").cuid("Invalid plan id format"),
    freelancerId: z.string("Freelancer id is required").cuid("Invalid plan id format"),
    phoneNumber: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),

    accountType: z.nativeEnum(AccountType)
        .superRefine((val, ctx) => {
            if (!Object.values(AccountType).includes(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Your custom error message here",
                });
            }
        }),

    paymentMethod: z.nativeEnum(PaymentMethod)
        .superRefine((val, ctx) => {
            if (!Object.values(PaymentMethod).includes(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid payment method",
                });
            }
        }),

    paymentProof: z.any()
        .refine((file) => file instanceof File, "Please upload a screenshot of your work.")
        .refine((file) => file?.size <= MAX_FILE_SIZE, "Screenshot must be smaller than 5MB.")
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, and .png formats are accepted."
        ),

    amount: z.number("Amount is required")
});

export type MemberShipUpgradeInput = z.infer<typeof MemberShipUpgradeInSchema>;

export const MemberShipUpgradeStatusChangeInSchema = z.object({
    id: z.string("Request id is required").cuid("Invalid request id format"),
    status: z.enum(["APPROVED", "REJECTED"], "Status must be either APPROVED or REJECTED")
});

export type MemberShipUpgradeStatusChangeInput = z.infer<typeof MemberShipUpgradeStatusChangeInSchema>;