import * as z from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const ProfileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),
    country: z.string("Country name is must be string"),
    division: z.string("Division name is must be string"),
    district: z.string("District name is must be string"),
    subDivision: z.string("Sub-division name is must be string"),
    postalCode: z.string("Postal code is must be string"),
    addressLine1: z.string("Address line 1 is must be string"),
});

// Type inference for TypeScript
export type ProfileSchemaInput = z.infer<typeof ProfileSchema>;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const AvatarSchema = z.object({
    avatar: z.any()
        .refine((file) => file instanceof File, "Please upload a screenshot of your work.")
        .refine((file) => file?.size <= MAX_FILE_SIZE, "Screenshot must be smaller than 5MB.")
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, and .png formats are accepted."
        ),
})

export type AvatarSchemaInput = z.infer<typeof AvatarSchema>;