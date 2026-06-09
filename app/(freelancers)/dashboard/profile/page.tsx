"use client"

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  User, Camera, Mail, ShieldCheck, Zap,
  Share2, Copy, Users,
  DollarSign, CheckCircle2,
} from 'lucide-react';
import { toast } from "sonner"; // Import Sonner
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetProfile, useUpdateProfile, useUpdateProfilePicture } from '@/hooks/use-freelancer';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileSchema, ProfileSchemaInput } from '@/lib/validations/profile';
import BenefitItem from '@/components/worker/plans/BenefitItem';


const Profile = () => {
  // const [referLink] = useState("https://nexshop.com/ref/mdjubair77");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate: mutateUpdateProfilePic } = useUpdateProfilePicture();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSchemaInput>({
    resolver: zodResolver(ProfileSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      country: "",
      division: "",
      district: "",
      subDivision: "",
      postalCode: "",
      addressLine1: ""
    },
  });

  const { data, isLoading } = useGetProfile();

  const formattedBalance = useMemo(() => {
    const value = data?.freelancer.referralBalance ?? 0;
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(value).replace("BDT", "৳"); // Clean custom currency symbol
  }, [data?.freelancer.referralBalance]);

  const { mutate } = useUpdateProfile()
  const router = useRouter();

  const copyToClipboard = (referCode: string) => {
    const referLink = referCode;
    navigator.clipboard.writeText(referLink);

    toast.success("Link Copied Successfully", {
      description: "Your referral link is ready to be shared with your network.",
      // Professional Icon Styling
      icon: <div className="bg-emerald-50 p-1.5 rounded-lg mr-2">
        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
      </div>,
      duration: 3000,
      // Optional: Action button like Facebook/Gmail
      action: {
        label: "Undo",
        onClick: () => console.log("Undo logic here"),
      },
    });
  };

  const handleProfileUpdate = (data: ProfileSchemaInput) => {
    mutate(data);
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    // upload API call here
    const formData = new FormData();
    formData.append("avatar", file);

    mutateUpdateProfilePic(formData)

    // await axios.patch("/api/freelancer/profile/avatar", formData)
  };


  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const profileImageUrl = "https://github.com/shadcn.png";

  useEffect(() => {
    if (data) {
      reset({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        country: data.address?.country,
        division: data.address?.division,
        district: data.address?.district,
        subDivision: data.address?.subDistrict,
        postalCode: data.address?.postalCode,
        addressLine1: data.address?.addressLine1,
      });
    }
  }, [data, reset]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
        <div className="max-w-4xl mx-auto px-4 space-y-6">

          {/* Profile Card */}
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-center gap-6">
                <Skeleton className="h-28 w-28 rounded-full" />

                <div className="flex-1 space-y-3">
                  <Skeleton className="h-7 w-52" />
                  <Skeleton className="h-4 w-72" />
                  <Skeleton className="h-4 w-40" />
                </div>

                <Skeleton className="h-12 w-40 rounded-xl" />
              </div>
            </CardContent>
          </Card>

          {/* Membership */}
          <Skeleton className="h-56 rounded-2xl" />

          {/* Profile Form */}
          <Skeleton className="h-105 rounded-2xl" />

          {/* Referral */}
          <Skeleton className="h-95 rounded-2xl" />

        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleProfileUpdate, error => console.log(error))}>
      <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
        <div className="max-w-4xl mx-auto px-4 space-y-6">

          {/* --- SECTION 1: ACCOUNT INFORMATION --- */}
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-4 border-slate-50 shadow-md">
                    <AvatarImage
                      src={preview || data?.avatar || profileImageUrl} />
                    <AvatarFallback className="text-3xl font-bold bg-slate-100 text-slate-500">JR</AvatarFallback>
                  </Avatar>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button type="button" onClick={handleCameraClick} className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-all active:scale-90">
                    <Camera size={16} className="text-slate-600" />
                  </button>
                </div>

                <div className="grow text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{data?.fullName}</h1>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold gap-1 px-3 py-1 mx-auto md:mx-0">
                      <CheckCircle2 size={14} /> Verified User
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-x-6 gap-y-1 text-slate-500 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400" />
                      {data?.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-blue-500" /> Active Account
                    </span>
                  </div>
                </div>

                <Button className="bg-[#10B981] hover:bg-[#0da06f] font-bold rounded-xl px-8 h-12 shadow-md transition-all active:scale-95">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* --- SECTION 2: MEMBERSHIP PLAN --- */}
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                <Zap className="text-amber-500 fill-amber-500" size={18} /> Active Membership
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-slate-900 text-white shadow-xl">
                <div className="space-y-1 text-center md:text-left">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Tier Level</p>
                  <h3 className="text-3xl font-black text-amber-400 italic">
                    {data?.freelancer?.membershipPlan?.membershipName}
                  </h3>
                  <p className="text-slate-300 text-xs font-medium">
                    Your subscription expires in {
                      data?.freelancer?.membershipPlan?.period === 0 ? "unlimited" : data?.freelancer?.membershipPlan?.period
                    } months
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Button
                    onClick={() => router.push("/dashboard/plans")}
                    className="bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl h-12"
                  >
                    Upgrade Plan
                  </Button>
                  {/* <Button variant="outline" className="bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl h-12">
                  Plan Details
                </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- SECTION 3: PROFILE INFORMATION --- */}
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 px-8 py-5">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                <User className="text-blue-500" size={18} /> Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                <div className="space-y-2">
                  <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.15em] ml-1">
                    phone Number
                  </Label>
                  <Input
                    // {...register("phoneNumber")}
                    {...register("phoneNumber")}
                    className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-semibold text-slate-700 bg-white shadow-sm transition-all"
                  />
                  {errors.phoneNumber && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.phoneNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.15em] ml-1">
                    country
                  </Label>
                  <Input
                    {...register("country")}
                    className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-semibold text-slate-700 bg-white shadow-sm transition-all"
                  />
                  {errors.country && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.country.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.15em] ml-1">
                    division
                  </Label>
                  <Input
                    {...register("division")}
                    className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-semibold text-slate-700 bg-white shadow-sm transition-all"
                  />
                  {errors.division && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.division.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.15em] ml-1">
                    district
                  </Label>
                  <Input
                    {...register("district")}
                    className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-semibold text-slate-700 bg-white shadow-sm transition-all"
                  />
                  {errors.district && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.district.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.15em] ml-1">
                    Sub-District
                  </Label>
                  <Input
                    {...register("subDivision")}
                    className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-semibold text-slate-700 bg-white shadow-sm transition-all"
                  />
                  {errors.subDivision && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.subDivision.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.15em] ml-1">
                    Postal Code
                  </Label>
                  <Input
                    {...register("postalCode")}
                    className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-semibold text-slate-700 bg-white shadow-sm transition-all"
                  />
                  {errors.postalCode && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.postalCode.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.15em] ml-1">
                    Address Line 1
                  </Label>
                  <Input
                    {...register("addressLine1")}
                    className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-semibold text-slate-700 bg-white shadow-sm transition-all"
                  />
                  {errors.postalCode && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.postalCode.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.15em] ml-1">
                    Address Line 1
                  </Label>
                  <Input
                    {...register("addressLine1")}
                    className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus-visible:ring-0 font-semibold text-slate-700 bg-white shadow-sm transition-all"
                  />
                  {errors.addressLine1 && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.addressLine1.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- SECTION 4: REFER & EARN --- */}
          <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 px-8 py-5">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                <Share2 className="text-emerald-500" size={18} /> Partner Referral
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Copy Invitation Code</Label>
                <div className="flex gap-3">
                  <div className="grow bg-slate-50 border-2 border-slate-100 rounded-xl px-5 flex items-center font-mono text-sm text-slate-500 overflow-hidden truncate">
                    {data?.freelancer?.referKey}
                  </div>
                  <Button onClick={() => copyToClipboard(data?.freelancer?.referKey || "")} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2 font-bold px-8 h-12 shadow-sm transition-all active:scale-95">
                    <Copy size={18} /> Copy Link
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-5">
                  <div className="p-3.5 bg-white text-blue-600 rounded-xl shadow-sm"><Users size={28} /></div>
                  <div>
                    <p className="text-3xl font-black text-slate-900">42</p>
                    <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest">Active Referrals</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-5">
                  <div className="p-3.5 bg-white text-emerald-600 rounded-xl shadow-sm"><DollarSign size={28} /></div>
                  <div>
                    <p className="text-3xl font-black text-emerald-700">{formattedBalance}</p>
                    <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest">Bonus Balance</p>
                  </div>
                </div>
              </div>

              {/* How to earn */}
              <div className="bg-slate-50/80 rounded-2xl p-7 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-5 text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Earning Logic:
                </h4>
                <div className="space-y-5">
                  <BenefitItem text="Friends join via your unique referral link." />
                  <BenefitItem text="Receive ৳50.00 bonus on their first withdrawal." />
                  <BenefitItem text="Earn 10% from their lifetime task commissions." />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </form>

  );
};


export default Profile;