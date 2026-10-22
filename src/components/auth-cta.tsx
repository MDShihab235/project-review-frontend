"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { homeFor } from "@/lib/types";

/** Auth-aware call-to-action buttons (guest vs logged-in). */
export function AuthCta({ className = "h-11 px-6" }: { className?: string }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-11 w-56" aria-hidden />;

  if (user) {
    return (
      <Button asChild className={className}>
        <Link href={homeFor(user.role)}>
          {user.role === "STUDENT"
            ? "Go to my submissions"
            : "Open review dashboard"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild className={className}>
        <Link href="/signup">
          Get started free <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" className={className}>
        <Link href="/login">Log in</Link>
      </Button>
    </>
  );
}
