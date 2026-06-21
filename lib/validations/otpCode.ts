import z from "zod";

export const otpSchema = z.object({
    otp: z.string().length(6, "Please enter all 6 digits of the code."),
});

export type OTPValues = z.infer<typeof otpSchema>;