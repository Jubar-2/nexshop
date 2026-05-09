import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetJobs = () => {
    return useQuery({
        queryKey: ["freelancer-jobs"],
        queryFn: async () => {
            const { data } = await axios.get("/api/freelancer/jobs");
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}