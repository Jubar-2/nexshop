import db from "@/lib/db";
import { Prisma } from "@prisma/client";

// --- Types for Autocomplete ---
type FreelancerWithPlan = Prisma.FreelancerGetPayload<{
    include: { membershipPlan: true; skills: true }
}>;

export default class FreelancerService {
    private readonly freelancerId: string; // Use string for CUID
    private cachedProfile: FreelancerWithPlan | null = null;

    constructor(freelancerId: string) {
        this.freelancerId = freelancerId;
    }

    /**
     * Optimization: Memoized Profile Fetcher
     * Ensures we only hit the DB once per request for the profile.
     */
    private async getProfile(): Promise<FreelancerWithPlan> {
        if (this.cachedProfile) return this.cachedProfile;

        const profile = await db.freelancer.findUnique({
            where: { id: this.freelancerId },
            include: { membershipPlan: true, skills: true }
        });

        if (!profile) throw new Error("Freelancer not found");
        this.cachedProfile = profile;
        return profile;
    }

    /**
     * Logic: Calculate the "Price Floor" based on membership tier.
     * This ensures high-tier members see the highest-paying jobs first.
     */
    private async getPriceThreshold(planOrder: number): Promise<number> {
        // Find how many people are 'above' this freelancer in rank
        const higherTierCount = await db.freelancer.count({
            where: { membershipPlan: { planOrder: { gt: planOrder } } }
        });

        const fetchLimit = Math.max(higherTierCount * 5, 10);

        const topJobs = await db.jobs.findMany({
            take: fetchLimit,
            orderBy: { reward: "desc" },
            select: { reward: true }
        });

        if (topJobs.length === 0) return 0;
        
        // Return the lowest price from the 'top' bucket
        return Number(topJobs[topJobs.length - 1].reward);
    }

    /**
     * Core Algorithm: findJobs
     * 1. Fetches profile & skills in one trip.
     * 2. Calculates price threshold.
     * 3. Fetches jobs near that threshold.
     * 4. Ranks them by freelancer skill success rate.
     */
    public async findJobs() {
        const profile = await this.getProfile();
        const skills = profile.skills;
        const plan = profile.membershipPlan;

        if (!plan) throw new Error("No active membership plan found");

        const threshold = await this.getPriceThreshold(plan.planOrder);

        // Fetch jobs around the threshold
        // We fetch slightly more than we need (take: 20) to allow for better ranking
        const jobs = await db.jobs.findMany({
            where: {
                reward: { gte: threshold },
                status: "ACTIVE"
            },
            take: 20, 
            orderBy: { reward: "desc" },
            include: { category: true, subCategory: true }
        });

        // If no high-paying jobs, fallback to general available jobs
        let pool = jobs;
        if (pool.length < 5) {
            const fallback = await db.jobs.findMany({
                where: { status: "ACTIVE" },
                take: 10,
                orderBy: { createdAt: "desc" },
                include: { category: true, subCategory: true }
            });
            pool = [...pool, ...fallback];
        }

        /**
         * PROFESSIONAL RANKING ALGORITHM
         * Sort Priority: 
         * 1. Success Rate in that specific subcategory (weighted)
         * 2. Reward Amount
         * 3. Recency (Newest first)
         */
        return pool.sort((a, b) => {
            const skillA = skills.find(s => s.subCategoryId === a.subCategoryId)?.successRate || 0;
            const skillB = skills.find(s => s.subCategoryId === b.subCategoryId)?.successRate || 0;

            // 1. If user is better at one type of job, show that first
            if (skillA !== skillB) return skillB - skillA;

            // 2. If skills are equal, show higher reward
            const rewardA = Number(a.reward);
            const rewardB = Number(b.reward);
            if (rewardA !== rewardB) return rewardB - rewardA;

            // 3. Finally, show newest
            return b.createdAt.getTime() - a.createdAt.getTime();
        }).slice(0, 5); // Return top 5 best matches for the user
    }
}