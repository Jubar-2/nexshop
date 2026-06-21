"use client";

import React, { useState } from "react";
import {
    KeyRound,
    ArrowRight,
    ArrowLeft,
    Mail,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- VALIDATION ---
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ForgotPasswordSchema, ForgotPasswordValues } from "@/lib/validations/forgotPassword";
import { useForgotPassword } from "@/hooks/use-forgate-password";
import axios from "axios";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isSent, setIsSent] = useState(false);
    const { mutate, isPending } = useForgotPassword();
    const [message, setMessage] = useState("");

    // Initialize Form
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: { email: "" },
    });

    // Handle Submit
    const onSubmit = async (data: ForgotPasswordValues) => {

        mutate(data.email, {
            onSuccess: () => {
                toast.success("Reset code sent!", {
                    description: `Check your inbox at ${data.email}`,
                });

                router.push("/forgot-password/verify");
            },
            onError: (error) => {
                setIsSent(true);

                let message = "Something went wrong. Please try again.";

                if (axios.isAxiosError(error)) {
                    message = error.response?.data?.message || message;
                }

                setMessage(message)

                toast.error("Reset code sent failed!", {
                    description: message,
                });
            }
        });

    };

    return (

        <>
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-poppins text-slate-900">

                <Card className="w-full max-w-md border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden">

                    <CardHeader className="pt-10 pb-6 text-center space-y-4">
                        <div className="w-20 h-20 bg-[#1abc9c]/10 rounded-3xl flex items-center justify-center mx-auto text-[#1abc9c] shadow-inner">
                            {isSent ? <CheckCircle2 size={36} /> : <KeyRound size={36} strokeWidth={1.5} />}
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black tracking-tight">
                                {isSent ? "Check your mail" : "Forgot Password?"}
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-medium">
                                {isSent
                                    ? "We've sent a password recovery link to your email address."
                                    : "Enter your email and we'll send you a link to reset your password."}
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="px-10 pb-12">
                        {!isSent ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            {...register("email")}
                                            className={`h-14 pl-12 rounded-2xl border-slate-200 focus:ring-[#1abc9c] focus:border-[#1abc9c] font-bold ${errors.email ? "border-red-500" : ""
                                                }`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-14 bg-[#1abc9c] hover:bg-[#16a085] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#1abc9c]/20 flex gap-3 transition-all active:scale-95"
                                >
                                    {isPending ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>Send Reset Link <ArrowRight size={20} /></>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                                    <InfoIcon className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                                    <p className="text-xs font-bold text-emerald-800 leading-relaxed uppercase tracking-tight">
                                        {/* {`Didn't`} receive the email? Check your spam folder or try again in a few minutes. */}
                                        {message}
                                    </p>
                                </div>

                                <Button
                                    onClick={() => setIsSent(false)}
                                    variant="outline"
                                    className="w-full h-14 rounded-2xl border-slate-200 font-black text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Try another email
                                </Button>
                            </div>
                        )}

                        {/* --- BACK TO LOGIN --- */}
                        <div className="mt-8 text-center">
                            <Link
                                href="/signin"
                                className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-[#1abc9c] transition-colors group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to signin
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    NexShop Secure Account Recovery
                </p>
            </div>
            <Toaster />
        </>
    );
}

// --- SMALL HELPER ICON ---
function InfoIcon(props: { size: number, className: string }) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
        </svg>
    );
}