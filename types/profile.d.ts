type MembershipOffer = {
    id: string;
    membershipPlanId: string;
    offerId: string;
};

type MembershipPlan = {
    id: string;
    period: number;
    membershipName: string;
    description: string | null;
    jobsSubmitLimit: number;
    offers: MembershipOffer[];
};

type addressType = {
    country: string;
    division: string;
    district: string;
    subDivision: string;
    postalCode: string;
    addressLine1: string;
    subDistrict: string;
}

type freelancerType = {
    currentBalance: number;
    membershipPlan: MembershipPlan;
    description: null | string;
    id: string;
    jobsSubmitLimit: number;
    membershipName: number;
    referralBalance: number;
    period: number;
    planOrder: number;
    referKey: string;
    totalApproved: number;
    totalRejected: number;
    totalSubmitted: number;
    totalSuccessRate: number;
}

type FreelancerProfile = {
    fullName: string;
    email: string;
    verifyCodeExpiry: string,
    phoneNumber: string;
    address: addressType;
    freelancer: freelancerType;
    planOrder: number;
    referKey: string;
    avatar: string;
    totalApproved: number;
    totalRejected: number;
    totalSubmitted: number;
    totalSuccessRate: number;
};