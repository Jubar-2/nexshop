import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/image/logo.png";

interface AuthBrandingProps {
    description: string;
    btnText: string;
}

export const AuthBranding = ({ description, btnText }: AuthBrandingProps) => {
    return (
        <div className="h-[35%] md:h-full relative md:w-[50%]">

            {/* --- FLOATING ARROW BUTTON --- */}

            {/* Desktop Arrow (Points Right) */}
            <div className="hidden md:block absolute left-[88%] top-1/2 -translate-y-1/2 z-20">
                <div className="bg-primary-500 p-5 rounded-full shadow-xl border-[6px] border-white">
                    <ChevronRight className="text-white w-8 h-8" />
                </div>
            </div>

            {/* Mobile Arrow (Points Down) */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 md:hidden z-20">
                <div className="bg-primary-500 p-4 rounded-full shadow-xl border-4 border-white">
                    <ChevronDown className="text-white w-6 h-6" />
                </div>
            </div>

            <div
                className="relative flex-[1.2] bg-accent-500 text-white p-10 md:p-16 flex flex-col justify-center items-center md:items-start z-10 
                    h-full rounded-b-[50px] md:rounded-b-none md:[clip-path:polygon(0_0,75%_0,100%_50%,75%_100%,0_100%)] [clip-path:polygon(100%_0px,100%_78%,50%_100%,0px_78%,0_0)]"
            >
                {/* Logo */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="bg-white rounded-full p-3 w-fit mb-3 shadow-xl">
                        <Image src={Logo} alt="Logo" width={40} height={40} className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold tracking-[0.2em] font-poppins">NEXSHOP</h1>
                </div>

                {/* Text: Hidden on mobile, visible on desktop */}
                <div className="hidden md:block mt-6">
                    <p className="text-slate-300 max-w-xs leading-relaxed mb-10 text-sm md:text-base">
                       {description}
                    </p>
                    <Button className="bg-primary-500 hover:bg-primary-600 rounded-full px-10 py-6 text-lg">
                        {btnText}
                    </Button>
                </div>
            </div>
        </div>
    );
};