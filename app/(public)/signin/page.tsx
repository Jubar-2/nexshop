import { AuthBranding } from "@/components/auth/auth-branding";
import { AuthHeader } from "@/components/auth/auth-header";
import { SocialAuth } from "@/components/auth/social-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center md:p-6 font-poppins">
            <div className="relative w-full h-screen md:h-162.5 md:max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row md:rounded-[40px] md:overflow-hidden">

                <AuthBranding
                    description="Sign in to your account and explore the best royal shopping experience."
                    btnText="Learn More"
                />

                <div className="flex-1 bg-white p-8 md:p-16 md:pl-15 flex flex-col justify-center pt-16 md:pt-16">
                    <AuthHeader title="Welcome Back!" subtitle="Sign in to continue" />

                    <form className="space-y-4 md:space-y-6 max-w-md mx-auto w-full">
                        <Input
                            type="email"
                            placeholder="Email"
                            className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500 font-poppins"
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            className="h-14 rounded-full border-2 border-slate-200 px-8 font-semibold focus-visible:ring-accent-500 font-poppins"
                        />

                        <div className="flex items-center justify-between px-2 text-sm md:text-base">
                            {/* <div className="flex items-center space-x-2">
                                <Checkbox id="remember" className="data-[state=checked]:bg-[#2D3344]" />
                                <Label htmlFor="remember" className="text-slate-500 font-semibold cursor-pointer">
                                    Remember me
                                </Label>
                            </div> */}
                            <Button variant="link" className="text-slate-400 font-semibold p-0 h-auto">
                                Forgot Password?
                            </Button>
                        </div>

                        <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold h-14 rounded-full text-lg md:text-xl shadow-lg transition-transform active:scale-95">
                            Sign In
                        </Button>

                        {/* --- GOOGLE BUTTON --- */}
                        <SocialAuth text="Continue with Google" />
                    </form>

                    {/* Footer */}
                    <div className="mt-8 md:mt-10 pb-6 md:pb-0 text-center text-slate-500 font-medium text-sm md:text-base">
                        Don t have an account?{' '}
                        <Link href="/signup" className="text-accent-500 font-bold hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}