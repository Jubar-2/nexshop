import { z } from 'zod';

import { AccountType, PaymentMethod } from '@prisma/client';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const WithdrawSchema = z.object({

    amount: z.coerce
        .number("Amount must be a number")
        .min(50, "Minimum withdrawal amount is 50 BDT")
        .positive("Amount must be positive"),

    phoneNumber: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
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

export type WithdrawSchemaInput = z.infer<typeof WithdrawSchema>;


export const ChangeWithdrawStatusSchema = z.object({
    id: z.string().cuid({ message: "Invalid Request ID" }),
    invoiceId: z.string().cuid({ message: "Invalid Invoice ID" }),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"], {
        message: "Status must be either APPROVED or REJECTED",
    }),
});

export type ChangeWithdrawStatusSchemaInput = z.infer<typeof ChangeWithdrawStatusSchema>;

