import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import StatusBadge from "@/components/worker/statement/StatusBadge"
import { Job as JobType } from '@/types/jobs';
import { Clock, Globe, MoreHorizontal, PauseCircle, PlayCircle } from "lucide-react"
import { useMemo } from "react";

const BrandIcons: Record<string, React.ReactNode> = {
    YouTube: <Clock className="text-[#FF0000]" size={18} />,
    Facebook: <Clock className="text-[#1877F2]" size={18} />,
    Instagram: <Clock className="text-[#E4405F]" size={18} />,
    Others: <Globe className="text-slate-400" size={18} />
};

function Job({ job }: { job: JobType }) {

    const formattedBalance = useMemo(() => {
        const value = job?.reward ?? 0;
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(value).replace("BDT", "৳"); // Clean custom currency symbol
    }, [job.reward]);

    return (
        <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
            <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        {BrandIcons[job.category.name] || BrandIcons.Others}
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-800 leading-none mb-1">{job.jobTitle}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                            {job.subCategory.name} • {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6 min-w-50">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                        <span>Slots Remaining</span>
                        <span>{job.workerRequired} Required</span>
                    </div>
                    <Progress value={0} className="h-1.5 bg-slate-100 [&>div]:bg-blue-500" />
                </div>
            </td>
            <td className="px-8 py-6 text-center">
                <span className="text-sm font-black text-slate-700 tracking-tighter">
                    {formattedBalance}
                </span>
            </td>
            <td className="px-8 py-6 text-center">
                <StatusBadge status={job.status} />
            </td>
            <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-500">
                        {job.status === 'ACTIVE' ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400">
                        <MoreHorizontal size={18} />
                    </Button>
                </div>
            </td>
        </tr>
    )
}

export default Job