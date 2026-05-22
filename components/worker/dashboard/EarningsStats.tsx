import { useFreelancerProfile, useGetPandingEarnings, useGetTotalEarnings } from "@/hooks/use-freelancer";
import StatCard from "./StatCard";
import {
    Wallet, Clock, TrendingUp
} from 'lucide-react';
import { useMemo } from "react";


function EarningsStats() {
    const { data, isLoading, isError } = useFreelancerProfile();
    const { data: pandingEarningsData, isLoading: pandingEarningsIsLoading, isError: pandingEarningsIsError } = useGetPandingEarnings();
    const {
        data: totalEarningsData,
        isLoading: totalEarningsIsLoading,
        isError: totalEarningsIsError
    } = useGetTotalEarnings();


    const formattedBalance = useMemo(() => {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
            minimumFractionDigits: 2,
        })
            .format(data?.currentBalance ?? 0)
            .replace("BDT", "৳");
    }, [data]);


    const formattedPandingEarnings = useMemo(() => {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
            minimumFractionDigits: 2,
        })
            .format(pandingEarningsData?.reward ?? 0)
            .replace("BDT", "৳");
    }, [pandingEarningsData]);

    const formattedTotalReward = useMemo(() => {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
            minimumFractionDigits: 2,
        })
            .format(totalEarningsData?.amount ?? 0)
            .replace("BDT", "৳");
    }, [totalEarningsData]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                value={formattedBalance}
                title="Available Balance"
                isLoading={isLoading}
                isError={isError}
                icon={<Wallet />}
                color="emerald"
                trend="+2.5% from last week"
            />
            <StatCard
                title="Pending Earnings"
                value={formattedPandingEarnings}
                isLoading={pandingEarningsIsLoading}
                isError={pandingEarningsIsError}
                icon={<Clock />}
                color="amber"
                trend="Awaiting review"
            />
            <StatCard
                title="Total Earned"
                isLoading={totalEarningsIsLoading}
                isError={totalEarningsIsError}
                value={formattedTotalReward}
                icon={<TrendingUp />}
                color="blue"
                trend="Lifetime earnings"
            />
        </div>
    )
}

export default EarningsStats;