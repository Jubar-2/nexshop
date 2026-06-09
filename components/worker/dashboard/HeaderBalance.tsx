import { Skeleton } from "@/components/ui/skeleton";
import { useFreelancerProfile } from "@/hooks/use-freelancer";
import { AlertCircle, Wallet } from "lucide-react"
import { useMemo } from "react";

function HeaderBalance() {
    const { data, isLoading, isError } = useFreelancerProfile();
    console.log(data)
    // Memoize the formatted value to prevent recalculation on every render
    const formattedBalance = useMemo(() => {
        const value = data?.currentBalance ?? 0;
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(value).replace("BDT", "৳"); // Clean custom currency symbol
    }, [data?.currentBalance]);


    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Withdraw Funds</h1>
                <p className="text-slate-500 font-medium text-sm">Securely transfer your earnings to your mobile wallet</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-60">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 shadow-inner">
                    <Wallet size={28} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Available Balance</p>
                    <h2 className="text-2xl font-black text-emerald-600 tracking-tighter">
                        {isLoading ? (
                            <>
                                <Skeleton className="h-8 w-28 bg-slate-200" />
                            </>) :
                            (<> {formattedBalance}</>)
                        }

                        {isError ? (
                            <>
                                <AlertCircle size={12} /> --.--
                            </>
                        ) : (<></>)}
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default HeaderBalance;