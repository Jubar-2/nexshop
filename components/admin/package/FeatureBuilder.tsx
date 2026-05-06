import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { OffersInput, OffersInSchema } from "@/lib/validations/offers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useGetOffers } from "@/hooks/use-offers";
import { Skeleton } from "@/components/ui/skeleton";

type features = {
    id: string,
    offerTitle: string
}

type dataState = {
    name: string,
    price: string,
    duration: string,
    badge: string,
    title: string,
    icon: string,
    color: string,
    planOrder: string,
    submitNumber: string,
    features: features[]
}


type Props = {
    pkg: dataState;
    setPkg: Dispatch<SetStateAction<dataState>>;
    refetch: () => void;
    isLoading: boolean;
};

function FeatureBuilder({ pkg, setPkg, refetch, isLoading }: Props) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<OffersInput>({
        resolver: zodResolver(OffersInSchema),
        mode: "onChange",
        defaultValues: {
            offerTitle: ""
        },
    });



    // MUTATION
    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: OffersInput) => {
            const response = await axios.post(
                "/api/admin/offers/create",
                payload
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Withdrawal Request Sent", {
                description: `add is now pending review.`,
                icon: (
                    <div className="bg-emerald-50 p-1 rounded-lg">
                        <Clock className="text-emerald-500 w-4 h-4" />
                    </div>
                ),
            });

            reset();

            refetch();

            // queryClient.invalidateQueries({ queryKey: ["withdrawal-history"] });

            // router.push("/dashboard/withdraw/success");
        },
        onError: (error: unknown) => {

            let message = "Something went wrong. Please try again.";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }

            toast.error("Withdrawal Failed", { description: message });
        },
    });


    const onSubmit = async (data: OffersInput) => {
        mutate(data);
    };

    const [featureInput, setFeatureInput] = useState("");

    // const addFeature = () => {
    //     if (featureInput.trim()) {
    //         setPkg({ ...pkg, features: [...pkg.features, data] });
    //         setFeatureInput("");
    //     }
    // };

    // setPkg({ ...pkg, features: [...pkg.features, data] });

    const removeFeature = (index: number) => {
        const newFeatures = pkg.features.filter((_, i) => i !== index);
        setPkg({ ...pkg, features: newFeatures });
    };



    return (
        <div className="space-y-4 pt-4">
            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Included Benefits</Label>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-2">
                    <Input
                        {...register("offerTitle")}
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Add a benefit (e.g. Instant Withdrawals)"
                        className="h-12 rounded-xl border-slate-200"
                    // onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <Button
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 h-12 w-12 rounded-xl shrink-0 shadow-md">
                        {isPending ? (
                            <Spinner />
                        ) : (
                            <>
                                <Plus size={24} />
                            </>
                        )}

                    </Button>
                </div>
                {errors.offerTitle && <p className="text-[10px] text-red-500 pt-1 font-bold ml-5 uppercase">{errors.offerTitle.message}</p>}
            </form>

            <div className="grid grid-cols-1 gap-2 pt-2">
                {isLoading ? (
                    [1, 2, 3].map((feat, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-left-2">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" /> <Skeleton className="h-5 w-15 bg-slate-200" />
                            </span>
                        </div>
                    ))
                ) : (
                    pkg.features.map((feat, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-left-2">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                {feat.offerTitle}
                            </span>
                            <button onClick={() => removeFeature(i)} className="text-slate-300 hover:text-red-500 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default FeatureBuilder;