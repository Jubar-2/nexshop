"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from 'next/link';

// UI Components
import { AuthBranding } from "@/components/auth/auth-branding";
import { AuthHeader } from "@/components/auth/auth-header";
import { SocialAuth } from "@/components/auth/social-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { SignInSchema } from "@/lib/validations/signIn";

type LoginFormValues = z.infer<typeof SignInSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // 2. Initialize the Form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    // 3. The Login Submission Logic
    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);

        try {
            const callback = await signIn("credentials", {
                ...data,
                redirect: false, // We handle redirection manually for a better UX
            });

            if (callback?.error) {
                toast.error("Invalid Credentials", {
                    description: "The email or password you entered is incorrect."
                });
            }

            if (callback?.ok && !callback?.error) {
                toast.success("Welcome Back!", {
                    description: "Login successful. Redirecting to your dashboard..."
                });
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            toast.error("An error occurred", {
                description: "Something went wrong. Please try again later."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center md:p-6 font-poppins">
            <div className="relative w-full h-screen md:h-162.5 md:max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row md:rounded-[40px] md:overflow-hidden">

                <AuthBranding
                    description="Sign in to your account and explore the best royal shopping experience."
                    btnText="Learn More"
                />

                <div className="flex-1 bg-white p-8 md:p-16 md:pl-15 flex flex-col justify-center pt-16 md:pt-16">
                    <AuthHeader title="Welcome Back!" subtitle="Sign in to continue" />

                    {/* 4. Connect form to the handleSubmit hook */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 max-w-md mx-auto w-full">
                        <div className="space-y-1">
                            <Input
                                {...register("email")} // Register field
                                type="email"
                                placeholder="Email"
                                disabled={isLoading}
                                className={`h-14 rounded-full border-2 px-8 font-semibold focus-visible:ring-accent-500 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                            />
                            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <Input
                                {...register("password")} // Register field
                                type="password"
                                placeholder="Password"
                                disabled={isLoading}
                                className={`h-14 rounded-full border-2 px-8 font-semibold focus-visible:ring-accent-500 ${errors.password ? 'border-red-500' : 'border-slate-200'}`}
                            />
                            {errors.password && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.password.message}</p>}
                        </div>

                        <div className="flex justify-end px-2">
                            <Button variant="link" type="button" className="text-slate-400 font-semibold p-0 h-auto">
                                Forgot Password?
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold h-14 rounded-full text-lg md:text-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
                        </Button>

                        <SocialAuth text="Continue with Google" />
                    </form>

                    <div className="mt-8 md:mt-10 pb-6 md:pb-0 text-center text-slate-500 font-medium text-sm md:text-base">
                        {"Don't have an account? '"}
                        <Link href="/signup" className="text-accent-500 font-bold hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}