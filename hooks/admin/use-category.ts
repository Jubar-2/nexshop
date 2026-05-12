import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type subCatType = {
    id: string,
    name: string
}

export type categoryType = {
    id: string,
    name: string,
    icon: string,
    subCategories: subCatType[]
}

export const useGetCategory = (search: string) => {
    return useQuery({
        queryKey: ["category", search],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/admin/category?name=${search}`
            );
            return data.data;
        },
        placeholderData: (prev) => prev,
        staleTime: (1000 * 60) * 72,
    });
};