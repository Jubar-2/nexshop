import { CheckCircle2, Clock, XCircle } from "lucide-react";
import StatCard from "./StatCard";

function SubmissionsStats() {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-slate-800">My Submissions Overview</h2>
                <div className="h-px flex-1 bg-slate-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Pending Review"
                    value="0"
                    icon={<Clock />}
                    color="amber"
                    trend="Currently being checked"
                />
                <StatCard
                    title="Approved"
                    value="0"
                    icon={<CheckCircle2 />}
                    color="emerald"
                    trend="Earned from these"
                />
                <StatCard
                    title="Rejected"
                    value="0"
                    icon={<XCircle />}
                    color="red"
                    trend="Review notes available"
                />
            </div>
        </div>
    )
}

export default SubmissionsStats;