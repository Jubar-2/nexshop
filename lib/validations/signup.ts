import * as z from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const SignUpSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    phoneNumber: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

// Type inference for TypeScript
export type SignUpInput = z.infer<typeof SignUpSchema>;