import { z } from "zod";

const GIT_HOSTS = ["github.com", "gitlab.com", "bitbucket.org"];

const httpsUrl = z
  .string()
  .trim()
  .min(1, "This field is required")
  .max(300, "URL is too long")
  .url("Enter a valid URL")
  .refine((v) => v.toLowerCase().startsWith("https://"), "URL must start with https://");

export const projectSchema = z.object({
  name: z.string().trim().min(3, "Project name must be at least 3 characters").max(100),
  repoUrl: httpsUrl.refine((v) => {
    try {
      const u = new URL(v);
      return GIT_HOSTS.includes(u.hostname.replace(/^www\./, "")) && u.pathname.split("/").filter(Boolean).length >= 2;
    } catch {
      return false;
    }
  }, "Use a GitHub, GitLab or Bitbucket repository URL (e.g. https://github.com/user/repo)"),
  liveUrl: httpsUrl.refine((v) => {
    try {
      return new URL(v).hostname.includes(".");
    } catch {
      return false;
    }
  }, "Enter a publicly reachable URL"),
  description: z.string().trim().min(20, "Description must be at least 20 characters").max(1000, "Max 1000 characters"),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    email: z.string().trim().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Za-z]/, "Must contain a letter")
      .regex(/\d/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });
export type SignupValues = z.infer<typeof signupSchema>;
