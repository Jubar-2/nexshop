import db from "../db";
import { Prisma } from "@prisma/client";

type FreelancerWithPlan = Prisma.FreelancerGetPayload<{
    include: {
        membershipPlan: true,
        skills: true
    }
}>

export default class FreelancerService {
    private readonly freelancerId: string;

    constructor(freelancerId: string) {
        this.freelancerId = freelancerId;
    }

    /**
     * Fetches the complete profile including membership details.
     * Throws an error if not found to be handled by the global error handler.
     */
    public async getFullProfile(): Promise<FreelancerWithPlan> {
        try {
            const profile = await db.freelancer.findUnique({
                where: { id: this.freelancerId },
                include: {
                    membershipPlan: true,
                    skills: true
                }
            });

            if (!profile) {
                throw new Error(`Freelancer with ID ${this.freelancerId} not found`);
            }

            return profile;
        } catch (error) {
            console.error("[FREELANCER_SERVICE_PROFILE_ERROR]:", error);
            throw error;
        }
    }


    public async getActivePlan(): Promise<Prisma.MembershipPlanGetPayload<object> | null> {

        const getFullProfile = await this.getFullProfile();

        return getFullProfile.membershipPlan || null;
    }

    public async getSkill(): Promise<Prisma.SkillGetPayload<object>[] | null | []> {
        const getFullProfile = await this.getFullProfile();
        return getFullProfile.skills || null;
    }

    public async lowestPrice() {
        const getActivePlan = await this.getActivePlan();

        if (!getActivePlan) {
            throw new Error("Active plan not found");
        }

        // get upper membership 
        const totalFreelancers = await db.freelancer.count({
            where: {
                membershipPlan: {
                    planOrder: {
                        gt: getActivePlan.planOrder
                    }
                }
            }
        });

        const limit = totalFreelancers * 5;

        // get last jobs price
        const topJobs = await db.jobs.findMany({
            take: limit,
            orderBy: {
                reward: "desc"
            },
            select: {
                reward: true
            }
        });


        if (topJobs.length <= 0) {
            return 0;
        }

        // lowest price from top 3
        const lowestPrice = Math.min(...topJobs.map(job => job.reward));

        // get lowest price
        return lowestPrice;
    }



    public async findJobs() {

        const lowestPrice = await this.lowestPrice()
        const skill = await this.getSkill();

        const reward = lowestPrice <= 0 ? { gt: lowestPrice } : { ls: lowestPrice }

        const jobs = await db.jobs.findMany({
            where: { reward },
            take: 5,
            orderBy: {
                reward: "desc"
            },
            include: {
                category: true,
                subCategory: true,
            }
        });

        if (jobs.length <= 0) {
            const lowerJobs = await db.jobs.findMany({
                take: 5,
                orderBy: {
                    reward: "asc"
                },
                include: {
                    category: true,
                    subCategory: true,
                }
            });

            jobs.push(...lowerJobs)
        }


        const subCategoryJob = jobs.sort((A, B) => {
            const skillA = skill?.find((sk) => A.subCategoryId === sk.subCategoryId)
            const skillB = skill?.find((sk) => B.subCategoryId === sk.subCategoryId)

            const scoreA = skillA?.successRate || 0
            const scoreB = skillB?.successRate || 0

            if (scoreA !== scoreB) {
                return scoreB - scoreA;
            }

            return new Date(B.createdAt).getTime() - new Date(A.createdAt).getTime();
        }).slice(0, 5)
        
        return subCategoryJob;

    }


}