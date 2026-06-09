import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card";
import HistoryItem from "./HistoryItem";
import { History } from 'lucide-react';
import { Transaction, useGetWithdrawalStatement } from "@/hooks/use-withdraw";
import Link from "next/link";

function RecentActivity() {

    const { data, isLoading } = useGetWithdrawalStatement(1, "", 3);

    const statements = data?.data || [];

    return (
        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 uppercase">
                    <History size={16} className="text-emerald-500" /> Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                    {isLoading ? (
                        [...Array(2)].map((_, i) => (
                            <HistoryItem key={i} isLoading={isLoading} method="bKash" amount="1200" status="Approved" date="Oct 24" />
                        ))
                    ) : statements.length === 0 ? (

                        <div className="px-5 py-5 text-center text-slate-400 font-medium">
                            No transactions found matching your criteria.
                        </div>

                    ) : (
                        statements.map((stmt: Transaction, i) => (
                            <HistoryItem key={i} method={stmt.method} amount={stmt?.amount} status={stmt.status} date="Oct 24" />
                        ))
                    )}

                    {/* <HistoryItem method="bKash" amount="1200" status="Approved" date="Oct 24" />
                    <HistoryItem method="Nagad" amount="550" status="Pending" date="Just now" /> */}
                </div>
                <Link href="/dashboard/statement">
                    <Button variant="ghost" className="w-full h-12 rounded-none text-xs font-bold text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/30">
                        VIEW FULL STATEMENT
                    </Button>
                </Link>

            </CardContent>
        </Card>
    )
}

export default RecentActivity;

