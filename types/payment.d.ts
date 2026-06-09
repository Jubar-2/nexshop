declare module "payment" {
    interface withdrawalRequest {
        id: string;
        amount: number;
        paymentMethod: "BKASH" | "NAGAD";
        phoneNumber: number;
        status: "PENDING" | "APPROVED" | "REJECTED";
        createdAt: string;
        accountType: "AGENT" | "PERSONAL";
        freelancer: {
            user: {
                fullName: string;
                email: string;
            }
        }
        transactions: {
            trxID: string | null;
            fee: number;
            amount: number;
        }
    }
}