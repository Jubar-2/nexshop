export type JobStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

export interface Category {
  name: string;
  icon: string;
}

export interface SubCategory {
  name: string;
}

export interface Job {
  id: string;
  jobTitle: string;
  targetLink: string;
  description: string;
  workerRequired: number;
  reward: number; // better: convert in backend
  status: JobStatus;
  createdAt: string;
  category: Category;
  subCategory: SubCategory;
  submissionCount: number,
}

export type userType = {
  email: string;
  fullName: string;
  avatar: string | null;
}

export type SubmittedJob = {
  id: string;
  jobId: string;
  freelancerId: string;
  submissionNotes: string;
  proofAttachment: string;
  profileLink: string;
  reward: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  job: Job;

  freelancer: {
    id: string;
    user: userType;
  }

};