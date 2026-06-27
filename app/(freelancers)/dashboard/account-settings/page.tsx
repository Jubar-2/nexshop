"use client"

import React, { useState } from 'react'
import {
    Lock,
    ShieldCheck,
    Eye,
    EyeOff,
    RefreshCcw,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { PasswordFormValues, PasswordSchema } from '@/lib/validations/changePassword'
import { useChangePassword } from '@/hooks/use-freelancer'
import axios from 'axios'

export default function AccountSettingsPage() {
    const [showPass, setShowPass] = useState(false)

    const { mutate, isPending } = useChangePassword();

    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm<PasswordFormValues>({
        resolver: zodResolver(PasswordSchema)
    })

    const onSubmit = async (data: PasswordFormValues) => {

        mutate(data, {
            onSuccess: () => {
                reset()
                toast.success("Password updated successfully")
            },
            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    if (Array.isArray(error.response?.data?.errors?.currentPassword)) {
                        setError("currentPassword", { message: error.response?.data?.errors?.currentPassword[0] })
                    }

                }

                toast.error("Change Password Error", {
                    description: (error as Error).message,
                });
            }
        });
    }

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans mt-12">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Security</h1>
                        <p className="text-slate-500 text-sm font-medium">Update your password to keep your account secure</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT: FORM CARD (2/3 Width) */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white border-none shadow-sm rounded-4xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                                    <Lock className="text-[#10B981]" size={18} /> Change Password
                                </CardTitle>
                            </CardHeader>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <CardContent className="p-8 space-y-6">

                                    {/* Current Password */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-500 font-bold text-xs uppercase ml-1">Current Password</Label>
                                        <div className="relative">
                                            <Input
                                                {...register("currentPassword")}
                                                type={showPass ? "text" : "password"}
                                                className="h-12 rounded-xl border-slate-200 focus:border-[#10B981] focus:ring-0 font-medium pl-4 pr-10"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPass(!showPass)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {errors.currentPassword && <p className="text-red-500 text-xs font-bold ml-1">{errors.currentPassword.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* New Password */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 font-bold text-xs uppercase ml-1">New Password</Label>
                                            <Input
                                                {...register("newPassword")}
                                                type="password"
                                                className="h-12 rounded-xl border-slate-200 focus:border-[#10B981] focus:ring-0 font-medium"
                                                placeholder="••••••••"
                                            />
                                            {errors.newPassword && <p className="text-red-500 text-xs font-bold ml-1">{errors.newPassword.message}</p>}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 font-bold text-xs uppercase ml-1">Confirm New Password</Label>
                                            <Input
                                                {...register("confirmPassword")}
                                                type="password"
                                                className="h-12 rounded-xl border-slate-200 focus:border-[#10B981] focus:ring-0 font-medium"
                                                placeholder="••••••••"
                                            />
                                            {errors.confirmPassword && <p className="text-red-500 text-xs font-bold ml-1">{errors.confirmPassword.message}</p>}
                                        </div>
                                    </div>

                                    {/* Security Banner */}
                                    <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <ShieldCheck className="text-[#10B981] shrink-0" size={20} />
                                        <p className="text-xs font-bold text-emerald-800 leading-relaxed uppercase tracking-tight">
                                            Use a mix of letters, numbers, and symbols to create a strong password for your Nexshop account.
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-[#10B981] hover:bg-[#0da06f] text-white font-bold h-14 rounded-2xl text-lg shadow-lg flex gap-3 transition-all active:scale-95"
                                    >
                                        {isPending ? <RefreshCcw className="animate-spin" /> : <><Lock size={20} /> Update Password</>}
                                    </Button>
                                </CardContent>
                            </form>
                        </Card>
                    </div>

                    {/* RIGHT: GUIDELINES CARD (1/3 Width) */}
                    <div className="space-y-6">
                        <Card className="bg-white border-none shadow-sm rounded-4xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 uppercase">
                                    <AlertCircle size={16} className="text-amber-500" /> Password Rules
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ul className="space-y-4">
                                    <RuleItem text="Minimum 8 characters" />
                                    <RuleItem text="Include at least one number" />
                                    <RuleItem text="Include one special character" />
                                    <RuleItem text="Cannot be same as old password" />
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}

// Sub-component for Rules
function RuleItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
            <div className="bg-emerald-100 p-1 rounded-full">
                <CheckCircle2 size={12} className="text-[#10B981]" />
            </div>
            {text}
        </li>
    )
}