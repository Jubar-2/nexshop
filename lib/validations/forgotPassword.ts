import z from "zod";

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
});

export type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;