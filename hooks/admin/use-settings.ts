import { SettingSchemaInput } from "@/lib/validations/settings";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetSettings = () => {
    return useQuery({
        queryKey: ["admin-settings"],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/admin/settings`
            );
            return data.data;
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60,
    });
};

export const useUpdateSettings = () => {
    return useMutation({
        mutationFn: async (data: SettingSchemaInput) => {
            const response = await axios.patch(`/api/admin/settings/update`, {
                luckySpin: data.luckySpin,
                gen_1: data.gen_1,
                gen_2: data.gen_2,
                gen_3: data.gen_3,
                job_par_refresh: data.job_par_refresh,
                withdraw_fee: data.withdraw_fee,
                withdraw_limit: data.withdraw_limit,

                // switches
                luckySpinSwitch: data.luckySpinSwitch,
                gen_2Switch: data.gen_2Switch,
                gen_1SpinSwitch: data.gen_1SpinSwitch,
                gen_3Switch: data.gen_3Switch,
            });

            return response.data;
        }
    })
}