import { useFreelancerProfile, useGetPandingEarnings, useGetTotalEarnings } from "@/hooks/use-freelancer";
import StatCard from "./StatCard";
import {
    Wallet, Clock, TrendingUp,
    AlertCircle
} from 'lucide-react';


function EarningsStats() {
    const { data, isLoading, isError } = useFreelancerProfile();
    const { data: pandingEarningsData, isLoading: pandingEarningsIsLoading, isError: pandingEarningsIsError } = useGetPandingEarnings();

    const {
        data: pandingTotalEarningsData,
        isLoading: pandingTotalEarningsIsLoading,
        isError: pandingTotalEarningsIsError
    } = useGetTotalEarnings();
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                value={data?.balance ?? 0}
                title="Available Balance"
                isLoading={isLoading}
                isError={isError}
                icon={<Wallet />}
                color="emerald"
                trend="+2.5% from last week"
            />
            <StatCard
                title="Pending Earnings"
                value={pandingEarningsData?.reward}
                isLoading={pandingEarningsIsLoading}
                isError={pandingEarningsIsError}
                icon={<Clock />}
                color="amber"
                trend="Awaiting review"
            />
            <StatCard
                title="Total Earned"
                isLoading={pandingTotalEarningsIsLoading}
                isError={pandingTotalEarningsIsError}
                value={pandingTotalEarningsData?.amount}
                icon={<TrendingUp />}
                color="blue"
                trend="Lifetime earnings"
            />
        </div>
    )
}

export default EarningsStats;