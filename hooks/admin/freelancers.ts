import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetFreelancers = (page : number) => {
    return useQuery({
        queryKey: ["admin-freelancers", page],
        queryFn: async () => {
            const { data } = await axios.get(`/api/admin/freelancers?page=${page}`);
            return data.data;
        },
        staleTime: 15 * 1000 * 60,
        refetchOnWindowFocus: true,
    });
}
