import * as z from "zod";

export const SettingSchema = z.object({
    luckySpin: z.number("Lucky spin must be a number"),
    gen_1: z.number("Generation 1 must be a number"),
    gen_2: z.number("Generation 2 must be a number"),
    gen_3: z.number("Generation 3 must be a number"),
    job_par_refresh: z.number("Job refresh must be a number"),
    withdraw_fee: z.number("Withdrawal fee must be a number"),
    withdraw_limit: z.number("Withdraw limit must be a number"),

    luckySpinSwitch: z.boolean("Lucky spin switch must be true or false"),
    gen_2Switch: z.boolean("Gen 2 switch must be true or false"),
    gen_1SpinSwitch: z.boolean("Gen 1 switch must be true or false"),
    gen_3Switch: z.boolean("Gen 3 switch must be true or false"),

});

// Type inference for TypeScript
export type SettingSchemaInput = z.infer<typeof SettingSchema>;
