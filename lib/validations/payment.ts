import { z } from 'zod';

import { AccountType, PaymentMethod } from '@prisma/client';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';


// export const WithdrawSchema = z.object({

//     amount: z
//         .number("Amount must be a number")
//         .min(minAmount.value, "Minimum withdrawal amount is 50 BDT")
//         .positive("Amount must be positive"),

//     phoneNumber: z.string().refine((val) => isValidPhoneNumber(val), {
//         message: "Invalid phone number",
//     }),

//     accountType: z.nativeEnum(AccountType)
//         .superRefine((val, ctx) => {
//             if (!Object.values(AccountType).includes(val)) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: "Your custom error message here",
//                 });
//             }
//         }),

//     paymentMethod: z.nativeEnum(PaymentMethod)
//         .superRefine((val, ctx) => {
//             if (!Object.values(PaymentMethod).includes(val)) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: "Invalid payment method",
//                 });
//             }
//         }),
// });


export const WithdrawSchema = (minAmount: number) =>
    z.object({
        amount: z
            .number()
            .min(minAmount, `Minimum withdrawal amount is ${minAmount} BDT`)
            .positive("Amount must be positive"),

        // phoneNumber: z.string().refine((val) => isValidPhoneNumber(val), {
        //     message: "Invalid phone number",
        // }),

        phoneNumber: z.string()
            .min(1, "Phone number is required")
            .refine(val => {
                // Reject if starts with a single digit without 0 or + prefix
                // 1703165333 → invalid (missing leading 0 or +880)
                if (/^[1-9]\d{9}$/.test(val.trim())) return false;

                const normalized = /^01[3-9]\d{8}$/.test(val.trim())
                    ? `+880${val.trim()}`
                    : val.trim();

                return isValidPhoneNumber(normalized, "BD");
            }, {
                message: "Enter a valid phone number (e.g. 01703165330 or +8801703165330)",
            })
            .transform(val => {
                const normalized = /^01[3-9]\d{8}$/.test(val.trim())
                    ? `+880${val.trim()}`
                    : val.trim();
                return parsePhoneNumber(normalized, "BD").format("E.164");
            }),

        accountType: z.nativeEnum(AccountType)
            .superRefine((val, ctx) => {
                if (!Object.values(AccountType).includes(val)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Your custom error message here",
                    });
                }
            }),

        paymentMethod: z.nativeEnum(PaymentMethod)
            .superRefine((val, ctx) => {
                if (!Object.values(PaymentMethod).includes(val)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Invalid payment method",
                    });
                }
            }),
    });

export type WithdrawSchemaInput = z.infer<ReturnType<typeof WithdrawSchema>>;


export const ChangeWithdrawStatusSchema = z.object({
    id: z.string().cuid({ message: "Invalid Request ID" }),
    trxID: z.string().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"], {
        message: "Status must be either APPROVED or REJECTED",
    }),
});

export type ChangeWithdrawStatusSchemaInput = z.infer<typeof ChangeWithdrawStatusSchema>;

