import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// --- API CALL (React Query) ---

export const useGetJobs = (filter: string, search: string, page: number) => {
    return useQuery({
        queryKey: ['admin-jobs', filter, search, page],
        queryFn: async () => {
            // Map UI filter to API status values
            const statusMap: Record<string, string> = {
                "Live": "ACTIVE",
                "Paused": "INACTIVE",
                "Completed": "COMPLETED"
            };

            const statusParam = filter !== "All" ? `&status=${statusMap[filter]}` : "";

            const { data } = await axios.get(
                `/api/admin/jobs?page=${page}&limit=15&search=${search}${statusParam}`
            );
            console.log(data.data)
            return data.data; // Your API nests data inside a data object
        },
        placeholderData: (previousData) => previousData,
    });
}

export const useGetJob = (id: string) => {
    return useQuery({
        queryKey: ["admin-get-job", id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/admin/jobs/${id}`);
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useGetSubmittedJobs = (page: number = 1, status: string, search: string) => useQuery({
    queryKey: ["admin-submitted-jobs", page, status, search],
    queryFn: async () => {
        const { data } = await axios.get(`/api/admin/submitted-jobs?page=${page}&status=${status}&search=${search}`);
        return data.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
})