"use client";

import { AuthGuard } from "@/components/auth-guard";
import { ReviewTable } from "@/components/review-table";
import { StatCards } from "@/components/stat-cards";

export default function DashboardPage() {
  return (
    <AuthGuard roles={["MENTOR", "ADMIN"]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review dashboard</h1>
        <p className="text-sm text-muted-foreground">Review student submissions and track progress.</p>
      </div>
      <StatCards />
      <ReviewTable />
    </AuthGuard>
  );
}
