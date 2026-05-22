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

export const useGetJob = (id: string) => {
    return useQuery({
        queryKey: ["get-job", id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/freelancer/jobs/${id}`);
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useGetSpin = () => {
    return useQuery({
        queryKey: ["get-spin"],
        queryFn: async () => {
            const { data } = await axios.get("/api/freelancer/lucky-spin");
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}