import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetWithdrawals = (page: number, search: string, filter: string) => {
    return useQuery({
        queryKey: ["admin-withdrawals", page, search, filter],
        queryFn: async () => {
            const statusParam = filter !== "All" ? `&status=${filter}` : "";
            const { data } = await axios.get(`/api/admin/withdraw-request?page=${page}&search=${search}${statusParam}`);
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useGetWithdrawal = (id: string) => {
    return useQuery({
        queryKey: ["admin-withdrawal", id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/admin/withdrawals/${id}`);
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useUpdateWithdrawalStatus = () => useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
        const response = await axios.patch(`/api/admin/withdrawals/${id}/status`, { status });
        return response.data;
    }
});

export const useUpdateWithdrawalApproved = () => useMutation({
    mutationFn: async ({ id, status, trxID }: {
        id: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        trxID?: string | undefined;
    }) => {
        const response = await axios.patch(`/api/admin/withdraw-request/change-status`, { status, id, trxID });
        return response.data;
    }
});