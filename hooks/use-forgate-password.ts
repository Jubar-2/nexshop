import { useMutation, useQuery } from "@tanstack/react-query";
import { ResetPasswordValues } from "@/lib/validations/resetPassword";
import axios from "axios";
import { OTPValues } from "@/lib/validations/otpCode";

interface verificationCode {
    verificationCode: {
        id: string;
        email: string;
        code: string;
        limit: number;
        expired: Date;
        used: boolean;
        block: boolean;
        unlockDate: Date | null;
    }
}

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            console.log(email)
            const { data } = await axios.post("/api/auth/forgot-password", { email }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return data.data;
        }
    });
}

export const useGetEmailData = () => {
    return useQuery({
        queryKey: ["forgot-password-email"],
        queryFn: async (): Promise<verificationCode> => {
            const { data } = await axios.get("/api/auth/forgot-password/email");
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useResendEmail = () => {
    return useMutation({
        mutationFn: async (_: string) => {
            const { data } = await axios.patch("/api/auth/forgot-password/verify/resend", {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return data.data;
        }
    });
}


export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: async (OTP: OTPValues) => {
            const { data } = await axios.patch("/api/auth/forgot-password/verify", OTP, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return data.data;
        }
    });
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (resetPassword: ResetPasswordValues) => {
            const { data } = await axios.patch("/api/auth/forgot-password/reset-password", resetPassword, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return data.data;
        }
    });
}