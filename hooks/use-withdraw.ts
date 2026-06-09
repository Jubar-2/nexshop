import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface PaymentDetails {
    paymentMethod: "NAGAD" | "BkASH",
    phoneNumber: string,
    accountType: "AGENT" | "PERSONAL"
}

export interface Transaction {
    id: string;
    amount: number;
    fee: number;
    method: string;
    status: string;
    createdAt: string;
    trxID: string | null;
    withdrawRequest: PaymentDetails;
}

export interface WithdrawalResponse {
    data: Transaction[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export const useGetWithdrawalStatement = (page: number, search: string, limit: number) => {
    return useQuery<WithdrawalResponse>({
        queryKey: ["WithdrawalStatement", page, search, limit],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/freelancer/payment?page=${page}&limit=${limit}&search=${search}`
            );
            return data.data;
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60,
    });
};