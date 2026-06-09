"use client"

import { useState, useEffect } from 'react';
import {
    Search, CheckCircle2, Clock
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import { ChangeWithdrawStatusSchema, ChangeWithdrawStatusSchemaInput } from '@/lib/validations/payment';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetWithdrawals, useUpdateWithdrawalApproved } from '@/hooks/admin/use-payments';
import Pagination from '@/components/admin/submittedJob/Pagination';
import { useQueryClient } from '@tanstack/react-query';
import { withdrawalRequest } from 'payment';
import AdminSummaryCard from '@/components/admin/payment/AdminSummaryCard';
import TableRowSkeleton from '@/components/admin/payment/TableRowSkeleton';
import ActionDropdown from '@/components/admin/payment/ActionDropdown';
import StatusBadge from '@/components/admin/payment/StatusBadge';

export default function AdminWithdrawals() {

    const queryClient = useQueryClient();

    const [filter, setFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [open, setOpen] = useState(false);

    // Debounce search to avoid too many API calls
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Data Fetching
    const { data, isLoading } = useGetWithdrawals(page, debouncedSearch, filter === "All" ? "" : filter.toUpperCase());
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateWithdrawalApproved();

    const withdrawals = data?.data || [];
    const meta = data?.meta || { totalPages: 1, totalCount: 0 };

    // Form Setup
    const { register, handleSubmit, reset } = useForm<ChangeWithdrawStatusSchemaInput>({
        resolver: zodResolver(ChangeWithdrawStatusSchema),
        defaultValues: {
            trxID: ""
        }
    });

    const approvedHandler = (formData: ChangeWithdrawStatusSchemaInput) => {
        updateStatus(formData, {
            onSuccess: () => {
                toast.success("Withdrawal Approved", { description: "Transaction ID recorded successfully." });
                reset();
                setOpen(false);
                queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
            },
            onError: () => {
                toast.error("Update Failed", { description: "Please try again later." });
                setOpen(false);
            }
        });
    };

    const rejectHandler = (id: string) => {
        updateStatus({ id, status: "REJECTED" }, {
            onSuccess: () => {
                toast.success("Withdrawal Rejected", { description: "Transaction ID recorded successfully." });
                reset();
                setOpen(false);
                queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
            },
            onError: () => {
                toast.error("Update Failed", { description: "Please try again later." });
                setOpen(false);
            }
        });
    }

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
            <div className="max-w-6xl mx-auto px-4 space-y-6">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Withdrawal Requests</h1>
                        <p className="text-slate-500 font-medium text-sm">Review and process user payout applications</p>
                    </div>
                    <div className="flex gap-4">
                        <AdminSummaryCard label="Pending" val={String(meta.pendingCount || 0)} color="amber" icon={<Clock size={16} />} />
                        <AdminSummaryCard label="Total Items" val={String(meta.totalCount)} color="emerald" icon={<CheckCircle2 size={16} />} />
                    </div>
                </div>

                {/* --- FILTERS --- */}
                <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setFilter(tab); setPage(1); }}
                                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search user or TXID..."
                                    className="h-11 pl-10 rounded-xl bg-slate-50 border-none"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- TABLE --- */}
                <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User / ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
                                ) : withdrawals.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">No withdrawals found</td>
                                    </tr>
                                ) : (
                                    withdrawals.map((req: withdrawalRequest) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                                                        <AvatarFallback className="bg-slate-100 font-black text-slate-400 text-xs uppercase">{req.freelancer?.user.fullName[0] || 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800 leading-none mb-1">
                                                            {req.freelancer?.user.email}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-blue-500 font-mono uppercase tracking-tighter">
                                                            {req.freelancer?.user.fullName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className={`text-xs font-black italic tracking-tighter 
                                                        ${req?.paymentMethod === 'BKASH' ? 'text-[#D12053]' : 'text-[#ED1C24]'}`}>
                                                        {req?.paymentMethod}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-slate-500">{req?.phoneNumber}</span>
                                                    <span className="text-[11px] font-bold text-slate-500">{req?.accountType}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-lg font-black text-slate-900 tracking-tighter">৳{req?.transactions?.amount}</span>
                                                <p className="text-[11px] font-bold text-slate-500">Fee: ৳{req?.transactions?.fee}</p>
                                                <p className="text-[10px] font-bold text-blue-500 font-mono tracking-tighter">
                                                    {req?.transactions?.trxID}
                                                </p>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <StatusBadge status={req.status} />
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {req.status === 'PENDING' ? (
                                                        <>
                                                            <AlertDialog open={open} onOpenChange={setOpen} >
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        // onClick={() => {
                                                                        //     setValue("id", req?.id);
                                                                        //     setValue("status", "APPROVED");
                                                                        // }}
                                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-9 rounded-xl shadow-sm"
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="font-poppins">
                                                                    <form>
                                                                        <input type="hidden" {...register("id")} value={req?.id} />
                                                                        <input type="hidden" {...register("status")} value="APPROVED" />
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Finalize Approval</AlertDialogTitle>
                                                                            <AlertDialogDescription className="text-xs font-medium">
                                                                                Please provide the Transaction ID (TrxID) after sending the money.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <Input
                                                                            {...register("trxID")}
                                                                            placeholder="Enter bKash/Nagad TrxID"
                                                                            className="mt-4 h-12 rounded-xl"
                                                                        />
                                                                        <AlertDialogFooter className="mt-6">
                                                                            <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                // type="submit"
                                                                                disabled={isUpdating}
                                                                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold"
                                                                                onClick={handleSubmit(approvedHandler)}
                                                                            >
                                                                                Confirm Payment
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </form>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                            <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 font-bold h-9 rounded-xl" onClick={() => rejectHandler(req?.id)}>
                                                                Reject
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <ActionDropdown />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* --- PAGINATION --- */}
                <Pagination meta={meta} setPage={setPage} isLoading={isLoading} />
            </div>
        </div>
    );
}








