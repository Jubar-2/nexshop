import { Prisma } from "@prisma/client";
import { generateCode } from "@/lib/referral";

export class AuthService {
  /**
   * Registers a freelancer profile within an existing transaction.
   */
  public static async registerFreelancer(
    tx: Prisma.TransactionClient, 
    userId: string, 
    planId: string
  ) {
    // Generate unique key using the circuit-breaker logic we built earlier
    const referKey = await this.generateUniqueKey(tx);

    return await tx.freelancer.create({
      data: {
        userId,
        memberPlanId: planId,
        referKey,
      },
    });
  }

  private static async generateUniqueKey(tx: Prisma.TransactionClient): Promise<string> {
    const MAX_RETRIES = 5;
    for (let i = 0; i < MAX_RETRIES; i++) {
      const code = `REF-${generateCode()}`; // Uses your nanoid util
      const exists = await tx.freelancer.findUnique({
        where: { referKey: code },
        select: { id: true }
      });
      if (!exists) return code;
    }
    throw new Error("REFERRAL_GENERATION_FAILED");
  }
}