"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, ArrowRight, RefreshCcw, MailOpen, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast, Toaster } from "sonner";

// --- VALIDATION ---
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { otpSchema, OTPValues } from "@/lib/validations/otpCode";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useGetEmailData, useResendEmail, useVerifyEmail } from "@/hooks/use-forgate-password";

export default function OTPVerificationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const { data, isLoading } = useGetEmailData();
  const { mutate, isPending } = useVerifyEmail();
  const { mutate: resend, isPending: resendPending } = useResendEmail();

  // Initialize Form
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setError
  } = useForm<OTPValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");

  useEffect(() => {
    if (!data?.verificationCode?.expired) return;
    setCanResend(false);
    const diff =
      new Date(data?.verificationCode?.expired).getTime() - Date.now();

    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    setResendTimer(totalSeconds);
  }, [data]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  const handleResend = () => {
    reset();
    resend('', {
      onSuccess: () => {
        setCanResend(false);
        setResendTimer(120);
        queryClient.invalidateQueries({ queryKey: ["Unverified"] });
        toast.error("New OTP sent to your email!");
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Something went wrong"
          );

          setError("otp", { message: "The code you entered is incorrect." });
        }
      }
    })
  };

  // Handle Submit
  const onSubmit = async (data: OTPValues) => {
    // setIsVerifying(true);
    // console.log(data)
    mutate(data,
      {
        onSuccess: async () => {
          toast.success("Verification successful!");
          router.push("/forgot-password/reset-password");
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Something went wrong"
            );

            setError("otp", { message: "The code you entered is incorrect." });
          }
        }
      }
    )

    // Simulate API Call
    // setTimeout(() => {
    //   setIsVerifying(false);
    //   if (data.otp === "123456") {
    //     toast.success("Verification successful!");
    //   } else {
    //     toast.error("Invalid code.");
    //     // Manual Error setting
    //     setError("otp", { message: "The code you entered is incorrect." });
    //   }
    // }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-poppins text-slate-900">
      <Card className="w-full max-w-md border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden">

        <CardHeader className="pt-10 pb-6 text-center space-y-4">
          <div className="w-20 h-20 bg-[#1abc9c]/10 rounded-3xl flex items-center justify-center mx-auto text-[#1abc9c] shadow-inner">
            <MailOpen size={36} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight">Check your email</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              We sent a 6-digit code to <span className="text-slate-900 font-bold">{isLoading || data?.verificationCode?.email}</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-10 pb-12">
          {/* --- NATIVE FORM TAG --- */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            <div className="flex flex-col items-center gap-4">
              {/* --- CONTROLLER FOR OTP --- */}
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup className="gap-3">
                      <InputOTPSlot index={0} className="w-12 h-16 rounded-2xl border-slate-200 text-xl font-black text-slate-800 focus:ring-[#1abc9c] focus:border-[#1abc9c]" />
                      <InputOTPSlot index={1} className="w-12 h-16 rounded-2xl border-slate-200 text-xl font-black text-slate-800 focus:ring-[#1abc9c]" />
                      <InputOTPSlot index={2} className="w-12 h-16 rounded-2xl border-slate-200 text-xl font-black text-slate-800 focus:ring-[#1abc9c]" />
                    </InputOTPGroup>
                    <InputOTPSeparator className="text-slate-300" />
                    <InputOTPGroup className="gap-3">
                      <InputOTPSlot index={3} className="w-12 h-16 rounded-2xl border-slate-200 text-xl font-black text-slate-800 focus:ring-[#1abc9c]" />
                      <InputOTPSlot index={4} className="w-12 h-16 rounded-2xl border-slate-200 text-xl font-black text-slate-800 focus:ring-[#1abc9c]" />
                      <InputOTPSlot index={5} className="w-12 h-16 rounded-2xl border-slate-200 text-xl font-black text-slate-800 focus:ring-[#1abc9c]" />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
              {/* Manual Error Message Display */}
              {errors.otp && (
                <p className="text-xs font-bold text-red-500">{errors.otp.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={canResend || isPending || otpValue.length < 6}
                className="w-full h-14 bg-[#1abc9c] hover:bg-[#16a085] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#1abc9c]/20 flex gap-3 transition-all active:scale-95 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>Verify Account <ArrowRight size={20} /></>
                )}
              </Button>

              {/* --- RESEND LOGIC --- */}
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {"Didn't receive the code?"}
                </p>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="mt-2 text-[#1abc9c] font-black text-sm flex items-center gap-2 mx-auto hover:underline"
                  >
                    <RefreshCcw size={14} /> Resend Code
                  </button>
                ) : (
                  <p className="mt-2 text-slate-800 font-black text-sm">
                    Resend in <span className="text-[#1abc9c]">{resendTimer}s</span>
                  </p>
                )}
                {/* <Button
                  className="p-3.5 mt-9"
                  onClick={() => signOut({
                    callbackUrl: "/signin",
                  })}>Exit Verification</Button> */}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* --- FOOTER --- */}
      <div className="mt-8 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
        <ShieldCheck size={14} className="text-[#1abc9c]" /> Secure Verification System
      </div>
      <Toaster />
    </div>
  );
}