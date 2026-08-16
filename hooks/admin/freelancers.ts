import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetFreelancers = (page: number, search: string) => {
    return useQuery({
        queryKey: ["admin-freelancers", page, search],
        queryFn: async () => {
            const { data } = await axios.get(`/api/admin/freelancers?page=${page}&search=${search}`);
            return data.data;
        },
        staleTime: 15 * 1000 * 60,
        refetchOnWindowFocus: true,
    });
}
