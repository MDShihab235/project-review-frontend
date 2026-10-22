"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { homeFor, type Role } from "@/lib/types";

/** Client-side route protection. The API still enforces roles on every request. */
export function AuthGuard({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowed = !!user && roles.includes(user.role);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (!allowed) router.replace(homeFor(user.role));
  }, [loading, user, allowed, router]);

  if (loading || !allowed) {
    return (
      <div className="container space-y-4 py-10">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container space-y-6 py-8">{children}</main>
    </>
  );
}
