import * as z from "zod";

const offersFiled = {
    offerTitle: z.string()
        .min(10, "Offer title must be at least 10 characters")
        .max(100, "Offer title must be at most 100 characters")
}

export const OffersInSchema = z.object({ ...offersFiled });

// Type inference for TypeScript
export type OffersInput = z.infer<typeof OffersInSchema>;


export const OffersUpdateInSchema = z.object({
    ...offersFiled,
    id: z.string("Offer id must be need").cuid("Invalid id format"),
});

// Type inference for TypeScript
export type OffersUpdateInput = z.infer<typeof OffersUpdateInSchema>;
