
import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';
import { useGetSpin } from '@/hooks/use-jobs';
import { Spinner as Loader } from "@/components/ui/spinner"
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function Spinner() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [hasSpun, setHasSpun] = useState(false);

    const { data, isLoading } = useGetSpin();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/freelancer/payment/request/submit");
            return response.data;
        },
        onSuccess: () => {
            // toast.success("Withdrawal Request Sent", {
            //     description: ` via is now pending review.`,
            //     icon: (
            //         <div className="bg-emerald-50 p-1 rounded-lg">
            //             <Clock className="text-emerald-500 w-4 h-4" />
            //         </div>
            //     ),
            // });

            setTimeout(() => {
                setIsSpinning(false);
                setHasSpun(true);
                toast.success("Bonus Applied!", {
                    description: "You've earned a 5% speed-up on your next approval!",
                    icon: <Trophy className="text-amber-500 w-5 h-5" />
                });
            }, 4000); // Match CSS transition duration

            queryClient.invalidateQueries({ queryKey: ["withdrawal-history"] });

        },
        onError: (error: unknown) => {
            let message = "Something went wrong. Please try again.";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }

            toast.error("Withdrawal Failed", { description: message });
        },
    });

    const startSpin = () => {
        if (isSpinning || hasSpun || isLoading) return;

        if (!data.spin) {
            return
        }

        setIsSpinning(true);
        // Generate a random rotation between 2000 and 5000 degrees for effect
        // const ran = Math.random()
        // console.log(ran)
        const newRotation = rotation + 1800 + Math.floor(0.27011420236769 * 360);
        setRotation(newRotation);

        mutate()


    };
    return (
        <Card className="bg-white border-none shadow-sm rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-6">
                <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Daily Lucky Spin</Badge>
            </div>

            {/* The Pointer */}
            {isLoading ? (<Loader />) : (
                <>
                    <div className="absolute top-[28%] z-20 transform -translate-y-full">
                        <div className="w-8 h-10 bg-slate-900 [clip-path:polygon(50%_100%,0_0,100%_0)] shadow-lg border-x-2 border-white"></div>
                    </div>

                    {/* The actual Wheel */}
                    <div
                        className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-slate-100 shadow-2xl transition-transform duration-4000 cubic-bezier(0.15, 0, 0.15, 1)"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            background: `conic-gradient(
                            #ffadad 0deg 30deg, #ffd6a5 30deg 60deg, #fdffb6 60deg 90deg, 
                            #caffbf 90deg 120deg, #9bf6ff 120deg 150deg, #a0c4ff 150deg 180deg, 
                            #bdb2ff 180deg 210deg, #ffc6ff 210deg 240deg, #ffadad 240deg 270deg,
                            #ffd6a5 270deg 300deg, #caffbf 300deg 330deg, #9bf6ff 330deg 360deg
                        )`
                        }}
                    >
                        {/* Numbers around the wheel */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute inset-0 flex items-start justify-center font-black text-slate-800/40 text-xs"
                                style={{ transform: `rotate(${i * 30 + 15}deg)`, paddingTop: '15px' }}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* Center Spin Button */}
                    <button
                        onClick={startSpin}
                        disabled={data?.spin || false /* isSpinning || hasSpun */}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center font-black text-white text-sm md:text-base uppercase tracking-tighter transition-all active:scale-90 disabled:opacity-100
                        ${!data?.spin ? 'bg-slate-400' : 'bg-slate-900 hover:bg-black cursor-pointer animate-pulse-subtle'}
                    `}
                    >
                        {data?.spin ? "..." : hasSpun ? "Used" : "Spin"}
                    </button>
                </>

            )}

            <p className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                Spin to win a random <span className="text-emerald-500">Bonus Reward</span>
            </p>
        </Card>
    )
}

export default Spinner