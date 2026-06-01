import { AvatarSchemaInput, ProfileSchemaInput } from "@/lib/validations/profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFreelancerProfile = () => {
    return useQuery({
        queryKey: ["freelancer"],
        queryFn: async () => {
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
        queryFn: async (): Promise<FreelancerProfile> => {
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

export const useGetTotalReview = () => {
    return useQuery({
        queryKey: ["totalReview"],
        queryFn: async () => {
            const { data } = await axios.get("/api/freelancer/jobs/submited-jobs/review");
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useGetTotalJobsNumber = () => {
    return useQuery({
        queryKey: ["totalJobsNumber"],
        queryFn: async () => {
            const { data } = await axios.get("/api/freelancer/jobs/jobs-count");
            return data.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: async (profileData: ProfileSchemaInput) => {
            const { data } = await axios.patch("/api/freelancer/profile/update", profileData);
            return data.data;
        }
    });
}

export const useUpdateProfilePicture = () => {
    return useMutation({
        mutationFn: async (profileData: FormData) => {
            const { data } = await axios.patch("/api/freelancer/profile/update/avatar", profileData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return data.data;
        }
    });
}