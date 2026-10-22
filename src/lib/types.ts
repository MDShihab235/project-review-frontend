export type Role = "STUDENT" | "MENTOR" | "ADMIN";
export type ProjectStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: ProjectStatus;
  feedback: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  submittedBy: { id: string; name: string; email: string };
  reviewedBy: { id: string; name: string } | null;
}

export interface Paginated<T> {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  approvalRate: number;
  submittedLast7Days: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  status?: ProjectStatus | "ALL";
  search?: string;
  sortBy?: "createdAt" | "name";
  order?: "asc" | "desc";
}

export const homeFor = (role: Role) =>
  role === "STUDENT" ? "/student" : "/dashboard";
