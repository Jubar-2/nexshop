import { ApiResponse } from "@/lib/apiResponse";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { SettingSchema } from "@/lib/validations/settings";
import { revalidateTag } from "next/cache";

export async function PATCH(request: Request) {
    try {

        // Safe JSON parsing with error handling
        const body = await request.json().catch(() => null);
        if (!body) {
            return ApiResponse.error("Invalid JSON payload", 400);
        }

        // Validate input using Zod schema
        const validation = SettingSchema.safeParse(body);
        if (!validation.success) {
            return ApiResponse.error(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        // Extract validated data
        const {
            luckySpin,
            gen_1,
            gen_2,
            gen_3,
            job_par_refresh,
            withdraw_fee,
            withdraw_limit,

            // switches
            luckySpinSwitch,
            gen_2Switch,
            gen_1SpinSwitch,
            gen_3Switch,
        } = validation.data;


        // Create the job in the database
        const result = await db.$transaction(async (tx) => {
            const settings = await tx.settings.update({
                where: {
                    key: "luckySpin"
                },
                data: {
                    value: luckySpin,
                    switch: luckySpinSwitch
                },
            });

            await tx.settings.update({
                where: {
                    key: "gen_1"
                },
                data: {
                    value: gen_1,
                    switch: gen_1SpinSwitch
                },
            });

            await tx.settings.update({
                where: {
                    key: "gen_2"
                },
                data: {
                    value: gen_2,
                    switch: gen_2Switch
                },
            });

            await tx.settings.update({
                where: {
                    key: "gen_3"
                },
                data: {
                    value: gen_3,
                    switch: gen_3Switch
                },
            });

            await tx.settings.update({
                where: {
                    key: "job_par_refresh"
                },
                data: {
                    value: job_par_refresh
                },
            });

            await tx.settings.update({
                where: {
                    key: "withdraw_fee"
                },
                data: {
                    value: withdraw_fee
                },
            });

            await tx.settings.update({
                where: {
                    key: "withdraw_limit"
                },
                data: {
                    value: withdraw_limit
                },
            });

            return settings;
        });

        revalidateTag("settings", "max")

        return ApiResponse.success(result, "Settings created successfully", 201);

    } catch (error: unknown) {

        console.error("SETTINGS_CREATE_ERROR:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2000") {
                return ApiResponse.error(
                    "Value too long for one of the fields",
                    400
                );
            }

            if (error.code === "P2003") {
                return ApiResponse.error(
                    "User id is not exist",
                    400
                );
            }
        }

        return ApiResponse.error("Failed to create job", 500);
    }
}