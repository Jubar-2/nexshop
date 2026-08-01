import * as z from "zod";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

export const SignUpSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    referCode: z.string().optional(),
    // phoneNumber: z.string().refine((val) => isValidPhoneNumber(val), {
    //     message: "Invalid phone number",
    // }),
    phoneNumber: z.string()
        .min(1, "Phone number is required")
        .refine(val => {
            // Reject if starts with a single digit without 0 or + prefix
            // 1703165333 → invalid (missing leading 0 or +880)
            if (/^[1-9]\d{9}$/.test(val.trim())) return false;

            const normalized = /^01[3-9]\d{8}$/.test(val.trim())
                ? `+880${val.trim()}`
                : val.trim();

            return isValidPhoneNumber(normalized, "BD");
        }, {
            message: "Enter a valid phone number (e.g. 01703165330 or +8801703165330)",
        })
        .transform(val => {
            const normalized = /^01[3-9]\d{8}$/.test(val.trim())
                ? `+880${val.trim()}`
                : val.trim();
            return parsePhoneNumber(normalized, "BD").format("E.164");
        }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

// Type inference for TypeScript
export type SignUpInput = z.infer<typeof SignUpSchema>;