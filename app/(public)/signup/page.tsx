import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { AuthBranding } from '@/components/auth/auth-branding';
import { AuthHeader } from '@/components/auth/auth-header';
import { SocialAuth } from '@/components/auth/social-auth';

export default function signup() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center md:p-6 font-poppins">
            {/* Main Container: Increased desktop height slightly to fit more fields */}
            <div className="relative w-full h-screen md:h-211.75 md:max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row md:rounded-[40px] md:overflow-hidden">

                {/* --- BRANDING SECTION --- */}
                <AuthBranding
                    description="Create an account today and experience the best shopping journey with NexShop. Exclusive deals are waiting for you."
                    btnText="Learn More" />
                {/* --- FORM SECTION --- */}
                <div className="flex-1 bg-white p-8 md:p-16 md:pl-15 flex flex-col justify-center pt-16 md:pt-16">

                    <AuthHeader title="Create Account" subtitle="Register to get started" />
                    <form className="space-y-3 md:space-y-4 max-w-md mx-auto w-full">
                        {/* Full Name Field */}
                        <Input
                            type="text"
                            placeholder="Full Name"
                            className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                        />

                        {/* Email Field */}
                        <Input
                            type="email"
                            placeholder="Email"
                            className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                        />

                        {/* Mobile Number Field */}
                        <Input
                            type="tel"
                            placeholder="Mobile Number"
                            className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                        />

                        {/* Password Field */}
                        <Input
                            type="password"
                            placeholder="Password"
                            className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                        />

                        {/* Confirm Password Field */}
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500"
                        />

                        {/* Register Button */}
                        <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold h-14 rounded-full text-lg md:text-xl shadow-lg transition-transform active:scale-95 mt-2">
                            Sign Up
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