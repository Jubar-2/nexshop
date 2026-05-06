import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetOffers = () => {
    return useQuery({
        queryKey: ["plans"],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/admin/offers`
            );
            return data.data;
        },
        placeholderData: (prev) => prev,
        staleTime: (1000 * 60) * 72,
    });
};