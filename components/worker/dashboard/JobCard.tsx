import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatJobTime } from "@/hooks/utility";
import { Job } from "@/types/jobs";
import { ChevronRight, Clock, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const JobCard = ({ job }: { job: Job }) => {

    const router = useRouter();

    // Calculate progress percentage
    const progressValue = (job.submissionCount / job.workerRequired) * 100;

    const formattedBalance = useMemo(() => {
        const value = job.reward ?? 0;
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(value).replace("BDT", "৳"); // Clean custom currency symbol
    }, [job.reward]);

    const date = formatJobTime(job.createdAt)

    return (
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">

                    {/* Icon Section */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        dangerouslySetInnerHTML={{ __html: job.category.icon }}
                    >
                        {/* {React.cloneElement(job.category.icon, { size: 36 })} */}
                    </div>

                    {/* Info Section */}
                    <div className="grow space-y-2 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h3 className="text-lg font-black text-slate-800 leading-tight">
                                {job.jobTitle}
                            </h3>
                            <Badge variant="outline" className="w-fit mx-auto md:mx-0 border-emerald-100 text-emerald-600 bg-emerald-50 rounded-lg px-2 font-bold text-[10px] uppercase">
                                {job.subCategory.name}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400 text-xs font-bold uppercase tracking-tight">
                            <span className="flex items-center gap-1.5"><Globe size={14} /> {job.category.name}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {date}</span>
                        </div>

                        {/* Progress Tracker */}
                        <div className="pt-2 max-w-xs mx-auto md:mx-0">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slots Left</span>
                                <span className="text-xs font-bold text-slate-700">{job.submissionCount} / {job.workerRequired}</span>
                            </div>
                            <Progress value={progressValue} className="h-1.5 bg-slate-100 [&>div]:bg-emerald-500" />
                        </div>
                    </div>

                    {/* Reward & Action Section */}
                    <div className="flex flex-col items-center md:items-end gap-3 min-w-35">
                        <div className="text-center md:text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">You Earn</p>
                            <h4 className="text-2xl font-black text-emerald-600">{formattedBalance}</h4>
                        </div>
                        <Button
                            onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                            className="w-full bg-slate-900 hover:bg-black text-white font-black rounded-xl h-11 px-8 flex gap-2 transition-all active:scale-95 shadow-md">
                            Apply <ChevronRight size={18} />
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card >
    );
}

export default JobCard