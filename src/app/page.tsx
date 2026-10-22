// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useAuth } from "@/hooks/use-auth";
// import { homeFor } from "@/lib/types";

// export default function Home() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading) router.replace(user ? homeFor(user.role) : "/login");
//   }, [loading, user, router]);

//   return <div className="p-10 text-center text-sm text-muted-foreground">Loading...</div>;
// }

import {
  Activity,
  CheckCircle2,
  Clock,
  Copy,
  FolderKanban,
  Filter,
  Gauge,
  GraduationCap,
  MessageSquare,
  Send,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { AuthCta } from "@/components/auth-cta";
import { HomeNav } from "@/components/home-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: ShieldCheck,
    title: "Role-based access",
    text: "Students submit, mentors and admins review. Permissions are enforced on the API with JWT, not just hidden in the UI.",
  },
  {
    icon: Copy,
    title: "No duplicate submissions",
    text: "Repository and live links are normalised and unique, so the same project can never be submitted twice.",
  },
  {
    icon: Gauge,
    title: "Built-in spam protection",
    text: "Per-user submission limits and brute-force protection on login keep the review queue clean.",
  },
  {
    icon: Filter,
    title: "Fast server-side filters",
    text: "Search, sort, paginate and filter by Approved, Rejected or Pending, all handled by the database.",
  },
  {
    icon: Activity,
    title: "Live review stats",
    text: "See pending, approved and rejected totals, approval rate and weekly activity at a glance.",
  },
  {
    icon: MessageSquare,
    title: "Feedback that helps",
    text: "Rejections include a reason. Students fix their project and resubmit without starting over.",
  },
];

const steps = [
  {
    icon: Send,
    title: "Submit",
    text: "A student adds the project name, repository, live link and a short description.",
  },
  {
    icon: Users,
    title: "Review",
    text: "A mentor opens the queue, checks the project and approves it or rejects it with feedback.",
  },
  {
    icon: CheckCircle2,
    title: "Track",
    text: "Everyone sees the outcome instantly. Rejected projects can be improved and resubmitted.",
  },
];

const mockRows = [
  {
    name: "Portfolio Website",
    by: "Ayesha K.",
    status: "pending" as const,
    label: "Pending",
  },
  {
    name: "Weather Dashboard",
    by: "Rafi H.",
    status: "approved" as const,
    label: "Approved",
  },
  {
    name: "Task Manager API",
    by: "Nusrat J.",
    status: "rejected" as const,
    label: "Rejected",
  },
];

const mockStats = [
  { label: "Total", value: "128", icon: FolderKanban, tone: "text-slate-500" },
  { label: "Pending", value: "24", icon: Clock, tone: "text-amber-500" },
  {
    label: "Approved",
    value: "87",
    icon: CheckCircle2,
    tone: "text-emerald-500",
  },
  { label: "Rejected", value: "17", icon: XCircle, tone: "text-red-500" },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen scroll-smooth bg-background"
      suppressHydrationWarning={true}
    >
      <HomeNav />

      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden border-b">
          {/* decorative background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_at_top,black,transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-72 w-160 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-40 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl"
          />

          <div className="container relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
            <div className="space-y-6">
              <Badge variant="outline" className="gap-2 bg-background/60 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Submit.
                Review. Improve.
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Project submissions,{" "}
                <span className="bg-linear-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                  reviewed with clarity.
                </span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                A simple workflow where students submit their work and mentors
                approve or reject it with feedback, with filters, stats and spam
                protection built in.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <AuthCta />
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {[
                  "Secure JWT auth",
                  "Light and dark themes",
                  "Server-side filtering",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* dashboard preview */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-emerald-500/20 via-transparent to-violet-500/20 blur-2xl"
              />
              <Card className="relative overflow-hidden shadow-xl">
                <div className="flex items-center gap-2 border-b px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs text-muted-foreground">
                    Review dashboard
                  </span>
                </div>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {mockStats.map(({ label, value, icon: Icon, tone }) => (
                      <div
                        key={label}
                        className="rounded-lg border bg-muted/50 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {label}
                          </span>
                          <Icon className={`h-4 w-4 ${tone}`} />
                        </div>
                        <div className="mt-1 text-2xl font-bold">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="divide-y rounded-lg border">
                    {mockRows.map((r) => (
                      <div
                        key={r.name}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {r.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {r.by}
                          </div>
                        </div>
                        <Badge variant={r.status}>{r.label}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ---------- Features ---------- */}
        <section id="features" className="container scroll-mt-20 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything a review workflow needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Thoughtful defaults for students and mentors, without the clutter.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <Card
                key={title}
                className="group transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="space-y-3 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-y bg-muted/40 py-20"
        >
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How it works
              </h2>
              <p className="mt-3 text-muted-foreground">
                Three simple steps from idea to approved project.
              </p>
            </div>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <li
                  key={title}
                  className="relative rounded-xl border bg-card p-6 shadow-sm"
                >
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                    Step {i + 1}
                  </span>
                  <Icon className="mb-3 mt-2 h-6 w-6 text-emerald-500" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Roles ---------- */}
        <section id="roles" className="container scroll-mt-20 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for two roles
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-4 p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-semibold">For students</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Submit a project with a validated form",
                    "Track Pending, Approved and Rejected status",
                    "Read mentor feedback and resubmit improvements",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{" "}
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4 p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
                  <Users className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-semibold">
                  For mentors and admins
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Paginated table with search, sorting and filters",
                    "Approve or reject with required feedback",
                    "Live stats and one-click CSV export",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />{" "}
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="container pb-20">
          <div className="relative overflow-hidden rounded-3xl border bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
            <div
              aria-hidden
              className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-emerald-400/30 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-violet-400/30 blur-3xl"
            />
            <div className="relative space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to submit your first project?
              </h2>
              <p className="mx-auto max-w-xl opacity-80">
                Create a free student account and get feedback from your mentors
                today.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <AuthCta className="h-11 border-primary-foreground/30 bg-background px-6 text-foreground hover:bg-background/90" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
          <span>
            &copy; {new Date().getFullYear()} Project Review. All rights
            reserved.
          </span>
          <span>Built with Next.js, Express, Prisma and PostgreSQL.</span>
        </div>
      </footer>
    </div>
  );
}
