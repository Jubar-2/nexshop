import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetWithdrawalFee = () => {
    return useQuery({
        queryKey: ["Withdrawal-Fee"],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/freelancer/withdrawal-fee`
            );
            return data.data;
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60,
    });
};