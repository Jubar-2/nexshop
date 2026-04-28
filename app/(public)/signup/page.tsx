"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { AuthBranding } from '@/components/auth/auth-branding';
import { AuthHeader } from '@/components/auth/auth-header';
import { SocialAuth } from '@/components/auth/social-auth';
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { SignUpSchema } from "@/lib/validations/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import axios from "axios";

type SignUpFormValues = z.infer<typeof SignUpSchema>;

export default function SignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize Form
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            referCode: "",
        }
    });

    // Auto-fill referral code from URL
    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) setValue("referCode", ref);
    }, [searchParams, setValue]);

    // Submission Logic
    const onSubmit = async (data: SignUpFormValues) => {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/signup", data);

            const result = response.data();

            if (!result.data.ok) {
                // Handle 409 Conflict or 400 Bad Request
                throw new Error(result.data.message || "Signup failed");
            }

            // AUTO LOGIN
            const loginRes = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false, // important
            });

            if (loginRes?.error) {
                throw new Error(loginRes.error);
            }

            toast.success("Account Created!", {
                description: "Redirecting you to dashboard page...",
            });

            router.push("/dashboard");
        } catch (error: unknown) {
            toast.error("Registration Error", {
                description: (error as Error).message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center md:p-6 font-poppins">
            {/* Main Container: Increased desktop height slightly to fit more fields */}
            <div className="relative w-full h-screen md:h-235 md:max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row md:rounded-[40px] md:overflow-hidden">

                {/* --- BRANDING SECTION --- */}
                <AuthBranding
                    description="Create an account today and experience the best shopping journey with NexShop. Exclusive deals are waiting for you."
                    btnText="Learn More" />
                {/* --- FORM SECTION --- */}
                <div className="flex-1 bg-white p-8 md:p-16 md:pl-15 flex flex-col justify-center pt-16 md:pt-16">

                    <AuthHeader title="Create Account" subtitle="Register to get started" />
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4 max-w-md mx-auto w-full">
                        {/* Full Name Field */}
                        <div className="space-y-1">
                            <Input
                                {...register("fullName")}
                                type="text"
                                placeholder="Full Name"
                                className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                            />
                            {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.fullName.message}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="Email"
                                className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                            />
                            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.email.message}</p>}
                        </div>

                        {/* Mobile Number Field */}
                        <div className="space-y-1">
                            <Input
                                {...register("phoneNumber")}
                                type="tel"
                                placeholder="Mobile Number"
                                className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                            />
                            {errors.phoneNumber && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.phoneNumber.message}</p>}
                        </div>

                        {/* Refer Code Field */}
                        <div className="space-y-1">
                            <Input
                                {...register("referCode")}
                                type="text"
                                placeholder="Refer Code (optional)"
                                className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                            />
                            {errors.referCode && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.referCode.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <Input
                                {...register("password")}
                                type="password"
                                placeholder="Password"
                                className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                            />
                            {errors.password && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1">
                            <Input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder="Confirm Password"
                                className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                            />
                            {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Register Button */}
                        <Button
                            disabled={isLoading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold h-14 rounded-full text-lg md:text-xl shadow-lg transition-transform active:scale-95 mt-2">
                            {isLoading ? <Loader2 className="animate-spin" /> : "Sign Up"}

                        </Button>

                        {/* --- GOOGLE BUTTON --- */}
                        <SocialAuth text="Continue with Google" />
                    </form>

                    {/* Footer */}
                    <div className="mt-8 md:mt-10 pb-6 md:pb-0 text-center text-slate-500 font-medium text-sm md:text-base">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-accent-500 font-bold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}