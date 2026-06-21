import VerificationEmail from "@/components/EmailTemplate";
import { resend } from "../resend";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
) {
    try {

        const { data, error } = await resend.emails.send({
            from: "Nexshop <teams@nexshop.net>",
            to: [email],
            subject: 'Nexshop email verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        if (error) {
            throw new Error(error.message || "Something went wrong");
        }

        if (data) {
            return { success: true, message: "Verification email sent successfully." };
        }

    } catch (error: unknown) {
        console.error("Error sending verification email:", error);
        return { success: false, message: "Failed to send verification email." };
    }
}