import { MemberShipUpgradeStatusChangeInput } from "@/lib/validations/membership";
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios";

export const useUpdateMembershipStatus = () => useMutation({
    mutationFn: async (payload: MemberShipUpgradeStatusChangeInput) => {
        const response = await axios.patch("/api/admin/membership/request/change-status", payload);
        return response.data;
    }
});

export const useGetMembershipRequests = (page: number, filter: string, debouncedSearch: string) => useQuery({
    queryKey: ["admin-submitted-jobs", page, filter, debouncedSearch],
    queryFn: async () => {
        const { data } = await axios.get(`/api/admin/membership/request?page=${page}&status=${filter}&search=${debouncedSearch}`);
        return data.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
});