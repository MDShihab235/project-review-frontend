"use client";

import { ClipboardCheck, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <ClipboardCheck className="h-5 w-5" />
          Project Review
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="hidden text-right text-sm leading-tight sm:block">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
              <Badge variant="secondary">{user.role}</Badge>
            </>
          )}
          <ThemeToggle />
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await logout();
                router.replace("/login");
              }}
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
