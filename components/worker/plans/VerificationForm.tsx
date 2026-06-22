import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpgradeMembership } from "@/hooks/use-plan"
import { MemberShipUpgradeInput, MemberShipUpgradeInSchema } from "@/lib/validations/membership"
import { zodResolver } from "@hookform/resolvers/zod"
import { Hash, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import axios from "axios"


function VerificationForm({ method }: { method: "BkASH" | "NAGAD" }) {
    const router = useRouter();

    const params = useParams();
    const id = params.id as string;
    // const { data } = useGetPlan(id)

    const { mutate, isPending } = useUpgradeMembership();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<MemberShipUpgradeInput>({
        resolver: zodResolver(MemberShipUpgradeInSchema),
        defaultValues: {
            planId: id,
            phoneNumber: "",
            trxID: "",
            paymentMethod: method
        }
    });


    const handleConfirm = (data: MemberShipUpgradeInput) => {
        mutate(data, {
            onSuccess: () => {
                reset();
                toast.success("Upgrade Request Submitted", {
                    description: "Status will be updated in your dashboard within 1 hour.",
                    icon: <ShieldCheck className="text-emerald-500" />
                });
                router.push(`/dashboard/plans/upgrade/${id}/success`);
            },
            onError: (error) => {

                let message = "Something went wrong. Please try again.";

                if (axios.isAxiosError(error)) {
                    message = error.response?.data?.message || message;
                }

                toast.error(
                    <span className="text-red-600 font-semibold">
                        Upgrade Request Submit Failed
                    </span>, {
                    description: (
                        <p className="text-red-600 font-medium">
                            {message}
                        </p>
                    ),
                });
            }
        })

    };

    return (
        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Hash size={16} /> 3. Verification
                </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(handleConfirm)}>
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Payment Number</Label>
                            <Input
                                required
                                placeholder="Your Phone Number"
                                className="h-12 rounded-xl border-slate-200 focus:border-blue-500 font-bold"
                                {...register("phoneNumber")}
                            />

                            {errors.phoneNumber && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">
                                {String(errors.phoneNumber.message)}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Transaction ID (TrxID)</Label>
                            <Input
                                required
                                placeholder="8X2K9L0P"
                                className="h-12 rounded-xl border-slate-200 focus:border-blue-500 font-black font-mono tracking-widest"
                                {...register("trxID")}
                            />
                            {errors.trxID && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">
                                {String(errors.trxID.message)}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Account Type</Label>
                            <Controller
                                name="accountType"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="h-12 rounded-xl border-slate-200 font-semibold">
                                            <SelectValue placeholder="Select Platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PERSONAL">PERSONAL</SelectItem>
                                            <SelectItem value="AGENT">AGENT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.accountType && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">
                                {String(errors.accountType.message)}</p>}
                        </div>
                    </div>

                    <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4">
                        <ShieldCheck className="text-blue-500 shrink-0" size={24} />
                        <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
                            By submitting, you agree to our terms. Fake IDs will lead to permanent account suspension without refund.
                        </p>
                    </div>

                    <Button
                        disabled={isPending}
                        className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95"
                    >
                        {isPending ? "Verifying..." : "Confirm Upgrade"}
                    </Button>
                </CardContent>
            </form>
        </Card>
    )
}

export default VerificationForm