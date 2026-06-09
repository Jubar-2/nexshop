"use client";

import {
    Banknote,
    Clock,
    ShieldCheck,
    CircleDollarSign,
    Info,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import HeaderBalance from "@/components/worker/dashboard/HeaderBalance";
import RecentActivity from "@/components/worker/dashboard/RecentActivity";
import RuleItem from "@/components/worker/dashboard/RuleItem";
import MethodCard from "@/components/worker/dashboard/MethodCard";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    WithdrawSchema,
    WithdrawSchemaInput,
} from "@/lib/validations/payment";
import { useRouter } from "next/navigation";
import { useGetWithdrawalFee } from "@/hooks/use-settings";
import { useFreelancerProfile } from "@/hooks/use-freelancer";
import Alert from "@/components/worker/Alert";

export default function WithdrawPage() {
    const { data } = useGetWithdrawalFee();
    const { data: profileData, isLoading } = useFreelancerProfile();

    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm<WithdrawSchemaInput>({
        resolver: zodResolver(WithdrawSchema(data?.minWithdrawAmount)),
        mode: "onChange",
        defaultValues: {
            amount: undefined,
            phoneNumber: "",
            accountType: undefined,
            paymentMethod: undefined,
        },
    });

    const queryClient = useQueryClient();

    // WATCH VALUES
    const amount = watch("amount");
    const method = watch("paymentMethod");

    const withdrawFee = data?.fee || 0;
    const numAmount = Number(amount) || 0;
    const fee = numAmount > 0 ? numAmount * withdrawFee / 100 : 0;
    const netAmount = numAmount - fee;

    // MUTATION
    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: WithdrawSchemaInput) => {
            const response = await axios.post(
                "/api/freelancer/payment/request/submit",
                payload
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Withdrawal Request Sent", {
                description: `৳${numAmount} via ${method?.toUpperCase()} is now pending review.`,
                icon: (
                    <div className="bg-emerald-50 p-1 rounded-lg">
                        <Clock className="text-emerald-500 w-4 h-4" />
                    </div>
                ),
            });

            reset();
            queryClient.invalidateQueries({ queryKey: ["withdrawal-history"] });

            router.push("/dashboard/withdraw/success");
        },
        onError: (error: unknown) => {
            let message = "Something went wrong. Please try again.";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }

            toast.error("Withdrawal Failed", { description: message });
        },
    });

    const handleWithdraw = (data: WithdrawSchemaInput) => {
        mutate(data);
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-4xl mx-auto px-4 space-y-6">
                <HeaderBalance />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                                    <Banknote className="text-blue-500" size={18} /> Transfer
                                    Details
                                </CardTitle>
                            </CardHeader>

                            <form onSubmit={handleSubmit(handleWithdraw)}>
                                <CardContent className="p-8 space-y-8">
                                    {/* METHOD */}
                                    <div className="space-y-4">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                            Select Method
                                        </Label>

                                        <input type="hidden" {...register("paymentMethod")} />

                                        <div className="grid grid-cols-2 gap-4">
                                            <MethodCard
                                                name="bKash"
                                                active={method === "BkASH"}
                                                onClick={() =>
                                                    setValue("paymentMethod", "BkASH", {
                                                        shouldValidate: true,
                                                    })
                                                }
                                                color="#D12053"
                                            />
                                            <MethodCard
                                                name="Nagad"
                                                active={method === "NAGAD"}
                                                onClick={() =>
                                                    setValue("paymentMethod", "NAGAD", {
                                                        shouldValidate: true,
                                                    })
                                                }
                                                color="#ED1C24"
                                            />
                                        </div>

                                        {errors.paymentMethod && (
                                            <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                                                {errors.paymentMethod.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* PHONE */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                            Account Number
                                        </Label>

                                        <Input
                                            {...register("phoneNumber")}
                                            disabled={Number(data?.minWithdrawAmount) > Number(profileData?.currentBalance) || isLoading}
                                            placeholder="017XXXXXXXX"
                                            type="text"
                                            className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 font-bold"
                                        />

                                        {errors.phoneNumber && (
                                            <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                                                {errors.phoneNumber.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* TYPE + AMOUNT */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* ACCOUNT TYPE */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                                Account Type
                                            </Label>

                                            <Select
                                                disabled={Number(data?.minWithdrawAmount) > Number(profileData?.currentBalance) || isLoading}
                                                onValueChange={(val) =>
                                                    setValue("accountType", val as "PERSONAL" | "AGENT", {
                                                        shouldValidate: true,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="py-5.75 w-full rounded-xl border border-slate-200 bg-white px-4 font-black text-slate-800">
                                                    <SelectValue placeholder="Personal/Agent" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="PERSONAL">
                                                            PERSONAL
                                                        </SelectItem>
                                                        <SelectItem value="AGENT">
                                                            AGENT
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            {errors.accountType && (
                                                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                                                    {errors.accountType.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* AMOUNT */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                                Amount (৳)
                                            </Label>

                                            <Input
                                                {...register("amount", { valueAsNumber: true })}
                                                type="number"
                                                disabled={Number(data?.minWithdrawAmount) > Number(profileData?.currentBalance) || isLoading}
                                                placeholder={`Min. ${data?.minWithdrawAmount || "..."}`}
                                                className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 font-black text-lg"
                                            />

                                            {errors.amount && (
                                                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                                                    {errors.amount.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* CALCULATION */}
                                    {numAmount > 0 && (
                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                                <span>Withdrawal Amount</span>
                                                <span>৳{numAmount}</span>
                                            </div>

                                            <div className="flex justify-between text-xs font-bold text-red-400 mb-4">
                                                <span>Processing Fee (5%)</span>
                                                <span>
                                                    - ৳{(fee).toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="h-px bg-slate-200 mb-4"></div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-black text-slate-800">
                                                    Net Received
                                                </span>
                                                <span className="text-xl font-black text-emerald-600">
                                                    ৳{netAmount.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* INFO */}
                                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                        <ShieldCheck className="text-blue-500" size={20} />
                                        <p className="text-[11px] font-bold text-blue-800 uppercase">
                                            Funds are usually processed within 24 hours.
                                        </p>
                                    </div>

                                    {/* BUTTON */}
                                    <Button
                                        type="submit"
                                        disabled={Number(data?.minWithdrawAmount) > Number(profileData?.currentBalance) || isLoading || isPending}
                                        className="w-full bg-slate-900 text-white font-black h-14 rounded-2xl"
                                    >
                                        {isPending ? (
                                            "Processing..."
                                        ) : (
                                            <>
                                                <CircleDollarSign size={20} /> Confirm Withdrawal
                                            </>
                                        )}
                                    </Button>
                                    {
                                        Number(data?.minWithdrawAmount) < Number(profileData?.currentBalance) ||
                                        <Alert
                                            title="Insufficient balance"
                                            note="You don't have enough balance. Please earn more to continue."
                                        />
                                    }

                                </CardContent>
                            </form>
                        </Card>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">
                        <Card className="bg-white border-none shadow-sm rounded-3xl">
                            <CardHeader className="bg-slate-50/50 border-b px-6 py-4">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Info size={16} /> Important Rules
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-6">
                                <ul className="space-y-4">
                                    <RuleItem text="Minimum payout is ৳500.00" />
                                    <RuleItem text="Maximum daily limit: ৳25,000.00" />
                                    <RuleItem text="Only personal numbers allowed" />
                                    <RuleItem text="Processing time: 10AM - 10PM" />
                                </ul>
                            </CardContent>
                        </Card>

                        <RecentActivity />
                    </div>
                </div>
            </div>
        </div>
    );
}