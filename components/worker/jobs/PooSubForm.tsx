import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FontEndJobSubmissionInput, FontEndJobSubmissionSchema, JobSubmissionInput } from "@/lib/validations/jobs";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CloudUpload, ImageIcon, Send, ShieldCheck, X, Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";


const PooSubForm = () => {
    const params = useParams();
    const jobId = params.id;

    // const [isSubmitting, setIsSubmitting] = useState(false);

    const route = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FontEndJobSubmissionInput>({
        resolver: zodResolver(FontEndJobSubmissionSchema),
        defaultValues: {
            jobId: "",
            submissionNotes: "",
            profileLink: "",
            proofAttachment: undefined
        }
    });

    // Mutation for API call
    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: FormData) => {
            const response = await axios.post("/api/freelancer/jobs/submit", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Job Published Successfully!", {
                description: "The task is now live for all eligible workers.",
                icon: <div className="bg-emerald-50 p-1.5 rounded-lg"><Zap className="text-emerald-500 w-4 h-4" /></div>
            });
            reset();

            route.push(`/dashboard/jobs/${jobId}/success`);
        },
        onError: (error: unknown) => {
            let message = "Failed to publish";
            console.log(error)
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message;
            }

            toast.error("Failed to publish", { description: message });
        }
    });


    useEffect(() => {
        setValue("jobId", jobId as string);
    }, [jobId, setValue]);

    const fileList = watch("proofAttachment");
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            const url = URL.createObjectURL(file);
            setPreview(url);

            // Clean up memory when component unmounts or file changes
            return () => URL.revokeObjectURL(url);
        } else {
            setPreview(null);
        }
    }, [fileList]);

    const clearFile = (e: React.MouseEvent) => {
        e.preventDefault();
        setValue("proofAttachment", undefined);
        setPreview(null);
    };

    const clickSubmit = (data: FontEndJobSubmissionInput) => {
        console.log(data)

        const formData = new FormData();

        formData.append(
            "proofAttachment",
            data.proofAttachment[0]
        )

        formData.append(
            "submissionNotes",
            data.submissionNotes
        );

        formData.append(
            "jobId",
            data.jobId
        );

        formData.append(
            "profileLink",
            data.profileLink
        );

        mutate(formData);

        // setIsSubmitting(true);

        // setTimeout(() => {
        //     setIsSubmitting(false);
        //     toast.success("Job Proof Submitted!", {
        //         description: "Admin will review your work within 24-48 hours.",
        //         icon: <div className="bg-emerald-50 p-1.5 rounded-lg"><CheckCircle2 className="text-emerald-500 w-4 h-4" /></div>
        //     });
        // }, 1500);
    };

    console.log(errors)

    return (
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                    <ImageIcon className="text-emerald-500" size={18} /> Submit Proof of Work
                </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(
                clickSubmit,
                (errors) => {
                    console.log(errors);
                }
            )}>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-5">
                            {/* <div className="space-y-2">
                    <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Your Account Name</Label>
                    <Input
                      required
                      placeholder="e.g. Jubair Rahman"
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus-visible:ring-0 font-semibold"
                    />
                  </div> */}
                            <div className="space-y-2">
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Your Profile Link</Label>
                                <Input
                                    {...register("profileLink")}
                                    required
                                    placeholder="http://facbook.com/...."
                                    className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus-visible:ring-0 font-semibold"
                                />
                                {errors.profileLink && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">{errors.profileLink.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Additional Proof Text</Label>
                                <Textarea
                                    {...register("submissionNotes")}
                                    placeholder="Any comments for the admin..."
                                    className="rounded-xl border-slate-200 focus:border-blue-500 focus-visible:ring-0 min-h-30 font-medium"
                                />
                                {errors.submissionNotes && <p className="text-[10px] text-red-500 font-bold ml-5 uppercase">
                                    {errors.submissionNotes.message}</p>}
                            </div>
                        </div>

                        {/* <div className="space-y-2">
                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Upload Work Screenshot</Label>
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-slate-50 hover:bg-white transition-all cursor-pointer group h-[208px]">
                                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                    <ImageIcon className="text-slate-300 group-hover:text-emerald-500" size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-slate-700">Choose Screenshot</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">PNG or JPG up to 10MB</p>
                                </div>
                                <Input
                                    type="file"
                                    required
                                    className="hidden"
                                    id="proof-upload"
                                    {...register("proofAttachment")}
                                />
                            </div>
                        </div> */}

                        <div className="space-y-3">
                            <Label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">
                                Upload Work Screenshot
                            </Label>

                            {/* --- THE UPLOAD BOX --- */}
                            <div className="relative group">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="proof-upload"
                                    {...register("proofAttachment")}
                                />

                                <Label
                                    htmlFor="proof-upload"
                                    className={`border-2 border-dashed rounded-3xl p-4 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer h-55 overflow-hidden${preview ? 'border-emerald-500 bg-white'
                                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400'}`}
                                >
                                    {preview ? (
                                        // --- PREVIEW STATE ---
                                        <div className="relative w-full h-full animate-in fade-in zoom-in duration-300">
                                            <Image
                                                src={preview}
                                                fill
                                                alt="Proof Preview"
                                                className="w-full h-full object-cover rounded-2xl"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                                <p className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                                    <CloudUpload size={16} /> Change Image
                                                </p>
                                            </div>
                                            {/* Clear Button */}
                                            <button
                                                onClick={clearFile}
                                                className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg text-red-500 transition-transform active:scale-90"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        // --- EMPTY STATE ---
                                        <>
                                            <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                                <ImageIcon className="text-slate-300 group-hover:text-blue-500" size={32} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-black text-slate-700">Choose Screenshot</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                                                    PNG or JPG up to 10MB
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </Label>
                                {errors.proofAttachment && <p className="text-[10px] pt-2 text-red-500 font-bold ml-5 uppercase">
                                    {String(errors.proofAttachment.message)}</p>}
                                {/* If Preview exists, show the Image, else show the Placeholder */}
                            </div>

                            {/* Selection Confirmation */}
                            {preview && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl animate-in slide-in-from-left-2">
                                    <CheckCircle2 className="text-emerald-500" size={14} />
                                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">
                                        {fileList[0] ? fileList[0].name : ""} selected
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 leading-none mb-1">Verify Before Submitting</p>
                                <p className="text-xs text-slate-500 font-medium italic">Fake proof will result in immediate ban.</p>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full md:w-auto min-w-55 bg-[#10B981] hover:bg-[#0da06f] text-white font-black h-14 rounded-xl text-xl shadow-lg flex gap-3 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {isPending ? "Processing..." : <><Send size={20} /> Submit Work</>}
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    )
}

export default PooSubForm;