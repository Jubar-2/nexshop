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