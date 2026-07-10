import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetPrices = () => {
    return useQuery({
        queryKey: ["prices"],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/membership`
            );
            return data.data;
        },
        placeholderData: (prev) => prev,
        staleTime: (1000 * 60) * 72,
    });
};
