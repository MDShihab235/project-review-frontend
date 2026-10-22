import type { ListParams, Paginated, Project, Stats, User } from "./types";
import type { LoginValues, ProjectFormValues } from "./validators";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: { field: string; message: string }[],
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (res.status === 204) return undefined as T;
  const json = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      res.status,
      json?.message ?? "Something went wrong",
      json?.errors,
    );
  return json.data as T;
}

const qs = (params: object) => {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== "ALL") s.set(k, String(v));
  });
  return s.toString();
};

const json = (body: unknown) => ({ body: JSON.stringify(body) });

export const api = {
  // auth
  signup: (b: Omit<LoginValues, never> & { name: string }) =>
    request<{ user: User }>("/auth/signup", {
      method: "POST",
      ...json(b),
    }).then((r) => r.user),
  login: (b: LoginValues) =>
    request<{ user: User }>("/auth/login", { method: "POST", ...json(b) }).then(
      (r) => r.user,
    ),
  logout: () => request<void>("/auth/logout", { method: "POST" }),
  me: () => request<User>("/auth/me"),

  // student
  createProject: (b: ProjectFormValues) =>
    request<Project>("/projects", { method: "POST", ...json(b) }),
  updateProject: (id: string, b: ProjectFormValues) =>
    request<Project>(`/projects/${id}`, { method: "PATCH", ...json(b) }),
  deleteProject: (id: string) =>
    request<void>(`/projects/${id}`, { method: "DELETE" }),
  myProjects: (p: ListParams) =>
    request<Paginated<Project>>(`/projects/mine?${qs(p)}`),

  // mentor / admin
  listProjects: (p: ListParams) =>
    request<Paginated<Project>>(`/projects?${qs(p)}`),
  stats: () => request<Stats>("/projects/stats"),
  review: (
    id: string,
    b: { status: "PENDING" | "APPROVED" | "REJECTED"; feedback?: string },
  ) =>
    request<Project>(`/projects/${id}/review`, { method: "PATCH", ...json(b) }),
  async exportCsv(p: ListParams) {
    const res = await fetch(
      `${BASE}/projects/export.csv?${qs({ status: p.status, search: p.search })}`,
      {
        credentials: "include",
      },
    );
    if (!res.ok) throw new ApiError(res.status, "Export failed");
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.csv";
    a.click();
    URL.revokeObjectURL(url);
  },
};
