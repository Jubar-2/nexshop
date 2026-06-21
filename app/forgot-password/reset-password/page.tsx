"use client";

import React, { useState } from "react";
import {
    LockKeyhole,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- VALIDATION ---
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ResetPasswordSchema, ResetPasswordValues } from "@/lib/validations/resetPassword";
import { useChangePassword } from "@/hooks/use-forgate-password";
import axios from "axios";

export default function SetNewPasswordPage() {
    const router = useRouter();    
    const [showPassword, setShowPassword] = useState(false);
    const { mutate , isPending} = useChangePassword();

    // 1. Initialize Form
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    // 2. Handle Submit
    const onSubmit = async (data: ResetPasswordValues) => {
        mutate(data, {
            onSuccess: () => {
                toast.success("Password updated!", {
                    description: "Your password has been changed successfully.",
                });
                router.push("/signin"); // Redirect to signin after success
            },
            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    toast.error(
                        error.response?.data?.message || "Something went wrong"
                    );
                }
            }
        })
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-poppins text-slate-900">

            <Card className="w-full max-w-md border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden">

                <CardHeader className="pt-10 pb-6 text-center space-y-4">
                    <div className="w-20 h-20 bg-[#1abc9c]/10 rounded-3xl flex items-center justify-center mx-auto text-[#1abc9c] shadow-inner">
                        <LockKeyhole size={36} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-black tracking-tight">Set new password</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">
                            Must be at least 8 characters long.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-10 pb-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* --- NEW PASSWORD --- */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={`h-14 px-6 rounded-2xl border-slate-200 focus:ring-[#1abc9c] focus:border-[#1abc9c] font-bold ${errors.password ? "border-red-500" : ""
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs font-bold text-red-500 ml-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* --- CONFIRM PASSWORD --- */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                Confirm Password
                            </Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className={`h-14 px-6 rounded-2xl border-slate-200 focus:ring-[#1abc9c] focus:border-[#1abc9c] font-bold ${errors.confirmPassword ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs font-bold text-red-500 ml-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* --- SUBMIT --- */}
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-14 bg-[#1abc9c] hover:bg-[#16a085] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#1abc9c]/20 flex gap-3 transition-all active:scale-95"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>Reset Password <ArrowRight size={20} /></>
                            )}
                        </Button>
                    </form>

                    {/* --- SECURITY NOTICE --- */}
                    <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                        <ShieldCheck className="text-[#1abc9c] shrink-0 mt-0.5" size={18} />
                        <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                            NexShop uses 256-bit encryption to ensure your new password is secure and private.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 text-center">
                <Link href="/login" className="text-xs font-black text-slate-400 hover:text-[#1abc9c] uppercase tracking-widest transition-colors">
                    Cancel and return to login
                </Link>
            </div>
        </div>
    );
}