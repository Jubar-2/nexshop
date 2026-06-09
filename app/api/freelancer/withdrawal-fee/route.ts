import { ApiResponse } from "@/lib/apiResponse";
import Settings from "@/lib/Settings";

export async function GET() {
    try {

        const settingsData = new Settings();
        const withdrawFee = await settingsData.withdrawFee();
        const withdrawBalance = await settingsData.minWithdrawAmount();

        if (!withdrawFee || !withdrawBalance) {
            return ApiResponse.error("Withdrawal fee is not found", 401);
        }

        return ApiResponse.success(
            {
                fee: withdrawFee.value,
                minWithdrawAmount: withdrawBalance.value
            },
            "Get withdrawal fee data");

    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while fetching the profile data"
        )
    }
}