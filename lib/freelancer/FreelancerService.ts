import db from "@/lib/db";
import { Prisma } from "@prisma/client";

// Use the Prisma-generated types for perfect autocomplete
type FreelancerWithPlan = Prisma.FreelancerGetPayload<{
    include: { membershipPlan: true; skills: true }
}>;

export default class FreelancerService {
    private readonly userId: string;
    // private readonly freelancerId: string;
    private cachedProfile: FreelancerWithPlan | null = null;

    constructor(userId: string) {
        this.userId = userId;
    }

    /**
     * Optimization: One database trip for profile & dependencies.
     */
    private async getProfile(): Promise<FreelancerWithPlan> {
        if (this.cachedProfile) return this.cachedProfile;

        const profile = await db.freelancer.findUnique({
            where: { userId: this.userId },
            include: { membershipPlan: true, skills: true }
        });

        if (!profile) throw new Error("Freelancer account not found");
        this.cachedProfile = profile;
        return profile;
    }

    /**
     * Logic: Calculate the "Earnings Ceiling" for this tier.
     * Prevents lower tiers from exhausting premium job budgets immediately.
     */
    private async getPriceThreshold(planOrder: number): Promise<number> {
        const higherTierCount = await db.freelancer.count({
            where: { membershipPlan: { planOrder: { gt: planOrder } } }
        });

        /**
        * Take vale will come to setting table
        */
        // Limit the pool based on competition in higher tiers
        const fetchLimit = higherTierCount * 5;

        if (fetchLimit <= 0) return 0;

        const topJobs = await db.jobs.findMany({
            where: { status: "ACTIVE" },
            take: fetchLimit,
            orderBy: { reward: "desc" },
            select: { reward: true }
        });

        if (topJobs.length === 0) return 0;

        // Return the bottom price of the current 'Premium' bucket
        return Number(topJobs[topJobs.length - 1].reward);
    }

    /**
     *  Job Discovery Algorithm
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
                status: "ACTIVE",
                submissionCount: {
                    lt: db.jobs.fields.workerRequired
                },
                NOT: {
                    submissions: {
                        some: {
                            freelancerId: profile.id
                        }
                    }
                }
            },
            take: 20,
            orderBy: { reward: "desc" },
            include: { category: true, subCategory: true }
        });

        // If no high-paying jobs, fallback to general available jobs
        let pool = jobs;
        if (pool.length < 5) {
            const fallback = await db.jobs.findMany({
                where: {
                    status: "ACTIVE",
                    NOT: {
                        submissions: {
                            some: {
                                freelancerId: profile.id
                            }
                        }
                    }
                },
                take: 10,
                orderBy: { createdAt: "asc" },
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

            // If user is better at one type of job, show that first
            if (skillA !== skillB) return skillB - skillA;

            // Finally, show newest
            return b.createdAt.getTime() - a.createdAt.getTime();
        }).slice(0, 5); // Return top 5 best matches for the user
    }

    /**
    * Highly Professional Paginated Submissions
    * @param page - Current page number (starts at 1)
    * @param limit - Number of items per page
    */
    public async getSubmittedJobs(page: number = 1, limit: number = 10) {
        const profile = await this.getProfile();

        // 1. Calculate the offset (how many records to skip)
        const skip = (page - 1) * limit;

        // 2. Run both queries in PARALLEL for maximum performance (Senior Dev trick)
        // We need the COUNT to calculate total pages for the UI
        const [totalCount, jobs] = await Promise.all([
            db.submittedJob.count({
                where: { freelancerId: profile.id }
            }),
            db.submittedJob.findMany({
                where: { freelancerId: profile.id },
                select: {
                    id: true,
                    submissionNotes: true,
                    proofAttachment: true,
                    profileLink: true,
                    status: true,
                    submittedAt: true,
                    job: {
                        select: {
                            id: true,
                            jobTitle: true,
                            targetLink: true,
                            description: true,
                            workerRequired: true,
                            submissionCount: true,
                            categoryId: true,
                            subCategoryId: true,
                            reward: true,
                            status: true,
                        }
                    }
                },
                skip: skip,
                take: limit,
                orderBy: { submittedAt: "desc" }
            })
        ]);

        // 3. Return structured data with Metadata
        return {
            jobs,
            meta: {
                total: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: skip + limit < totalCount,
                hasPreviousPage: page > 1
            }
        };
    }

    public async getSubmittedJob(id: string) {
        const profile = await this.getProfile();
        const job = await db.submittedJob.findFirst({
            where: { freelancerId: profile.id, jobId: id },
            select: {
                id: false,
                submissionNotes: true,
                proofAttachment: true,
                profileLink: true,
                status: true,
                submittedAt: true,
                job: {
                    select: {
                        id: true,
                        jobTitle: true,
                        targetLink: true,
                        description: true,
                        workerRequired: true,
                        submissionCount: true,
                        categoryId: true,
                        subCategoryId: true,
                        reward: true,
                        status: true,
                    }

                }
            },
        });

        return job;
    }
}