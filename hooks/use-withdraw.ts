import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Transaction {
    id: string;
    amount: number;
    fee: number;
    method: string;
    status: string;
    createdAt: string;
}

export interface WithdrawalResponse {
    data: Transaction[];
    meta: {
        totalPages: number;
        lastPage: number;
        currentPage: number;
    };
}

export const useGetWithdrawalStatement = (page: number, search: string) => {
    return useQuery<WithdrawalResponse>({
        queryKey: ["WithdrawalStatement", page, search],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/freelancer/payment?page=${page}&limit=10&search=${search}`
            );
            return data.data;
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60,
    });
};