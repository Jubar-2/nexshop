import { ApiResponse } from "@/lib/apiResponse";
import Settings from "@/lib/Settings";

export async function GET() {
    try {

        const settingsData = new Settings();
        const allSettingsData = await settingsData.allSettings();

        if (!allSettingsData) {
            return ApiResponse.error("Withdrawal fee is not found", 401);
        }
        
        return ApiResponse.success(allSettingsData, "Get withdrawal fee data")

    } catch (error) {
        console.log(error)
        return ApiResponse.fatal(
            "An internal server error occurred while fetching the profile data"
        )
    }
}