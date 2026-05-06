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

export const useGetPlans = () => {
    return useQuery({
        queryKey: ["plans"],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/freelancer/membership`
            );
            return data.data;
        },
        placeholderData: (prev) => prev,
        staleTime: (1000 * 60) * 72,
    });
};