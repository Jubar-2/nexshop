"use client"

import { useMemo } from "react";
import { useFreelancerProfile } from "@/hooks/use-freelancer";
import { AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

/**
 * Highly Professional Balance Component
 * Uses TanStack Query for state management and direct data consumption.
 */
export default function Balance() {
    const { data, isLoading, isError } = useFreelancerProfile();

    // Logic: Memoize the formatted value to prevent recalculation on every render
    const formattedBalance = useMemo(() => {
        const value = data?.currentBalance ?? 0;
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(value).replace("BDT", "৳"); // Clean custom currency symbol
    }, [data?.currentBalance]);

    // LLD Principle: Return specific UI states early
    if (isLoading) return <Spinner />;

    if (isError) {
        return (
            <span className="text-red-400 flex items-center gap-1 text-xs">
                <AlertCircle size={12} /> --.--
            </span>
        );
    }

    return (
        <>
            {formattedBalance}
        </>
    );
}