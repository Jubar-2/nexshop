import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define strict interfaces for the API response
export interface FreelancerProfile {
    balance: number;
    // ... other fields
}

export const useFreelancerProfile = () => {
    return useQuery({
        queryKey: ["freelancer"],
        queryFn: async (): Promise<FreelancerProfile> => {
            const { data } = await axios.get("/api/freelancer");
            // Assuming your ApiResponse class wraps the data in a 'data' property
            return data.data;
        },
        staleTime: 1000 * 60, // 1 minute cache
        refetchOnWindowFocus: true,
    });
};

export const useGetProfile = () => {
    return useQuery({
        queryKey: ["Profile"],
        queryFn: async (): Promise<{ email: string }> => {
            const { data } = await axios.get("/api/freelancer/profile");
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useGetPandingEarnings = () => {
    return useQuery({
        queryKey: ["pandingEarnings"],
        queryFn: async () => {
            const { data } = await axios.get("/api/freelancer/pending-earnings");
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useGetTotalEarnings = () => {
    return useQuery({
        queryKey: ["totalEarned"],
        queryFn: async () => {
            const { data } = await axios.get("/api/freelancer/total-earned");
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}