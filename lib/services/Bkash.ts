import {
    BkashTokenResponse,
    BkashCreatePaymentResponse,
    BkashExecuteResponse
} from "@/types/bkash";

export class BkashService {
    private static instance: BkashService;
    private readonly baseUrl: string;
    private idToken: string | null = null;

    private constructor() {
        this.baseUrl = process.env.BKASH_IS_SANDBOX === "true"
            ? "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout"
            : "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout";
    }

    public static getInstance(): BkashService {
        if (!BkashService.instance) BkashService.instance = new BkashService();
        return BkashService.instance;
    }

    /**
     * Internal Method: Grant Token
     * Fetches authorization token from bKash
     */
    private async grantToken(): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/token/grant`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    app_key: process.env.BKASH_APP_KEY!,
                    app_secret: process.env.BKASH_APP_SECRET!,
                },
                body: JSON.stringify({
                    username: process.env.BKASH_USERNAME!,
                    password: process.env.BKASH_PASSWORD!,
                }),
            });

            const data: BkashTokenResponse = await response.json();
            this.idToken = data.id_token;
            return data.id_token;
        } catch (error) {
            console.error("[BKASH_AUTH_ERROR]:", error);
            throw new Error("bKash Authentication Failed");
        }
    }

    /**
     * Create Payment
     * Used for both Deposits and Membership upgrades
     */
    public async createPayment(amount: number, orderID: string): Promise<BkashCreatePaymentResponse> {
        const token = await this.grantToken();

        const response = await fetch(`${this.baseUrl}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                app_key: process.env.BKASH_APP_KEY!,
            },
            body: JSON.stringify({
                mode: "0011", // Checkout mode
                payerReference: orderID,
                callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/bkash/callback`,
                amount: amount.toFixed(2),
                currency: "BDT",
                intent: "sale",
                merchantInvoiceNumber: orderID,
            }),
        });

        return await response.json();
    }

    /**
     * Execute Payment
     * Finalizes the transaction after user enters PIN/OTP
     */
    public async executePayment(paymentID: string): Promise<BkashExecuteResponse> {
        const token = this.idToken || (await this.grantToken());

        const response = await fetch(`${this.baseUrl}/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                app_key: process.env.BKASH_APP_KEY!,
            },
            body: JSON.stringify({ paymentID }),
        });

        const result = await response.json();

        if (result.errorCode) {
            throw new Error(`bKash Execution Error: ${result.errorMessage}`);
        }

        return result;
    }
}

export const bkash = BkashService.getInstance();