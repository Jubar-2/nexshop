import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";

export async function GET(request: Request) {
    const settingsData = [
        {
            key: "luckySpin",
            value: 0,
        },
        {
            key: "gen_1",
            value: 10,
        },
        {
            key: "gen_2",
            value: 7,
        },
        {
            key: "gen_3",
            value: 5,
        },
        {
            key: "job_par_refresh",
            value: 5,
        }
    ];

    const settings = await db.settings.createMany({
        data: settingsData
    })

    return ApiResponse.success(settings, "add demo data")
}