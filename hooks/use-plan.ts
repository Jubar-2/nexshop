import { MemberShipUpgradeInput } from "@/lib/validations/membership";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Transaction {
    id: string;
    amount: number;
    fee: number;
    method: string;
    status: string;
    createdAt: string;
}

export interface WithdrawalResponse {
    data: Transaction[];
    meta: {
        totalPages: number;
        lastPage: number;
        currentPage: number;
    };
}

export interface offerType {
    id: string;
    offer: {
        id: string;
        offerTitle: string;
    }
}

export interface countType {
    freelancers: number;
}

export interface membershipType {
    id: string;
    membershipName: string;
    price: number;
    badgeText: null | string;
    icon: string;
    jobsSubmitLimit: string;
    title: string;
    color: string;
    period: number,
    description: null | string;
    planOrder: number;
    isDefault: boolean;
    offers: offerType[],
    _count: countType;
}

export const useGetPlans = () => {
    return useQuery({
        queryKey: ["plans"],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/freelancer/membership`
            );
            return data.data;
        },
        placeholderData: (prev) => prev,
        staleTime: (1000 * 60) * 72,
    });
};

export const useGetPlan = (id: string) =>
    useQuery({
        queryKey: ["plan", id],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/freelancer/membership/${id}`
            );
            return data.data;
        },
        placeholderData: (prev) => prev,
        staleTime: (1000 * 60) * 72,
    });

export const useUpgradeMembership = () =>
    useMutation({
        mutationFn: async (payload: MemberShipUpgradeInput) => {
            const response = await axios.post("/api/freelancer/membership/upgrade", payload);
            return response.data;
        }
    });